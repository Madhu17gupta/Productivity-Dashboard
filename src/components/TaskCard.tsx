import type { Task } from "../types/task";
import { Link } from "react-router-dom";

type Props = {
  task: Task;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function TaskCard({
  task,
  onComplete,
  onDelete,
}: Props) {
  const isOverdue =
    task.status === "Pending" && new Date(task.dueDate) < new Date();

  const priorityColor =
    task.priority === "High"
      ? "bg-red-100 text-red-700"
      : task.priority === "Medium"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-green-100 text-green-700";

  return (
    <div className="border rounded p-4 bg-white space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">{task.title}</h3>
        <span className={`text-xs px-2 py-1 rounded ${priorityColor}`}>
          {task.priority}
        </span>
      </div>

      {task.description && (
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {task.description}
        </p>
      )}

      <div className="flex gap-3 text-sm">
        <span className="px-2 py-1 rounded bg-gray-200">
          {task.status}
        </span>
        <span
          className={`px-2 py-1 rounded ${
            isOverdue ? "bg-red-900 text-white" : "bg-gray-200"
          }`}
        >
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </span>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-2">
        {task.status === "Pending" && (
          <button
            onClick={() => onComplete(task.id)}
            className="bg-green-600 text-white px-3 py-1 rounded"
          >
            Mark Completed
          </button>
        )}
        <button
          onClick={() => onDelete(task.id)}
          className="bg-red-600 text-white px-3 py-1 rounded"
        >
          Delete task
        </button>

          <Link
         to={`/tasks/edit/${task.id}`}
         className="bg-amber-300 text-white px-3 py-1 rounded"
        >
        Edit
        </Link>
      </div>
      {/* <div>  <Link
         to={`/tasks/edit/${task.id}`}
         className="bg-amber-300 text-white px-3 py-1 rounded"
        >
        Edit
        </Link></div> */}
    </div>
  );
}

