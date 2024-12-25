import { XMarkIcon } from '@heroicons/react/24/solid'; // Import Heroicons close icon
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import React, { useState } from 'react';
enum Status {
    PENDING,
    IN_PROGRESS,
    COMPLETED
}

enum Priority {
    LOW,
    MEDIUM,
    HIGH
}

interface FormData {
    title: string;
    task_description: string;
    dueDate: Date;
    status: Status;
    priority: Priority;
    task_id: string;

}
const EditForm = ({ OldFormData, onFormSubmit, onClose }: { OldFormData: FormData , onFormSubmit: (data: FormData) => void; onClose: () => void }) => {
    const [formData, setFormData] = useState<FormData>(OldFormData);
    const updateTask = async (formData: FormData) => {
        const userId = JSON.parse(localStorage.getItem('userData') as string).user_id;
        try {
            await axios.post('http://localhost:5000/todo/update-task', formData, {
                headers: {
                    'Content-Type': 'application/json',
                }, withCredentials: true,
            })
                .catch((error) => {
                    console.error('Task adding error:', error);
                });

        } catch (error) {
            console.error('Task is not added', error);
        }
    }

    const { mutate, data } = useMutation({
        mutationFn: updateTask
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onFormSubmit(formData);
        try {
            const res = mutate({ ...formData });
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
        <div>
            <div className="flex flex-col items-center justify-center overflow-hidden">
                <div className="rounded-xl p-2 font-serif bg-white shadow-md p-10 transition-transform">
                    <header className="flex items-center justify-between p-4">
                        <div className="text-4xl font-medium text-blue-700 text-center">Update Task</div>
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
                                            defaultValue={formData.title}

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
                                            defaultValue={formData.task_description}

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
                                            defaultValue={formData.priority}
                                        >
                                            <option value="LOW">LOW</option>
                                            <option value="MEDIUM">MEDIUM</option>
                                            <option value="HIGH">HIGH</option>
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="p-3">
                                        <label htmlFor="status">Status :</label>
                                    </td>
                                    <td className="p-3">
                                        <select
                                            name="status"
                                            className="border-b border-black focus:outline-none"
                                            onChange={changeFormData}
                                            defaultValue={formData.status}

                                        >
                                            <option value="PENDING">PENDING</option>
                                            <option value="IN_PROGRESS">IN_PROGRESS</option>
                                            <option value="COMPLETED">COMPLETED</option>
                                        </select>
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
                                            defaultValue={new Date(formData.dueDate).toISOString().split('T')[0]}
                                        />
                                    </td>
                                </tr>

                            </tbody>
                        </table>
                        <div className="w-full form-group flex justify-center items-center mt-8">
                            <input type="submit" value='Save' className="w-full bg-blue-500 rounded-md p-2 text-white" />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default EditForm
