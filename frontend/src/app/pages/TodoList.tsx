import React from "react";

const TodoList = ({
  userTodos,
  onEdit,
  onDelete,
}: {
  userTodos: {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    createdAt: string;
  }[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="bg-indigo-600 text-white">
            <th className="px-4 py-2 text-left">ID</th>
            <th className="px-4 py-2 text-left">Title</th>
            <th className="px-4 py-2 text-left">Description</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Created At</th>
            <th className="px-4 py-2 text-left">Actions</th>
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
                <td className="px-4 py-2">{todo.description}</td>
                <td className="px-4 py-2">
                  <span
                    className={`inline-block px-3 py-1 rounded-full ${
                      todo.completed
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {todo.completed ? "Completed" : "Pending"}
                  </span>
                </td>
                <td className="px-4 py-2">
                  {new Date(todo.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-2">
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
                    onClick={() => onEdit(todo.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded"
                    onClick={() => onDelete(todo.id)}
                  >
                    Delete
                  </button>
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
