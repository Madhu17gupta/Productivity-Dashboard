// src/hooks/useTasks.ts
import { useEffect, useMemo, useState } from 'react';
import type { Task } from '../types/task';
import { useNotificationContext } from '../context/NotificationContext';

const API_URL = "http://localhost:5000/tasks";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { addNotification } = useNotificationContext();

  // ================= LOAD FROM DB =================
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        setTasks(data);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        data.forEach((task: Task) => {
          if (task.status === 'Pending' && new Date(task.dueDate) < today) {
            addNotification('task_overdue', task.title);
          }
        });
      })
      .catch(err => console.error("Load Error:", err));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ================= ADD =================
  const addTask = async (payload: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask = { ...payload, createdAt: new Date().toISOString() };
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    });
    const saved = await res.json();
    setTasks(prev => [saved, ...prev]);
    addNotification('task_added', payload.title);
  };

  // ================= DELETE =================
  const deleteTask = async (id: string) => {
    const taskToDelete = tasks.find(t => t.id === id);
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    setTasks(prev => prev.filter(t => t.id !== id));
    if (taskToDelete) addNotification('task_deleted', taskToDelete.title);
  };

  // ================= UPDATE (saves to DB via PUT) =================
  const updateTask = async (id: string, updates: Partial<Task>) => {
    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    setTasks(prev =>
      prev.map(t =>
        t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
      )
    );
  };

  const markCompleted = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    await updateTask(id, { status: 'Completed' });
    if (task) addNotification('task_completed', task.title);
  };

  // ================= STATS =================
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'Completed').length;
    const pending = total - completed;
    const progress = total ? Math.round((completed / total) * 100) : 0;
    return { total, completed, pending, progress };
  }, [tasks]);

  return { tasks, addTask, deleteTask, updateTask, markCompleted, stats };
}
