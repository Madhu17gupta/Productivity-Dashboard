// src/pages/Dashboard.tsx
import StatsCard from '../components/StatsCard';
import TaskCard from '../components/TaskCard';
import { useTasks } from '../hooks/useTasks';
import { useScheduledNotifications } from '../hooks/useScheduledNotifications';
import avatar from '../assets/download.jpg';

export default function Dashboard() {
  const { tasks, stats, markCompleted, deleteTask } = useTasks();
  const recent = tasks.slice(0, 5);

  // Schedule browser notifications for all pending tasks
  useScheduledNotifications(tasks);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8">
      {/* Header */}
      <h1 className="text-4xl sm:text-4xl font-bold tracking-tight text-center mb-5
               bg-gradient-to-r from-pink-600 via-pink-700 to-fuchsia-700
               bg-clip-text text-transparent">
        Personal Productivity Dashboard
      </h1>

      <div className="flex items-center gap-6 bg-white rounded-2xl p-5 shadow-md mb-10 border border-gray-100">
        <img
          src={avatar}
          alt="profile"
          className="w-24 h-24 rounded-full ring-4 ring-pink-500 object-cover"
        />
        <div>
          <h2 className="text-2xl font-bold text-black-900">Anshika Ojha</h2>
          <p className="mt-1 font-semibold text-gray-500">Stay consistent. Stay productive.</p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard label="Total tasks" value={stats.total} accent="blue" />
        <StatsCard label="Completed" value={stats.completed} accent="green" />
        <StatsCard label="Pending" value={stats.pending} accent="yellow" />
        <StatsCard label="Progress" value={`${stats.progress}%`} accent="red" />
      </div>

      {/* Recent Tasks Section */}
      <div className="mt-10 bg-white dark:bg-gradient-to-b from-pink-600 via-pink-700 to-fuchsia-700 shadow-xl rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-semibold mb-4 text-white">Recent Tasks</h2>
        {recent.length === 0 ? (
          <p className="text-sm text-white italic">No tasks yet. Create your first task to get started.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recent.map((t) => (
              <TaskCard key={t.id} task={t} onComplete={markCompleted} onDelete={deleteTask} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
