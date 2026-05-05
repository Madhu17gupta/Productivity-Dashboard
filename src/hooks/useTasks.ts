// src/hooks/useTasks.ts
import { useEffect, useMemo, useState } from "react";
import type { Task } from "../types/task";
import { useNotificationContext } from "../context/NotificationContext";

const API_URL =
  "https://productivity-dashboard-production-d57d.up.railway.app/tasks";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { addNotification } = useNotificationContext();

  // ================= LOAD FROM DB =================
  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load tasks");
        return res.json();
      })
      .then((data: Task[]) => {
        setTasks(data);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        data.forEach((task) => {
          if (
            task.status === "Pending" &&
            task.dueDate &&
            new Date(task.dueDate) < today
          ) {
            addNotification("task_overdue", task.title);
          }
        });
      })
      .catch((err) => console.error("Load Error:", err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ================= ADD =================
  const addTask = async (
    payload: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      const newTask = {
        ...payload,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });

      if (!res.ok) {
        const error = await res.text();
        console.error("Add Error:", error);
        return;
      }

      const saved: Task = await res.json();

      setTasks((prev) => [saved, ...prev]);
      addNotification("task_added", payload.title);
    } catch (err) {
      console.error("Add Error:", err);
    }
  };

  // ================= DELETE =================
  const deleteTask = async (id: string) => {
    try {
      const taskToDelete = tasks.find((t) => String(t.id) === String(id));

      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const error = await res.text();
        console.error("Delete Error:", error);
        return;
      }

      setTasks((prev) => prev.filter((t) => String(t.id) !== String(id)));

      if (taskToDelete) {
        addNotification("task_deleted", taskToDelete.title);
      }
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  // ================= UPDATE =================
  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const existingTask = tasks.find((t) => String(t.id) === String(id));

      if (!existingTask) {
        console.error("Task not found");
        return;
      }

      // IMPORTANT:
      // Backend expects full task data, so merge old task + updated fields
      const fullTask = {
        ...existingTask,
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fullTask),
      });

      if (!res.ok) {
        const error = await res.text();
        console.error("Update Error:", error);
        return;
      }

      const updatedTask: Task = await res.json();

      setTasks((prev) =>
        prev.map((t) => (String(t.id) === String(id) ? updatedTask : t))
      );
    } catch (err) {
      console.error("Update Error:", err);
    }
  };

  // ================= MARK COMPLETED =================
  const markCompleted = async (id: string) => {
    const task = tasks.find((t) => String(t.id) === String(id));

    await updateTask(id, { status: "Completed" });

    if (task) {
      addNotification("task_completed", task.title);
    }
  };

  // ================= STATS =================
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "Completed").length;
    const pending = total - completed;
    const progress = total ? Math.round((completed / total) * 100) : 0;

    return { total, completed, pending, progress };
  }, [tasks]);

  return {
    tasks,
    addTask,
    deleteTask,
    updateTask,
    markCompleted,
    stats,
  };
}