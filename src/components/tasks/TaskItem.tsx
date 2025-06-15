"use client";

import type React from 'react';
import { useState, useEffect } from 'react';
import type { Task } from '@/lib/types';
import { useStudyStore } from '@/store/useStudyStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Square, Edit3, Trash2, Tag, CalendarDays, GripVertical } from 'lucide-react';
import { formatDuration, formatDate } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface TaskItemProps {
  task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
  const { activeSession, startTimer, stopTimer, deleteTask, editTask, getTaskById } = useStudyStore();
  const { toast } = useToast();

  const isCurrentTaskActive = activeSession.taskId === task.id;
  const [elapsedTime, setElapsedTime] = useState(0);
  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editName, setEditName] = useState(task.name);
  const [editCategory, setEditCategory] = useState(task.category || '');

  useEffect(() => {
    if (isCurrentTaskActive && activeSession.startTime) {
      setElapsedTime(activeSession.elapsedSeconds);
      const interval = setInterval(() => {
        // Zustand's tick updates activeSession.elapsedSeconds, so we read from there.
        // This component just re-renders due to store update.
         setElapsedTime(useStudyStore.getState().activeSession.elapsedSeconds);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setElapsedTime(0);
    }
  }, [isCurrentTaskActive, activeSession.startTime, activeSession.elapsedSeconds]);


  const handleStartStop = () => {
    if (isCurrentTaskActive) {
      const stoppedSession = stopTimer();
      if (stoppedSession) {
        toast({
          title: "Session Stopped",
          description: `Logged ${formatDuration(stoppedSession.duration)} for "${stoppedSession.taskName}".`,
        });
      }
    } else {
      // Ensure the task still exists before starting
      if(getTaskById(task.id)) {
        startTimer(task.id);
        toast({
          title: "Session Started",
          description: `Timer started for "${task.name}".`,
        });
      } else {
         toast({
          title: "Error",
          description: `Task "${task.name}" no longer exists. Please refresh.`,
          variant: "destructive",
        });
      }
    }
  };

  const handleDelete = () => {
    deleteTask(task.id);
    toast({
      title: "Task Deleted",
      description: `Task "${task.name}" has been removed.`,
      variant: "destructive"
    });
  };
  
  const handleEdit = () => {
    if (editName.trim() === "") {
      toast({ title: "Error", description: "Task name cannot be empty.", variant: "destructive" });
      return;
    }
    editTask(task.id, editName, editCategory);
    toast({ title: "Task Updated", description: `Task "${editName}" has been updated.` });
    setIsEditDialogOpen(false);
  };

  return (
    <Card className="w-full transition-all duration-300 ease-in-out hover:shadow-xl">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="font-headline text-xl">{task.name}</CardTitle>
            {task.category && (
              <Badge variant="secondary" className="mt-1">
                <Tag className="mr-1 h-3 w-3" />
                {task.category}
              </Badge>
            )}
          </div>
          <div className="flex space-x-2">
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Edit task">
                  <Edit3 className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="font-headline">Edit Task</DialogTitle>
                  <DialogDescription>
                    Update the details for your study task.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="edit-task-name">Task Name</Label>
                    <Input id="edit-task-name" value={editName} onChange={(e) => setEditName(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="edit-task-category">Category (Optional)</Label>
                    <Input id="edit-task-category" value={editCategory} onChange={(e) => setEditCategory(e.target.value)} />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                  <Button onClick={handleEdit}>Save Changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80" aria-label="Delete task">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="font-headline">Delete Task</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete the task "{task.name}"? This action cannot be undone.
                    Associated logged sessions will remain but will refer to a deleted task.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                  <Button variant="destructive" onClick={handleDelete}>Delete Task</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center">
            <CalendarDays className="mr-1.5 h-4 w-4" />
            Created: {formatDate(task.createdAt)}
          </div>
        </div>
        <div className="text-center my-4">
          <p className="text-4xl font-bold font-mono text-foreground tabular-nums">
            {formatDuration(elapsedTime)}
          </p>
          {isCurrentTaskActive && <p className="text-sm text-primary animate-pulse">Timer is active</p>}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleStartStop}
          className={`w-full ${isCurrentTaskActive ? 'bg-accent hover:bg-accent/90 text-accent-foreground' : 'bg-primary hover:bg-primary/90 text-primary-foreground'}`}
        >
          {isCurrentTaskActive ? <Square className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
          {isCurrentTaskActive ? 'Stop Session' : 'Start Session'}
        </Button>
      </CardFooter>
    </Card>
  );
}
