"use client";

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

  // activeSession.elapsedSeconds が更新されるたびに、elapsedTime を同期する
  useEffect(() => {
    if (isCurrentTaskActive) {
      setElapsedTime(activeSession.elapsedSeconds);
    } else {
      // タスクがアクティブでない場合、そのタスクの総学習時間を表示
      // ここでは簡略化のため、0にリセットしていますが、
      // 実際にはそのタスクの過去のセッションの合計時間を表示するロジックが必要です。
      // (例: useStudyStoreからgetTaskTotalDuration(task.id)のような関数を呼び出す)
      setElapsedTime(0); // または getTaskTotalDuration(task.id)
    }
  }, [isCurrentTaskActive, activeSession.elapsedSeconds]); // activeSession.startTime はelapsedSecondsが更新されるので不要
  
  const handleStartStop = () => {
    if (isCurrentTaskActive) {
      const stoppedSession = stopTimer();
      if (stoppedSession) {
        toast({
          title: "セッション停止",
          description: `タスク「${stoppedSession.taskName}」の記録時間: ${formatDuration(stoppedSession.duration)}`,
        });
      }
    } else {
      if(getTaskById(task.id)) {
        startTimer(task.id);
        toast({
          title: "セッション開始",
          description: `タスク「${task.name}」のタイマーを開始しました。`,
        });
      } else {
         toast({
          title: "エラー",
          description: `タスク「${task.name}」は存在しません。ページを更新してください。`,
          variant: "destructive",
        });
      }
    }
  };

  const handleDelete = () => {
    deleteTask(task.id);
    toast({
      title: "タスク削除",
      description: `タスク「${task.name}」が削除されました。`,
      variant: "destructive"
    });
  };
  
  const handleEdit = () => {
    if (editName.trim() === "") {
      toast({ title: "エラー", description: "タスク名は空にできません。", variant: "destructive" });
      return;
    }
    editTask(task.id, editName, editCategory);
    toast({ title: "タスク更新", description: `タスク「${editName}」が更新されました。` });
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
                <Button variant="ghost" size="icon" aria-label="タスクを編集">
                  <Edit3 className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="font-headline">タスク編集</DialogTitle>
                  <DialogDescription>
                    学習タスクの詳細を更新します。
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="edit-task-name">タスク名</Label>
                    <Input id="edit-task-name" value={editName} onChange={(e) => setEditName(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="edit-task-category">カテゴリ (任意)</Label>
                    <Input id="edit-task-category" value={editCategory} onChange={(e) => setEditCategory(e.target.value)} />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild><Button variant="outline">キャンセル</Button></DialogClose>
                  <Button onClick={handleEdit}>変更を保存</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80" aria-label="タスクを削除">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="font-headline">タスクの削除</DialogTitle>
                  <DialogDescription>
                    本当にタスク「{task.name}」を削除しますか？この操作は元に戻せません。
                    関連する記録済みセッションは残りますが、削除されたタスクを参照することになります。
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild><Button variant="outline">キャンセル</Button></DialogClose>
                  <Button variant="destructive" onClick={handleDelete}>タスクを削除</Button>
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
            作成日: {formatDate(task.createdAt)}
          </div>
        </div>
        <div className="text-center my-4">
          <p className="text-4xl font-bold font-mono text-foreground tabular-nums">
            {formatDuration(elapsedTime)}
          </p>
          {isCurrentTaskActive && <p className="text-sm text-primary animate-pulse">タイマー作動中</p>}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleStartStop}
          className={`w-full ${isCurrentTaskActive ? 'bg-accent hover:bg-accent/90 text-accent-foreground' : 'bg-primary hover:bg-primary/90 text-primary-foreground'}`}
        >
          {isCurrentTaskActive ? <Square className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
          {isCurrentTaskActive ? 'セッション停止' : 'セッション開始'}
        </Button>
      </CardFooter>
    </Card>
  );
}
