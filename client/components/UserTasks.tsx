'use client';

import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from 'next/navigation';
import { Key, useEffect, useState } from "react";

export interface Task {
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    title: string;
    task_description: string;
    dueDate: string;
    status: 'completed' | 'notcompleted';
    task_id: string;
}

const UserTasks = ({ user_tasks }: { user_tasks: Task[] }) => {
    const [tasks, setTasks] = useState<Task[]>(user_tasks || []);
    useEffect(() => {
        setTasks(user_tasks)
    }, [user_tasks])
    const router = useRouter();

    const deleteTask = async (task_id: string) => {
        const response = await axios.post(
            'http://localhost:5000/todo/delete-task',   
            { task_id },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            }
        );
        return response.data;
    };

    const { mutate } = useMutation({
        mutationFn: deleteTask,
    });

    const handleClickViewMore = (task_id: string) => {
        router.push(`/task/${task_id}`);
    };

    const handleClickDeleteTask = (task_id: string) => {
        setTasks((prevTasks) => prevTasks.filter((task) => task.task_id !== task_id));
        mutate(task_id);
    };

    return (
        <div>
            {tasks.length === 0 ? ( // Correct the conditional check
                <div className="-mt-20 h-screen flex justify-center items-center text-blue-600 font-bold text-7xl">No Tasks</div>
            ) : (
                <div className="-mt-20 flex h-screen items-center justify-center font-serif">
                    <table>
                        <thead>
                            <tr className="border border-black bg-blue-500">
                                <th className="p-4 border border-black">Title</th>
                                <th className="p-4 border border-black">Description</th>
                                <th className="p-4 border border-black">Priority</th>
                                <th className="p-4 border border-black">Status</th>
                                <th className="p-4 border border-black">Due Date</th>
                                <th className="p-4 border border-black"></th>
                                <th className="p-4 border border-black"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.map((task: Task, index: Key) => (
                                <tr
                                    key={index}
                                    className="border border-grey-500 bg-blue-0 hover:bg-blue-100"
                                >
                                    <td className="p-4 border border-black">{task.title}</td>
                                    <td className="p-4 border border-black">{task.task_description}</td>
                                    <td
                                        className={`p-4 border border-black font-bold ${task.priority === 'LOW'
                                            ? 'text-yellow-500'
                                            : task.priority === 'MEDIUM'
                                                ? 'text-green-500'
                                                : 'text-red-500'
                                            }`}
                                    >
                                        {task.priority}
                                    </td>
                                    <td
                                        className={`p-4 border border-black font-bold ${task.status === 'completed'
                                            ? 'text-green-500'
                                            : 'text-red-500'
                                            }`}
                                    >
                                        {task.status}
                                    </td>
                                    <td className="p-4 border border-black">
                                        {new Date(task.dueDate).toISOString().split('T')[0]}
                                    </td>
                                    <td className="p-4 border border-black">
                                        <button
                                            className="bg-red-500 hover:bg-red-700 p-2 rounded-xl text-white"
                                            onClick={() => handleClickDeleteTask(task.task_id)}
                                        >
                                            Delete Task
                                        </button>
                                    </td>
                                    <td className="p-4 border border-black">
                                        <button
                                            className="bg-blue-500  p-2 rounded-xl text-white"
                                            onClick={() => handleClickViewMore(task.task_id)}
                                        >
                                            View More
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default UserTasks;
