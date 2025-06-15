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
      toast({ title: "Notes Updated", description: "Session notes have been saved." });
      setEditingSession(null);
    }
  };

  const handleDeleteSession = (sessionId: string, taskName: string) => {
    deleteSession(sessionId);
    toast({ title: "Session Deleted", description: `Session for "${taskName}" removed.`, variant: "destructive" });
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
        <h3 className="text-xl font-semibold font-headline">No Sessions Logged Yet</h3>
        <p className="text-muted-foreground">Start a study session from the dashboard to see your history here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
       <div className="flex flex-col sm:flex-row gap-4">
        <Input 
          placeholder="Search by task, category, or notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={sortOrder} onValueChange={(value: 'newest' | 'oldest') => setSortOrder(value)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableCaption>A log of all your recorded study sessions.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Task</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Start Time</TableHead>
            <TableHead>End Time</TableHead>
            <TableHead className="text-right">Duration</TableHead>
            <TableHead className="text-center">Actions</TableHead>
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
              <TableCell>{session.endTime ? formatTime(session.endTime) : 'Active'}</TableCell>
              <TableCell className="text-right tabular-nums">{formatDuration(session.duration)}</TableCell>
              <TableCell className="text-center space-x-1">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="Edit notes" onClick={() => handleOpenNotesDialog(session)}>
                      <FileText className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                   {editingSession && editingSession.id === session.id && (
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="font-headline">Session Notes for "{task ? task.name : session.taskName}"</DialogTitle>
                        <DialogDescription>
                          Add or edit notes for this study session. This can help you remember key points or topics covered.
                        </DialogDescription>
                      </DialogHeader>
                      <Textarea
                        value={sessionNotes}
                        onChange={(e) => setSessionNotes(e.target.value)}
                        placeholder="Enter your notes here..."
                        rows={5}
                        className="my-4"
                      />
                      <DialogFooter>
                        <DialogClose asChild><Button variant="outline" onClick={() => setEditingSession(null)}>Cancel</Button></DialogClose>
                        <Button onClick={handleSaveNotes}>Save Notes</Button>
                      </DialogFooter>
                    </DialogContent>
                  )}
                </Dialog>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80" aria-label="Delete session">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="font-headline">Delete Session</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete this session for "{task ? task.name : session.taskName}"? This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                      <Button variant="destructive" onClick={() => handleDeleteSession(session.id, task ? task.name : session.taskName)}>Delete</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          )})}
        </TableBody>
      </Table>
      {filteredAndSortedSessions.length === 0 && searchTerm && (
        <p className="text-center text-muted-foreground mt-4">No sessions match your search criteria.</p>
      )}
    </div>
  );
}
