// src/context/NotificationContext.tsx
import { createContext, useContext, ReactNode } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import type { Notification, NotificationType } from '../hooks/useNotifications';

interface NotificationContextValue {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (type: NotificationType, taskTitle: string) => void;
  markAllRead: () => void;
  markOneRead: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const notif = useNotifications();
  return (
    <NotificationContext.Provider value={notif}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotificationContext must be used inside NotificationProvider');
  return ctx;
}
