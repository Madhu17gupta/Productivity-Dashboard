import { useState } from 'react';
import type { Priority, Status, Task } from '../types/task';

type Props = {
  initial?: Partial<Task>;
  onSubmit: (values: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
};

export default function TaskForm({ initial = {}, onSubmit }: Props) {
  const [title, setTitle] = useState(initial.title ?? '');
  const [description, setDescription] = useState(initial.description ?? '');
  const [priority, setPriority] = useState<Priority>(initial.priority ?? 'Medium');
  const [status, setStatus] = useState<Status>(initial.status ?? 'Pending');
  const [dueDate, setDueDate] = useState(initial.dueDate ?? '');
  const [dueTime, setDueTime] = useState(initial.dueTime ?? '09:00');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = 'Title is required';
    if (!dueDate) {
      e.dueDate = 'Due date is required';
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (new Date(dueDate) < today) {
        e.dueDate = 'Due date cannot be in the past';
      }
    }
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const eObj = validate();
    setErrors(eObj);
    if (Object.keys(eObj).length) return;
    onSubmit({ title, description, priority, status, dueDate, dueTime });
    setTitle(''); setDescription(''); setPriority('Medium');
    setStatus('Pending'); setDueDate(''); setDueTime('09:00');
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium">Title</label>
        <input
          className="mt-1 w-full border rounded px-3 py-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Complete assignment"
        />
        {errors.title && <p className="text-red-600 text-sm">{errors.title}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          className="mt-1 w-full border rounded px-3 py-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional details"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium">Priority</label>
          <select
            className="mt-1 w-full border rounded px-3 py-2"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Status</label>
          <select
            className="mt-1 w-full border rounded px-3 py-2"
            value={status}
            onChange={(e) => setStatus(e.target.value as Status)}
          >
            <option>Pending</option>
            <option>Completed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Due Date</label>
          <input
            type="date"
            className="mt-1 w-full border rounded px-3 py-2"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          {errors.dueDate && <p className="text-red-600 text-sm">{errors.dueDate}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">Due Time ⏰</label>
          <input
            type="time"
            className="mt-1 w-full border rounded px-3 py-2"
            value={dueTime}
            onChange={(e) => setDueTime(e.target.value)}
          />
          <p className="text-xs text-gray-400 mt-1">Notification aayegi is time pe</p>
        </div>
      </div>

      <button className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-800 transition">
        Save task
      </button>
    </form>
  );
}
