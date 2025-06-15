
"use client";

import { useMemo } from 'react';
import { useStudyStore } from '@/store/useStudyStore';
import type { Session, Task } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, PieChartIcon, BookOpenText } from 'lucide-react';
import { formatDuration } from '@/lib/utils';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { Bar, BarChart as RechartsBarChart, Pie, PieChart as RechartsPieChart, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip, Legend as RechartsLegend, Cell } from 'recharts';
import { CHART_COLORS } from '@/lib/chartColors';

interface SubjectTime {
  name: string;
  totalTime: number;
  category?: string;
}

const DEFAULT_CHART_COLORS = ['#4285F4', '#FF5722', '#34A853', '#FBBC05', '#EA4335', '#DA62F3'];


export function SubjectBreakdown() {
  const sessions = useStudyStore((state) => state.sessions);
  const tasks = useStudyStore((state) => state.tasks);

  const subjectTimes = useMemo(() => {
    const subjectMap: Map<string, { totalTime: number; category?: string }> = new Map();

    sessions.forEach(session => {
      const task = tasks.find(t => t.id === session.taskId);
      const taskName = task ? task.name : session.taskName; 
      const category = task?.category;

      const key = category ? `${category}: ${taskName}` : taskName;

      if (subjectMap.has(key)) {
        subjectMap.get(key)!.totalTime += session.duration;
      } else {
        subjectMap.set(key, { totalTime: session.duration, category });
      }
    });

    return Array.from(subjectMap.entries())
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.totalTime - a.totalTime);
  }, [sessions, tasks]);

  const chartData = subjectTimes.map(st => ({ name: st.name, value: st.totalTime }));
  const barChartData = subjectTimes.map(st => ({ name: st.name, "学習時間 (時間)": parseFloat((st.totalTime / 3600).toFixed(2))})).slice(0, 10); 

  if (subjectTimes.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center">
            <BookOpenText className="mr-2 h-6 w-6 text-primary" />
            科目別内訳
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">科目別内訳を表示するための学習セッションがまだ記録されていません。</p>
        </CardContent>
      </Card>
    );
  }

  const chartConfig = {
    "学習時間 (時間)": {
      label: "学習時間 (時間)",
      color: "hsl(var(--primary))",
    },
     value: { 
      label: "費やした時間",
    },
  } satisfies import('@/components/ui/chart').ChartConfig;


  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center">
          <BookOpenText className="mr-2 h-6 w-6 text-primary" />
          科目別内訳
        </CardTitle>
        <CardDescription>
          学習時間がさまざまな科目にどのように配分されているかを視覚化します。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {subjectTimes.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 font-headline flex items-center"><PieChartIcon className="mr-2 h-5 w-5 text-primary"/>時間配分</h3>
              <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px]">
                <RechartsPieChart>
                  <ChartTooltip content={<ChartTooltipContent hideLabel nameKey="name" />} />
                  <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} labelLine={false}
                    label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                      const RADIAN = Math.PI / 180;
                      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);
                      return (percent * 100) > 5 ? ( 
                        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize="10px">
                          {`${(percent * 100).toFixed(0)}%`}
                        </text>
                      ) : null;
                    }}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={DEFAULT_CHART_COLORS[index % DEFAULT_CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                </RechartsPieChart>
              </ChartContainer>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 font-headline flex items-center"><BarChart className="mr-2 h-5 w-5 text-primary"/>時間別上位科目</h3>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <RechartsBarChart accessibilityLayer data={barChartData} layout="vertical" margin={{left: 30, right: 30}}>
                  <XAxis type="number" dataKey="学習時間 (時間)" hide/>
                  <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tickMargin={10} width={120} className="text-xs truncate"/>
                  <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" hideLabel />} />
                  <Bar dataKey="学習時間 (時間)" radius={5} fill="var(--color-学習時間 (時間))" />
                </RechartsBarChart>
              </ChartContainer>
            </div>
          </div>
        )}
        <div>
          <h3 className="text-lg font-semibold mb-2 font-headline">全科目リスト</h3>
          <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {subjectTimes.map((subject, index) => (
              <li key={index} className="flex justify-between items-center p-2 bg-muted/50 rounded-md">
                <span className="text-sm font-medium">{subject.name}</span>
                <span className="text-sm text-primary font-semibold tabular-nums">{formatDuration(subject.totalTime)}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
