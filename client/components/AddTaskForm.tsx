import { XMarkIcon } from '@heroicons/react/24/solid'; // Import Heroicons close icon
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from "react";

interface FormData {
    task_name?: string;
    task_description?: string;
    dueDate?: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
}

const AddTaskForm = ({ onFormSubmit, onClose }: { onFormSubmit: (data: FormData) => void; onClose: () => void }) => {

    const [formData, setFormData] = useState<FormData>({ priority: 'LOW' });
    const user_id = JSON.parse(localStorage.getItem('userData') as string).user_id
    const addTask = async (formData: FormData) => {
        try {
            await axios.post('http://localhost:5000/todo/todo', { formData, user_id }, {
                headers: {
                    'Content-Type': 'application/json',
                }, withCredentials: true,
            })
                .then((response) => {
                    return response.data
                })
                .catch((error) => {
                    console.error('Task adding error:', error);
                });

        } catch (error) {
            console.error('Task is not added', error);
        }
    }

    const { mutate, data } = useMutation({
        mutationFn: addTask
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = mutate({ ...formData }, {
                onSuccess: () => {
                    onFormSubmit(data as any);
                }
            });
        } catch (err) {
            console.error(err);
        }
    }

    const onClickClose = () => {
        onClose();
    };

    const changeFormData = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <div className="flex flex-col items-center justify-center overflow-hidden">
            <div className="rounded-xl p-2 font-serif bg-white shadow-md p-10 transition-transform">
                <header className="flex items-center justify-between p-4">
                    <div className="text-4xl font-medium text-blue-700 text-center">Add Task</div>
                    <button
                        onClick={onClickClose}
                        className="flex items-center justify-center bg-red-600 text-white p-2 rounded-md hover:bg-red-700"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </header>
                <form className="justify-center mt-4 p-6 text-lg" onSubmit={handleSubmit}>
                    <table>
                        <tbody>
                            <tr>
                                <td className="p-3">
                                    <label htmlFor="task_name">Title :</label>
                                </td>
                                <td className="p-3">
                                    <input
                                        type="text"
                                        placeholder="Enter task title"
                                        name="title"
                                        className="border-b border-black focus:outline-none"
                                        onChange={changeFormData}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className="p-3">
                                    <label htmlFor="task_description">Task Description :</label>
                                </td>
                                <td className="p-3">
                                    <textarea
                                        placeholder="Enter description"
                                        name="task_description"
                                        className="border-b border-black focus:outline-none"
                                        onChange={changeFormData}
                                        required
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className="p-3">
                                    <label htmlFor="dueDate">Due Date :</label>
                                </td>
                                <td className="p-3">
                                    <input
                                        type="date"
                                        name="dueDate"
                                        className="border-b border-black focus:outline-none"
                                        onChange={changeFormData}
                                        required
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className="p-3">
                                    <label htmlFor="priority">Priority :</label>
                                </td>
                                <td className="p-3">
                                    <select
                                        name="priority"
                                        className="border-b border-black focus:outline-none"
                                        onChange={changeFormData}
                                    >
                                        <option value="LOW">LOW</option>
                                        <option value="MEDIUM">MEDIUM</option>
                                        <option value="HIGH">HIGH</option>
                                    </select>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="w-full form-group flex justify-center items-center mt-8">
                        <input type="submit" className="w-full bg-blue-500 rounded-md p-2 text-white" />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTaskForm;
