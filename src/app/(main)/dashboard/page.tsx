import { TaskCreator } from '@/components/tasks/TaskCreator';
import { TaskList } from '@/components/tasks/TaskList';
import { TimeSummaryDisplay } from '@/components/summaries/TimeSummaryDisplay';
import { SubjectBreakdown } from '@/components/summaries/SubjectBreakdown';
import { Separator } from '@/components/ui/separator';

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-0">
      <div className="space-y-8">
        <TimeSummaryDisplay />
        <Separator />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-1">
            <TaskCreator />
          </div>
          <div className="lg:col-span-2">
            <TaskList />
          </div>
        </div>
        <Separator />
        <SubjectBreakdown />
      </div>
    </div>
  );
}
