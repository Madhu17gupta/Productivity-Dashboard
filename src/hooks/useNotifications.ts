// src/hooks/useNotifications.ts
import { useState, useCallback } from 'react';

export type NotificationType = 'task_added' | 'task_completed' | 'task_deleted' | 'task_overdue';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  taskTitle: string;
  timestamp: string;
  read: boolean;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((type: NotificationType, taskTitle: string) => {
    const messages: Record<NotificationType, string> = {
      task_added: `New task added: "${taskTitle}"`,
      task_completed: `Task completed: "${taskTitle}" ✅`,
      task_deleted: `Task deleted: "${taskTitle}"`,
      task_overdue: `Overdue task: "${taskTitle}" ⚠️`,
    };

    const newNotif: Notification = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      type,
      message: messages[type],
      taskTitle,
      timestamp: new Date().toISOString(),
      read: false,
    };

    setNotifications(prev => [newNotif, ...prev].slice(0, 20)); // max 20 notifications
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const markOneRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return { notifications, addNotification, markAllRead, markOneRead, clearAll, unreadCount };
}
