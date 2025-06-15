"use client";

import { useStudyStore } from '@/store/useStudyStore';
import { TaskItem } from './TaskItem';
import { Lightbulb } from 'lucide-react';

export function TaskList() {
  const tasks = useStudyStore((state) => state.tasks);
  const activeSession = useStudyStore((state) => state.activeSession);

  // Sort tasks: active task first, then by creation date (newest first)
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.id === activeSession.taskId) return -1;
    if (b.id === activeSession.taskId) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  if (tasks.length === 0) {
    return (
      <div className="text-center py-10">
        <Lightbulb className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold font-headline">No Tasks Yet!</h3>
        <p className="text-muted-foreground">Add a new study task to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-headline font-semibold text-foreground">Your Study Tasks</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedTasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
