"use client";

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Task, Session, ActiveSessionState } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

interface StudyState {
  tasks: Task[];
  sessions: Session[];
  activeSession: ActiveSessionState;
  addTask: (name: string, category?: string) => Task;
  editTask: (id: string, newName: string, newCategory?: string) => void;
  deleteTask: (id: string) => void;
  startTimer: (taskId: string) => void;
  stopTimer: () => Session | null;
  tick: () => void;
  addSessionNote: (sessionId: string, notes: string) => void;
  deleteSession: (sessionId: string) => void;
  getTaskById: (taskId: string) => Task | undefined;
  hydrateDates: () => void;
}

export const useStudyStore = create<StudyState>()(
  persist(
    (set, get) => ({
      tasks: [],
      sessions: [],
      activeSession: {
        id: null,
        taskId: null,
        startTime: null,
        elapsedSeconds: 0,
      },

      hydrateDates: () => {
        set(state => ({
          tasks: state.tasks.map(task => ({
            ...task,
            createdAt: new Date(task.createdAt),
          })),
          sessions: state.sessions.map(session => ({
            ...session,
            startTime: new Date(session.startTime),
            endTime: session.endTime ? new Date(session.endTime) : undefined,
          })),
        }));
      },

      addTask: (name, category) => {
        const newTask: Task = { 
          id: uuidv4(), 
          name, 
          category: category?.trim() === '' ? undefined : category, 
          createdAt: new Date() 
        };
        set((state) => ({ tasks: [...state.tasks, newTask] }));
        return newTask;
      },

      editTask: (id, newName, newCategory) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, name: newName, category: newCategory?.trim() === '' ? undefined : newCategory ?? task.category, createdAt: new Date(task.createdAt) } : task
          ),
          sessions: state.sessions.map(session => 
            session.taskId === id ? {...session, taskName: newName, startTime: new Date(session.startTime), endTime: session.endTime ? new Date(session.endTime) : undefined} : session
          )
        }));
      },

      deleteTask: (id) => {
        // Before deleting a task, check if it's the active task. If so, stop the timer.
        if (get().activeSession.taskId === id) {
          get().stopTimer();
        }
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
          // Optionally remove sessions for this task, or mark them as "task deleted"
          // For now, let's keep them and handle display elsewhere if task is missing.
          // sessions: state.sessions.filter(session => session.taskId !== id), 
        }));
      },

      startTimer: (taskId) => {
        const { activeSession, tasks } = get();
        if (activeSession.id) {
          get().stopTimer();
        }
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        const newSessionId = uuidv4();
        set({
          activeSession: {
            id: newSessionId,
            taskId,
            startTime: Date.now(),
            elapsedSeconds: 0,
          },
        });
      },

      stopTimer: () => {
        const { activeSession, tasks } = get();
        if (!activeSession.id || !activeSession.startTime || !activeSession.taskId) return null;

        const endTime = Date.now();
        // elapsedSeconds already tracks the current segment. The startTime is for *this* segment.
        const currentSegmentDuration = Math.floor((endTime - activeSession.startTime) / 1000);
        const totalDuration = activeSession.elapsedSeconds + currentSegmentDuration;
        
        const task = tasks.find(t => t.id === activeSession.taskId);

        const newSession: Session = {
          id: activeSession.id,
          taskId: activeSession.taskId,
          taskName: task ? task.name : 'Unknown Task',
          startTime: new Date(activeSession.startTime - (activeSession.elapsedSeconds * 1000)), // Adjust start time to represent beginning of entire session
          endTime: new Date(endTime),
          duration: totalDuration,
          notes: '',
        };

        set((state) => ({
          sessions: [...state.sessions, newSession].map(s => ({...s, startTime: new Date(s.startTime), endTime: s.endTime ? new Date(s.endTime) : undefined})),
          activeSession: { id: null, taskId: null, startTime: null, elapsedSeconds: 0 },
        }));
        return newSession;
      },
      
      tick: () => {
        const { activeSession } = get();
        if (activeSession.id && activeSession.startTime) {
          const elapsed = Math.floor((Date.now() - activeSession.startTime) / 1000);
          set(state => ({
            activeSession: {
              ...state.activeSession,
              elapsedSeconds: elapsed // This should accumulate from the original segment start
            }
          }));
        }
      },

      addSessionNote: (sessionId, notes) => {
        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.id === sessionId ? { ...session, notes, startTime: new Date(session.startTime), endTime: session.endTime ? new Date(session.endTime) : undefined } : session
          ),
        }));
      },
      deleteSession: (sessionId: string) => {
        set((state) => ({
          sessions: state.sessions.filter(session => session.id !== sessionId),
        }));
      },
      getTaskById: (taskId: string) => {
        return get().tasks.find(task => task.id === taskId);
      }
    }),
    {
      name: 'studywise-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // This will be called when the state is rehydrated.
          // Call hydrateDates to convert string dates back to Date objects.
          state.hydrateDates();

          // If there was an active session, ensure its startTime is a number (timestamp)
          if (state.activeSession && state.activeSession.startTime && typeof state.activeSession.startTime === 'string') {
             state.activeSession.startTime = new Date(state.activeSession.startTime).getTime();
          }
        }
      },
    }
  )
);

// Call hydrateDates once after initial mount and rehydration
if (typeof window !== 'undefined') {
  useStudyStore.persist.onFinishHydration((state) => {
    (state as StudyState).hydrateDates();

    // Resume timer if active session exists on load
    const activeSession = (state as StudyState).activeSession;
    if (activeSession.id && activeSession.startTime) {
      // The tick interval will be started by TimerManager component
    }
  });
}
