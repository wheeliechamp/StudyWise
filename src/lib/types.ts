export interface Task {
  id: string;
  name: string;
  category?: string;
  createdAt: Date;
}

export interface Session {
  id: string;
  taskId: string;
  taskName: string; // Denormalized for easier display
  startTime: Date;
  endTime?: Date;
  duration: number; // in seconds
  notes?: string;
}

// This represents the currently active timer's state, if any.
// Stored in Zustand store and potentially synced to localStorage for persistence across reloads.
export interface ActiveSessionState {
  id: string | null; // Corresponds to the session ID being recorded
  taskId: string | null;
  startTime: number | null; // Timestamp of when the current segment of this session started
  elapsedSeconds: number; // Seconds accrued in this segment so far
}
