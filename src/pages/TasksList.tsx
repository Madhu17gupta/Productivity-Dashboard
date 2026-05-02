import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import TaskCard from "../components/TaskCard";
import { useTasks } from "../hooks/useTasks";
import { useScheduledNotifications } from "../hooks/useScheduledNotifications";
import type { Priority, Status } from "../types/task";

type FilterStatus = Status | "All";
type FilterPriority = Priority | "All";

export default function TasksList() {
  const { tasks, markCompleted, deleteTask } = useTasks();
  useScheduledNotifications(tasks);

  const [status, setStatus] = useState<FilterStatus>("All");
  const [priority, setPriority] = useState<FilterPriority>("All");
  const [sort, setSort] =
    useState<"dueDateAsc" | "dueDateDesc">("dueDateAsc");

  const filteredTasks = useMemo(() => {
    let list = [...tasks];

    if (status !== "All") {
      list = list.filter((t) => t.status === status);
    }

    if (priority !== "All") {
      list = list.filter((t) => t.priority === priority);
    }

    list.sort((a, b) =>
      sort === "dueDateAsc"
        ? new Date(a.dueDate).getTime() -
          new Date(b.dueDate).getTime()
        : new Date(b.dueDate).getTime() -
          new Date(a.dueDate).getTime()
    );

    return list;
  }, [tasks, status, priority, sort]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">

  {/* Header */}
  <div className="flex items-center justify-between">
    <h1 className="text-3xl font-bold text-slate-800">
      Tasks
    </h1>

    <Link
      to="/tasks/new"
      className="inline-flex items-center gap-2
                 bg-gradient-to-r from-rose-500 to-fuchsia-600
                 text-white px-4 py-2.5 rounded-lg shadow
                 hover:opacity-90 transition"
    >
      + Add Task
    </Link>
  </div>

  {/* Filters */}
  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">
          Status
        </label>
        <select
          className="w-full rounded-lg border border-slate-300 px-3 py-2
                     focus:outline-none focus:ring-2 focus:ring-rose-400"
          value={status}
          onChange={(e) =>
            setStatus(e.target.value as FilterStatus)
          }
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* Priority */}
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">
          Priority
        </label>
        <select
          className="w-full rounded-lg border border-slate-300 px-3 py-2
                     focus:outline-none focus:ring-2 focus:ring-rose-400"
          value={priority}
          onChange={(e) =>
            setPriority(e.target.value as FilterPriority)
          }
        >
          <option value="All">All</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      {/* Sort */}
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">
          Sort by
        </label>
        <select
          className="w-full rounded-lg border border-slate-300 px-3 py-2
                     focus:outline-none focus:ring-2 focus:ring-rose-400"
          value={sort}
          onChange={(e) =>
            setSort(
              e.target.value as
                | "dueDateAsc"
                | "dueDateDesc"
            )
          }
        >
          <option value="dueDateAsc">Due date ↑</option>
          <option value="dueDateDesc">Due date ↓</option>
        </select>
      </div>

    </div>
  </div>

  {/* Task List */}
  {filteredTasks.length === 0 ? (
    <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-slate-100">
      <p className="text-slate-500 italic">
        No tasks match your filters.
      </p>
    </div>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {filteredTasks.map((task) => (
        <div
          key={task.id}
          className="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
        >
          <TaskCard
            task={task}
            onComplete={markCompleted}
            onDelete={deleteTask}
          />
        </div>
      ))}
    </div>
  )}
</div>

  );
}
