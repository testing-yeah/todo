import { useRouter } from "next/navigation";
import moment from "moment";

const TodoList = ({
  userTodos,
  onDelete,
  onToggleCompleted,
}: {
  userTodos: {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    createdAt: string;
  }[];
  onDelete: (id: number) => void;
  onToggleCompleted: (id: number, completed: boolean) => void;
}) => {
  const router = useRouter();

  const handleViewClick = (todo: {
    id: number;
    title: string;
    description: string;
  }) => {
    router.push(`/todos/${todo.id}`);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="bg-indigo-600 text-white">
            <th className="px-4 py-2 text-left">ID</th>
            <th className="px-4 py-2 text-left">Title</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Created At</th>
            <th className="px-4 py-2 text-left">Actions</th>
            <th className="px-4 py-2 text-left">View</th>
            <th className="px-4 py-2 text-left"></th>
          </tr>
        </thead>
        <tbody>
          {userTodos.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-2 text-center text-gray-500">
                No data found
              </td>
            </tr>
          ) : (
            userTodos.map((todo, index) => (
              <tr key={todo.id} className="border-b">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{todo.title}</td>
                <td className="px-4 py-2">
                  <span
                    className={`inline-block px-3 py-1 rounded-full ${todo.completed
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                      }`}
                  >
                    {todo.completed ? "Completed" : "Pending"}
                  </span>
                </td>
                <td className="px-4 py-2">
                  {moment(todo.createdAt).format("MMMM DD, YYYY")}
                </td>
                <td className="px-4 py-2">
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded"
                    onClick={() => onDelete(todo.id)}
                  >
                    Delete
                  </button>
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleViewClick(todo)}
                    className="text-blue-500 hover:text-blue-700 underline"
                  >
                    View
                  </button>
                </td>
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={(e) =>
                      onToggleCompleted(todo.id, e.target.checked)
                    }
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TodoList;
