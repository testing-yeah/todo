"use client";

import {
    EDIT_TODO,
    EditTodoResponse,
    EditTodoVariables,
    GET_TODO_BY_ID,
    GetTodoByIdResponse,
    GetTodoByIdVariables,
} from "@/app/lib/graphql";
import { useQuery, useMutation } from "@apollo/client";
import { useParams, useRouter } from "next/navigation";
import { useState, ChangeEvent } from "react";

const TodoDetail: React.FC = () => {
    const router = useRouter();
    const param = useParams();
    const todoData = Number(param.todoId);

    const token = localStorage.getItem("token");

    // Query to fetch the todo data
    const { loading, error, data } = useQuery<
        GetTodoByIdResponse,
        GetTodoByIdVariables
    >(GET_TODO_BY_ID, {
        variables: { id: todoData },
    });

    // Mutation to update todo
    const [editTodo, { loading: updating, error: updateError }] = useMutation<
        EditTodoResponse,
        EditTodoVariables
    >(EDIT_TODO);

    // Modal and form states
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    // Handle edit button click
    const onEdit = (): void => {
        if (data?.getTodoById) {
            setTitle(data.getTodoById.title);
            setDescription(data.getTodoById.description);
            setIsEditing(true);
        }
    };

    // Handle form submission for updating todo
    const handleUpdate = async (): Promise<void> => {
        if (!title || !description || !token) {
            console.error("Title and Description are required.");
            return;
        }

        try {
            await editTodo({
                variables: {
                    id: todoData,
                    title,
                    description,
                    token,
                },
            });
            setIsEditing(false);
        } catch (err) {
            console.error("Update failed", err);
        }
    };

    if (loading)
        return <p className="text-center text-lg text-gray-600">Loading...</p>;
    if (error)
        return (
            <p className="text-center text-lg text-red-600">Error: {error.message}</p>
        );

    const todo = data?.getTodoById;

    if (!todo) {
        return <p className="text-center text-lg text-gray-600">Todo not found.</p>;
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-500">
            <div className="w-full mx-20 p-6 bg-white shadow-2xl rounded-lg">
                <button
                    onClick={() => router.back()}
                    className="text-blue-500 mb-4 hover:text-blue-700 focus:outline-none"
                >
                    &larr; Back
                </button>

                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    Title: {todo.title}
                </h2>
                <p className="text-lg text-gray-700 mb-4">
                    Description: {todo.description}
                </p>
                <p className="text-lg text-gray-700 mb-4">
                    Status:{" "}
                    <span className={todo.completed ? "text-green-500" : "text-red-500"}>
                        {todo.completed ? "Completed" : "Not Completed"}
                    </span>
                </p>
                <p className="text-sm text-gray-500 mb-4">
                    Created At: {new Date(todo.createdAt).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                    Last Updated: {new Date(todo.updatedAt).toLocaleString()}
                </p>

                <div className="flex justify-end items-center mx-10 my-2">
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
                        onClick={onEdit}
                    >
                        Edit
                    </button>
                </div>
            </div>

            {/* Modal for Editing Todo */}
            {isEditing && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h3 className="text-xl font-semibold mb-4">Edit Todo</h3>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Title
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    setTitle(e.target.value)
                                }
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Description
                            </label>
                            <textarea
                                value={description}
                                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                                    setDescription(e.target.value)
                                }
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                onClick={handleUpdate}
                                className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
                                disabled={updating}
                            >
                                {updating ? "Updating..." : "Save"}
                            </button>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
                            >
                                Cancel
                            </button>
                        </div>

                        {updateError && (
                            <p className="text-red-500 mt-4">{updateError.message}</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TodoDetail;
