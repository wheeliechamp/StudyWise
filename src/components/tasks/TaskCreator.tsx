"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useStudyStore } from '@/store/useStudyStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label'; // Label might not be used directly here due to FormField
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
  name: z.string().min(1, "タスク名は必須です").max(100, "タスク名が長すぎます"),
  category: z.string().max(50, "カテゴリ名が長すぎます").optional(),
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
      title: "タスク作成",
      description: `タスク「${newTask.name}」が追加されました。`,
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
          新しい学習タスクを追加
        </CardTitle>
        <CardDescription>
          何に集中したいですか？新しいタスクを追加して学習時間を記録しましょう。
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
                  <FormLabel>タスク名</FormLabel>
                  <FormControl>
                    <Input placeholder="例：線形代数 第3章" {...field} />
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
                  <FormLabel>カテゴリ (任意)</FormLabel>
                  <FormControl>
                    <Input placeholder="例：数学" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              <PlusCircle className="mr-2 h-4 w-4" /> タスクを追加
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
