"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useStudyStore } from '@/store/useStudyStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from '@/hooks/use-toast';

const taskSchema = z.object({
  name: z.string().min(1, "Task name is required").max(100, "Task name is too long"),
  category: z.string().max(50, "Category is too long").optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskCreatorProps {
  onTaskCreated?: (taskName: string) => void;
}

export function TaskCreator({ onTaskCreated }: TaskCreatorProps) {
  const addTask = useStudyStore((state) => state.addTask);
  const { toast } = useToast();

  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      name: "",
      category: "",
    },
  });

  const onSubmit: SubmitHandler<TaskFormData> = (data) => {
    const newTask = addTask(data.name, data.category);
    toast({
      title: "Task Created",
      description: `Task "${newTask.name}" has been added.`,
    });
    form.reset();
    if (onTaskCreated) {
      onTaskCreated(newTask.name);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center">
          <PlusCircle className="mr-2 h-6 w-6 text-primary" />
          Add New Study Task
        </CardTitle>
        <CardDescription>
          What do you want to focus on? Add a new task to start tracking your study time.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Linear Algebra Chapter 3" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Mathematics" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Task
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
