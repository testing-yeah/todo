"use client";

import React, { FormEvent, useEffect, useState } from "react";
import TodoList from "./TodoList";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { dehydrate, QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { getTodo } from "@/todoRequests/getTodo";
import { createTodo } from "@/todoRequests/createTodo";
import { deleteTodo } from "@/todoRequests/deleteTodo";
import { completeTodo } from "@/todoRequests/completeTask";
import Cookies from "js-cookie";
import { queryClient } from "@/components/tanStackProvider";
import Header from "./Header";

interface Todo {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    createdAt: string;
}

export async function getServerSideProps() {
    const queryClient = new QueryClient();

    return {
        props: {
            dehydratedState: dehydrate(queryClient),
        },
    };
}

const AddTodo: React.FC = () => {
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [completed] = useState<boolean>(false);
    const [userTodos, setUserTodos] = useState<Todo[]>([]);

    const sessionid = Cookies.get("token");

    const {
        data,
        isLoading: queryLoading,
        error,
    } = useQuery({
        queryKey: ["getUserTodos"],
        queryFn: () => getTodo({ token: sessionid as string }),
        enabled: !!sessionid,
    });

    useEffect(() => {
        if (data) {
            setUserTodos(data as Todo[]);
        }
    }, [data]);

    const { mutate: addTodos } = useMutation({
        mutationFn: createTodo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["getUserTodos"] });
            toast.success("Todo added successfully!");
            setTitle("");
            setDescription("");
        },
        onError: (error) => {
            toast.error(`Error adding todo: ${error?.message || "Unknown error"}`);
        },
    });

    const { mutate: deleteTodos } = useMutation({
        mutationFn: deleteTodo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["getUserTodos"] });
            toast.success("Todo deleted successfully!");
        },
        onError: (error) => {
            toast.error(`Error deleting todo: ${error?.message || "Unknown error"}`);
        },
    });

    const { mutate: editTodo } = useMutation({
        mutationFn: completeTodo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["getUserTodos"] });
            toast.success("Todo updated successfully!");
        },
        onError: (error) => {
            toast.error(`Error updating todo: ${error?.message || "Unknown error"}`);
        },
    });

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!sessionid) {
            toast.error("No session token found.");
            return;
        }

        try {
            addTodos({
                title,
                description,
                token: sessionid as string,
                completed,
            });
        } catch (error) {
            console.log("Error adding todo:", error);
            toast.error("Error handling todo.");
        }
    };

    const handleDelete = (id: number) => {
        if (sessionid) {
            deleteTodos({
                id,
                token: sessionid as string,
            });
        }
    };

    const handleToggleCompleted = async (id: number, completed: boolean) => {
        try {
            const todoToUpdate = userTodos.find((todo) => todo.id === id);
            if (todoToUpdate) {
                editTodo({
                    id,
                    token: sessionid as string,
                    completed,
                });
                setUserTodos((prevTodos) =>
                    prevTodos.map((todo) =>
                        todo.id === id ? { ...todo, completed } : todo
                    )
                );
            }
        } catch (error) {
            console.log("Error toggling completion:", error);
        }
    };

    return (
        <>
            <Header />
            <ToastContainer position="top-right" autoClose={2000} newestOnTop />
            <div className="flex justify-center items-center px-4 sm:px-6 lg:px-8 my-10">
                <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
                    <h2 className="text-3xl font-bold text-center text-gray-900">
                        Add Todo
                    </h2>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="title" className="sr-only">
                                    Title
                                </label>
                                <input
                                    id="title"
                                    name="title"
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    className="appearance-none rounded-t-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Title"
                                />
                            </div>

                            <div className="mt-4">
                                <label htmlFor="description" className="sr-only">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                    rows={4}
                                    className="appearance-none rounded-b-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Description"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="group relative w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Add Todo
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {queryLoading ? (
                <div className="text-center"> Loading todos...</div>
            ) : error ? (
                <div className="text-center text-red-500">Error loading todos</div>
            ) : (
                <div className="mx-20 border-2 border-black mb-10">
                    <TodoList
                        userTodos={userTodos}
                        onDelete={handleDelete}
                        onToggleCompleted={handleToggleCompleted}
                    />
                </div>
            )}
        </>
    );
};

export default AddTodo;
