import { useEffect, useRef, useState } from 'react';
import type { Notification } from '../hooks/useNotifications';

type Props = {
  notifications: Notification[];
  unreadCount: number;
  onMarkAllRead: () => void;
  onMarkOneRead: (id: string) => void;
  onClearAll: () => void;
};

const typeIcon: Record<string, string> = {
  task_added: '➕',
  task_completed: '✅',
  task_deleted: '🗑️',
  task_overdue: '⚠️',
};

const typeBg: Record<string, string> = {
  task_added: 'bg-blue-50 border-blue-200',
  task_completed: 'bg-green-50 border-green-200',
  task_deleted: 'bg-red-50 border-red-200',
  task_overdue: 'bg-yellow-50 border-yellow-200',
};

function timeAgo(isoString: string): string {
  const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function NotificationPanel({
  notifications, unreadCount, onMarkAllRead, onMarkOneRead, onClearAll,
}: Props) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell Button */}
      <button
        onClick={() => {
          setOpen(prev => !prev);
          if (!open && unreadCount > 0) onMarkAllRead();
        }}
        className="relative p-2 rounded-full hover:bg-pink-100/30 transition"
        title="Notifications"
      >
        <span className="text-2xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel — fixed width, left-aligned on mobile */}
      {open && (
        <div className="absolute right-0 mt-2 w-[92vw] max-w-sm bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
          style={{ right: 0 }}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-rose-500 to-fuchsia-600">
            <h3 className="text-white font-semibold text-sm tracking-wide">
              🔔 Notifications
              {unreadCount > 0 && (
                <span className="ml-1 bg-white text-rose-600 rounded-full px-2 py-0.5 text-xs font-bold">
                  {unreadCount}
                </span>
              )}
            </h3>
            <button
              onClick={onClearAll}
              className="text-white/80 hover:text-white text-xs underline transition"
            >
              Clear all
            </button>
          </div>

          {/* List */}
          <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                <span className="text-4xl mb-2">📭</span>
                <p className="text-sm">No notifications yet</p>
              </div>
            ) : (
              notifications.map(n => (
                <div
                  key={n.id}
                  onClick={() => onMarkOneRead(n.id)}
                  className={`flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition border-l-4 ${typeBg[n.type]} ${!n.read ? 'font-semibold' : 'opacity-70'}`}
                >
                  <span className="text-lg mt-0.5 flex-shrink-0">{typeIcon[n.type]}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 break-words">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{timeAgo(n.timestamp)}</p>
                  </div>
                  {!n.read && (
                    <span className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2 bg-gray-50 text-center">
              <button
                onClick={onMarkAllRead}
                className="text-xs text-rose-500 hover:text-rose-700 font-medium transition"
              >
               
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
