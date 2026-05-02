// src/pages/Tasks/TaskNew.tsx
import TaskForm from '../components/Taskform';
import { useTasks } from '../hooks/useTasks';
import { useNavigate } from 'react-router-dom';

export default function TaskNew() {
  const { addTask } = useTasks();
  const navigate = useNavigate();

  return (
  <div className="max-w-3xl mx-auto px-6 py-12">

  {/* Header Section */}
  <div className="mb-8 text-center">
    <h1
      className="text-4xl font-bold tracking-tight
                 bg-gradient-to-r from-rose-500 to-fuchsia-600
                 bg-clip-text text-transparent"
    >
      Add New Task
    </h1>
    <p className="mt-2 text-slate-500">
      Plan your work and stay productive 🚀
    </p>
  </div>

  {/* Form Wrapper */}
  <div
    className="bg-white rounded-3xl shadow-lg border border-slate-100
               p-8 sm:p-10 relative overflow-hidden"
  >
    {/* Decorative Accent */}
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-fuchsia-600" />

    <TaskForm
      onSubmit={(values) => {
        addTask(values);
        navigate('/tasks');
      }}
    />
  </div>

</div>
  );
}