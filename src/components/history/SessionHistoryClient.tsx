"use client";

import { useStudyStore } from '@/store/useStudyStore';
import { formatDuration, formatDate, formatTime } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2, FileText, CalendarClock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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
import { Textarea } from '@/components/ui/textarea';
import { useState, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { Session } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ja } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar'; // Ensure Calendar uses locale

export function SessionHistoryClient() {
  const { sessions, deleteSession, addSessionNote, getTaskById } = useStudyStore();
  const { toast } = useToast();
  
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [sessionNotes, setSessionNotes] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  const handleOpenNotesDialog = (session: Session) => {
    setEditingSession(session);
    setSessionNotes(session.notes || '');
  };

  const handleSaveNotes = () => {
    if (editingSession) {
      addSessionNote(editingSession.id, sessionNotes);
      toast({ title: "メモ更新", description: "セッションのメモが保存されました。" });
      setEditingSession(null);
    }
  };

  const handleDeleteSession = (sessionId: string, taskName: string) => {
    deleteSession(sessionId);
    toast({ title: "セッション削除", description: `タスク「${taskName}」のセッションが削除されました。`, variant: "destructive" });
  };
  
  const filteredAndSortedSessions = useMemo(() => {
    return [...sessions]
      .filter(session => {
        const task = getTaskById(session.taskId);
        const taskName = task ? task.name : session.taskName;
        const searchTermLower = searchTerm.toLowerCase();
        return taskName.toLowerCase().includes(searchTermLower) || 
               (session.notes && session.notes.toLowerCase().includes(searchTermLower)) ||
               (task?.category && task.category.toLowerCase().includes(searchTermLower));
      })
      .sort((a, b) => {
        const dateA = new Date(a.startTime).getTime();
        const dateB = new Date(b.startTime).getTime();
        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
      });
  }, [sessions, getTaskById, searchTerm, sortOrder]);


  if (sessions.length === 0) {
    return (
      <div className="text-center py-10">
        <CalendarClock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold font-headline">まだ記録されたセッションがありません</h3>
        <p className="text-muted-foreground">ダッシュボードから学習セッションを開始して、ここに履歴を表示しましょう。</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
       <div className="flex flex-col sm:flex-row gap-4">
        <Input 
          placeholder="タスク、カテゴリ、メモで検索..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={sortOrder} onValueChange={(value: 'newest' | 'oldest') => setSortOrder(value)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="並び替え..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">新しい順</SelectItem>
            <SelectItem value="oldest">古い順</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableCaption>記録されたすべての学習セッションのログです。</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>タスク</TableHead>
            <TableHead>カテゴリ</TableHead>
            <TableHead>日付</TableHead>
            <TableHead>開始時刻</TableHead>
            <TableHead>終了時刻</TableHead>
            <TableHead className="text-right">期間</TableHead>
            <TableHead className="text-center">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAndSortedSessions.map((session) => {
            const task = getTaskById(session.taskId);
            return (
            <TableRow key={session.id}>
              <TableCell className="font-medium">{task ? task.name : session.taskName}</TableCell>
              <TableCell>
                {task?.category ? <Badge variant="outline">{task.category}</Badge> : <span className="text-muted-foreground">-</span>}
              </TableCell>
              <TableCell>{formatDate(session.startTime)}</TableCell>
              <TableCell>{formatTime(session.startTime)}</TableCell>
              <TableCell>{session.endTime ? formatTime(session.endTime) : '実行中'}</TableCell>
              <TableCell className="text-right tabular-nums">{formatDuration(session.duration)}</TableCell>
              <TableCell className="text-center space-x-1">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="メモを編集" onClick={() => handleOpenNotesDialog(session)}>
                      <FileText className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                   {editingSession && editingSession.id === session.id && (
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="font-headline">「{task ? task.name : session.taskName}」のセッションメモ</DialogTitle>
                        <DialogDescription>
                          この学習セッションのメモを追加または編集します。重要なポイントやカバーしたトピックを思い出すのに役立ちます。
                        </DialogDescription>
                      </DialogHeader>
                      <Textarea
                        value={sessionNotes}
                        onChange={(e) => setSessionNotes(e.target.value)}
                        placeholder="ここにメモを入力してください..."
                        rows={5}
                        className="my-4"
                      />
                      <DialogFooter>
                        <DialogClose asChild><Button variant="outline" onClick={() => setEditingSession(null)}>キャンセル</Button></DialogClose>
                        <Button onClick={handleSaveNotes}>メモを保存</Button>
                      </DialogFooter>
                    </DialogContent>
                  )}
                </Dialog>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80" aria-label="セッションを削除">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="font-headline">セッションの削除</DialogTitle>
                      <DialogDescription>
                        「{task ? task.name : session.taskName}」のこのセッションを本当に削除しますか？この操作は元に戻せません。
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose asChild><Button variant="outline">キャンセル</Button></DialogClose>
                      <Button variant="destructive" onClick={() => handleDeleteSession(session.id, task ? task.name : session.taskName)}>削除</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          )})}
        </TableBody>
      </Table>
      {filteredAndSortedSessions.length === 0 && searchTerm && (
        <p className="text-center text-muted-foreground mt-4">検索条件に一致するセッションはありません。</p>
      )}
    </div>
  );
}
