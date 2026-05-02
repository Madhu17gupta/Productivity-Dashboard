// src/hooks/useScheduledNotifications.ts
// Schedules browser push notifications at exact due date+time of each task

import { useEffect, useRef } from 'react';
import type { Task } from '../types/task';

// Request permission once on app load
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

// Show an instant browser notification
function showNotification(title: string, body: string, tag: string) {
  if (Notification.permission !== 'granted') return;
  new Notification(title, {
    body,
    tag,
    icon: '/Icon.webp',
    requireInteraction: true, // stays until user dismisses
  });
}

export function useScheduledNotifications(tasks: Task[]) {
  // Store timeoutIds so we can clear them when tasks change
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  useEffect(() => {
    // Clear all existing timers first
    timersRef.current.forEach(id => clearTimeout(id));
    timersRef.current.clear();

    const now = Date.now();

    tasks.forEach(task => {
      if (task.status === 'Completed') return;
      if (!task.dueDate) return;

      // Build due datetime — use dueTime if set, else 09:00 AM default
      const timeStr = task.dueTime || '09:00';
      const dueDateTimeStr = `${task.dueDate}T${timeStr}:00`;
      const dueMs = new Date(dueDateTimeStr).getTime();

      if (isNaN(dueMs)) return;

      const msUntilDue = dueMs - now;

      // --- Notification at exact due time ---
      if (msUntilDue > 0) {
        const t1 = setTimeout(() => {
          showNotification(
            `⏰ Task Due: ${task.title}`,
            `Priority: ${task.priority} | Due at ${timeStr}`,
            `due-${task.id}`
          );
        }, msUntilDue);
        timersRef.current.set(`due-${task.id}`, t1);
      }

      // --- 30-minute reminder before due time ---
      const thirtyMinBefore = msUntilDue - 30 * 60 * 1000;
      if (thirtyMinBefore > 0) {
        const t2 = setTimeout(() => {
          showNotification(
            `🔔 Reminder: "${task.title}" due in 30 min`,
            `Priority: ${task.priority} | Due at ${timeStr}`,
            `reminder-${task.id}`
          );
        }, thirtyMinBefore);
        timersRef.current.set(`reminder-${task.id}`, t2);
      }

      // --- Overdue: task was due in the past ---
      if (msUntilDue < 0) {
        showNotification(
          `⚠️ Overdue: ${task.title}`,
          `Was due on ${task.dueDate} at ${timeStr}`,
          `overdue-${task.id}`
        );
      }
    });

    return () => {
      timersRef.current.forEach(id => clearTimeout(id));
      timersRef.current.clear();
    };
  }, [tasks]);
}
