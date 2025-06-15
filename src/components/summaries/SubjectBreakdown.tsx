
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
import { CHART_COLORS } from '@/lib/chartColors'; // Assuming you create this file

interface SubjectTime {
  name: string;
  totalTime: number;
  category?: string;
}

// You might want to define these in a separate constants file or utils
const DEFAULT_CHART_COLORS = ['#4285F4', '#FF5722', '#34A853', '#FBBC05', '#EA4335', '#DA62F3'];


export function SubjectBreakdown() {
  const sessions = useStudyStore((state) => state.sessions);
  const tasks = useStudyStore((state) => state.tasks);

  const subjectTimes = useMemo(() => {
    const subjectMap: Map<string, { totalTime: number; category?: string }> = new Map();

    sessions.forEach(session => {
      const task = tasks.find(t => t.id === session.taskId);
      const taskName = task ? task.name : session.taskName; // Use task name from session if task deleted
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
  const barChartData = subjectTimes.map(st => ({ name: st.name, "Study Time (hours)": parseFloat((st.totalTime / 3600).toFixed(2))})).slice(0, 10); // Top 10 for bar chart

  if (subjectTimes.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center">
            <BookOpenText className="mr-2 h-6 w-6 text-primary" />
            Subject Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No study sessions recorded yet to show subject breakdown.</p>
        </CardContent>
      </Card>
    );
  }

  const chartConfig = {
    "Study Time (hours)": {
      label: "Study Time (hours)",
      color: "hsl(var(--primary))",
    },
  } satisfies import('@/components/ui/chart').ChartConfig;


  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center">
          <BookOpenText className="mr-2 h-6 w-6 text-primary" />
          Subject Breakdown
        </CardTitle>
        <CardDescription>
          Visualize how your study time is distributed across different subjects.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {subjectTimes.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 font-headline flex items-center"><PieChartIcon className="mr-2 h-5 w-5 text-primary"/>Time Allocation</h3>
              <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px]">
                <RechartsPieChart>
                  <ChartTooltip content={<ChartTooltipContent hideLabel nameKey="name" />} />
                  <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} labelLine={false}
                    label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                      const RADIAN = Math.PI / 180;
                      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);
                      return (percent * 100) > 5 ? ( // Only show label if percent > 5%
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
              <h3 className="text-lg font-semibold mb-2 font-headline flex items-center"><BarChart className="mr-2 h-5 w-5 text-primary"/>Top Subjects by Time</h3>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <RechartsBarChart accessibilityLayer data={barChartData} layout="vertical" margin={{left: 30, right: 30}}>
                  <XAxis type="number" dataKey="Study Time (hours)" hide/>
                  <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tickMargin={10} width={120} className="text-xs truncate"/>
                  <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" hideLabel />} />
                  <Bar dataKey="Study Time (hours)" radius={5} fill="var(--color-Study Time (hours))" />
                </RechartsBarChart>
              </ChartContainer>
            </div>
          </div>
        )}
        <div>
          <h3 className="text-lg font-semibold mb-2 font-headline">All Subjects List</h3>
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
