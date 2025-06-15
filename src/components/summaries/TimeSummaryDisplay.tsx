"use client";

import { useStudyStore } from '@/store/useStudyStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDuration } from '@/lib/utils';
import { TrendingUp, Calendar, CalendarDays, Activity } from 'lucide-react';
import type { Session } from '@/lib/types';
import { startOfDay, startOfWeek, startOfMonth, endOfDay, endOfWeek, endOfMonth, isWithinInterval, subDays, subWeeks, subMonths } from 'date-fns';

interface SummaryData {
  title: string;
  totalTime: number;
  periodLabel: string;
  icon: React.ElementType;
}

const calculateTotalTime = (sessions: Session[], startDate: Date, endDate: Date): number => {
  return sessions.reduce((total, session) => {
    if (session.endTime && isWithinInterval(new Date(session.endTime), { start: startDate, end: endDate })) {
      return total + session.duration;
    }
    return total;
  }, 0);
};

export function TimeSummaryDisplay() {
  const sessions = useStudyStore((state) => state.sessions);
  const now = new Date();

  const dailyTotal = calculateTotalTime(sessions, startOfDay(now), endOfDay(now));
  const weeklyTotal = calculateTotalTime(sessions, startOfWeek(now, { weekStartsOn: 1 }), endOfWeek(now, { weekStartsOn: 1 }));
  const monthlyTotal = calculateTotalTime(sessions, startOfMonth(now), endOfMonth(now));

  const summaries: SummaryData[] = [
    { title: "Today's Focus", totalTime: dailyTotal, periodLabel: "Today", icon: Activity },
    { title: "This Week's Progress", totalTime: weeklyTotal, periodLabel: "This Week", icon: CalendarDays },
    { title: "This Month's Dedication", totalTime: monthlyTotal, periodLabel: "This Month", icon: Calendar },
  ];

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-headline font-semibold text-foreground mb-4 flex items-center">
        <TrendingUp className="mr-2 h-6 w-6 text-primary" />
        Activity Summary
      </h2>
      <div className="grid gap-4 md:grid-cols-3">
        {summaries.map((summary) => (
          <Card key={summary.title} className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-body">{summary.title}</CardTitle>
              <summary.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary tabular-nums">
                {formatDuration(summary.totalTime)}
              </div>
              <p className="text-xs text-muted-foreground">{summary.periodLabel}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
