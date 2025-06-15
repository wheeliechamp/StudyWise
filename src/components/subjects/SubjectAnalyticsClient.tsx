"use client";

import { useMemo } from 'react';
import { useStudyStore } from '@/store/useStudyStore';
import type { Session, Task } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, PieChart as PieIcon, ListChecks, Percent } from 'lucide-react';
import { formatDuration } from '@/lib/utils';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Bar, BarChart as RechartsBarChart, Pie, PieChart as RechartsPieChart, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip, Legend as RechartsLegend, Cell } from 'recharts';
import { CHART_COLORS } from '@/lib/chartColors';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface SubjectTime {
  name: string; // Could be Task name or Category name
  totalTime: number;
  taskCount: number; // Number of unique tasks under this subject/category
  sessionCount: number;
}

export function SubjectAnalyticsClient() {
  const sessions = useStudyStore((state) => state.sessions);
  const tasks = useStudyStore((state) => state.tasks);

  const analyticsData = useMemo(() => {
    const subjectMap: Map<string, { totalTime: number; taskIds: Set<string>; sessionCount: number; isCategory: boolean }> = new Map();

    sessions.forEach(session => {
      const task = tasks.find(t => t.id === session.taskId);
      const subjectName = task?.category || task?.name || session.taskName; // Prioritize category, then task name
      const isCategory = !!task?.category;

      if (!subjectMap.has(subjectName)) {
        subjectMap.set(subjectName, { totalTime: 0, taskIds: new Set(), sessionCount: 0, isCategory });
      }
      const current = subjectMap.get(subjectName)!;
      current.totalTime += session.duration;
      current.taskIds.add(session.taskId);
      current.sessionCount += 1;
    });

    return Array.from(subjectMap.entries())
      .map(([name, data]) => ({ 
        name, 
        totalTime: data.totalTime, 
        taskCount: data.taskIds.size,
        sessionCount: data.sessionCount,
        isCategory: data.isCategory,
      }))
      .sort((a, b) => b.totalTime - a.totalTime);
  }, [sessions, tasks]);


  const totalStudyTimeAllSubjects = analyticsData.reduce((sum, item) => sum + item.totalTime, 0);
  
  const pieChartData = analyticsData.map(st => ({ 
    name: st.name, 
    value: st.totalTime,
    percentage: totalStudyTimeAllSubjects > 0 ? (st.totalTime / totalStudyTimeAllSubjects) * 100 : 0
  }));

  const barChartData = analyticsData
    .map(st => ({ name: st.name, "時間 (時間)": parseFloat((st.totalTime / 3600).toFixed(2))}))
    .slice(0, 10); // Top 10 for bar chart


  const chartConfig = {
    "時間 (時間)": {
      label: "時間 (時間)",
      color: "hsl(var(--primary))",
    },
     value: { 
      label: "費やした時間",
    },
  } satisfies import('@/components/ui/chart').ChartConfig;

  if (analyticsData.length === 0) {
    return (
      <div className="text-center py-10">
        <BarChart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold font-headline">分析データがありません</h3>
        <p className="text-muted-foreground">いくつかの学習セッションを完了して、科目別の分析結果を表示しましょう。</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {analyticsData.slice(0,3).map((subject, index) => (
           <Card key={subject.name} className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="font-headline text-lg truncate flex items-center">
                <div className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: CHART_COLORS[index % CHART_COLORS.length]}}></div>
                {subject.name}
                {subject.isCategory && <Badge variant="secondary" className="ml-2">カテゴリ</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <p className="text-2xl font-bold text-primary tabular-nums">{formatDuration(subject.totalTime)}</p>
              <p className="text-xs text-muted-foreground">{subject.sessionCount} セッション · {subject.taskCount} タスク</p>
              <p className="text-xs text-muted-foreground flex items-center">
                <Percent className="h-3 w-3 mr-1" /> 
                {((subject.totalTime / totalStudyTimeAllSubjects) * 100).toFixed(1)}% (総学習時間比)
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-3 shadow-xl">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center">
              <BarChart className="mr-2 h-5 w-5 text-primary" />時間別上位科目
            </CardTitle>
            <CardDescription>最も学習時間の長い科目/カテゴリの比較。</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[400px] w-full">
              <RechartsBarChart accessibilityLayer data={barChartData} layout="vertical" margin={{left: 30, right: 30}}>
                <XAxis type="number" dataKey="時間 (時間)" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickMargin={10} width={120} />
                <ChartTooltip cursor={{fill: 'hsl(var(--muted)/0.3)'}} content={<ChartTooltipContent indicator="line" hideLabel />} />
                <Bar dataKey="時間 (時間)" radius={4}>
                   {barChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </RechartsBarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 shadow-xl">
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center">
              <PieIcon className="mr-2 h-5 w-5 text-primary" />時間配分
            </CardTitle>
            <CardDescription>学習時間の全体的な分布。</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[400px]">
              <RechartsPieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel nameKey="name" />} />
                <Pie data={pieChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} labelLine={false}
                  label={({ name, percent }) => percent > 0.03 ? `${name} ${(percent * 100).toFixed(0)}%` : ''}
                  className="text-xs"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} className="stroke-background hover:opacity-80 transition-opacity" />
                  ))}
                </Pie>
                <ChartLegend content={<ChartLegendContent wrapperStyle={{fontSize: "10px"}} nameKey="name" />} />
              </RechartsPieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center">
            <ListChecks className="mr-2 h-5 w-5 text-primary" />すべての科目とカテゴリ
          </CardTitle>
          <CardDescription>学習したすべての科目とカテゴリの詳細リスト。</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <ul className="space-y-3 pr-4">
              {analyticsData.map((subject, index) => (
                <li key={index} className="p-4 bg-card border rounded-lg shadow-sm hover:bg-muted/50 transition-colors">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-foreground">{subject.name} {subject.isCategory && <Badge variant="outline">カテゴリ</Badge>}</span>
                    <span className="text-lg font-bold text-primary tabular-nums">{formatDuration(subject.totalTime)}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {subject.sessionCount} セッション ({subject.taskCount} ユニーク {subject.isCategory ? "このカテゴリのタスク" : "タスク"})
                  </div>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
