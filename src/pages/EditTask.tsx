import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TaskForm from "../components/Taskform";
import { useTasks } from "../hooks/useTasks";
import type { Task } from "../types/task";

const API_URL = "https://productivity-dashboard-production-d57d.up.railway.app/tasks";

export default function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateTask } = useTasks();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch this specific task directly from backend
  useEffect(() => {
    if (!id) return;
    fetch(`${API_URL}/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then(data => {
        setTask(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) return (
    <div className="flex justify-center items-center h-40">
      <p className="text-gray-500 text-lg animate-pulse">Loading task...</p>
    </div>
  );

  if (!task) return (
    <div className="flex justify-center items-center h-40">
      <p className="text-red-500 text-2xl font-bold">Task not found</p>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-rose-500 to-fuchsia-600 bg-clip-text text-transparent">
          Edit Task
        </h1>
        <p className="mt-2 text-slate-500">Update your task details ✏️</p>
      </div>

      <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-8 sm:p-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-fuchsia-600" />
        <TaskForm
          initial={task}
          onSubmit={(values) => {
            updateTask(task.id, values);
            navigate("/tasks");
          }}
        />
      </div>
    </div>
  );
}
