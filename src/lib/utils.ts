import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ja } from 'date-fns/locale';
import { format } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDuration(totalSeconds: number): string {
  if (totalSeconds < 0) totalSeconds = 0;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60); 

  const paddedHours = String(hours).padStart(2, '0');
  const paddedMinutes = String(minutes).padStart(2, '0');
  const paddedSeconds = String(seconds).padStart(2, '0');

  if (hours > 0) {
    return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
  }
  return `${paddedMinutes}:${paddedSeconds}`;
}

export function formatDate(date: Date | string | number | undefined): string {
  if (!date) return 'N/A';
  return format(new Date(date), 'yyyy年M月d日', { locale: ja });
}

export function formatTime(date: Date | string | number | undefined): string {
  if (!date) return 'N/A';
   return format(new Date(date), 'HH:mm', { locale: ja });
}
