import { useQuery } from "@tanstack/react-query";
import { Key, useEffect, useState } from "react";
import { getTasks } from '../components/getTasks';
import Loader from "./Loader";

export interface Task {
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    task_name: string;
    task_description: string;
    dueDate: string;
    status: 'completed' | 'notcompleted';
}

const Tasks = () => {
    const [tasks, setTasks] = useState<Task[]>([]);

    const { data, isLoading, error } = useQuery({
        queryKey: ['todo'],
        queryFn: getTasks,
    });

    useEffect(() => {
        if (data) {
            setTasks(data);
        }
    }, [data]);

    return (
        <div>
            {isLoading ? (
                <Loader />
            ) : (
                <div className="flex items-center justify-center font-serif">
                    <table>
                        <thead>
                            <tr className="border border-black bg-blue-500">
                                <th className="p-4 border border-black">Title</th>
                                <th className="p-4 border border-black">Description</th>
                                <th className="p-4 border border-black">Priority</th>
                                <th className="p-4 border border-black">Status</th>
                                <th className="p-4 border border-black">Due Date</th>
                                <th className="p-4 border border-black"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.map((task: Task, index: Key) => (
                                <tr
                                    key={index}
                                    className="border border-grey-500 bg-blue-0 hover:bg-blue-100"
                                >
                                    <td className="p-4 border border-black">{task.task_name}</td>
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
                                    <td className="p-4 border border-black">{task.dueDate}</td>
                                    <td className="p-4 border border-black">
                                        <button className="bg-blue-500 hover:bg-blue-600 p-2 rounded-xl text-white">
                                            View more
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

export default Tasks;
