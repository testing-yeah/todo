"use client";

import {
    GET_TODO_BY_ID,
    GetTodoByIdResponse,
    GetTodoByIdVariables,
} from "@/app/lib/graphql";
import { useQuery } from "@apollo/client";
import { useParams, useRouter } from "next/navigation";

const TodoDetail = () => {
    const router = useRouter();

    const param = useParams();
    const todoData = Number(param.todoId);
    console.log(todoData);

    const { loading, error, data } = useQuery<
        GetTodoByIdResponse,
        GetTodoByIdVariables
    >(GET_TODO_BY_ID, {
        variables: { id: todoData },
    });

    console.log("data", data);

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
            </div>
        </div>
    );
};

export default TodoDetail;
