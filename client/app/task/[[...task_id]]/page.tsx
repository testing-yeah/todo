'use client';

import EditForm from '@/components/EditForm';
import Loader from '@/components/Loader';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

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

interface Task {
    title: string;
    task_description: string;
    dueDate: Date;
    status: Status;
    priority: Priority;
    task_id: string;
}

const Page = () => {
    const params = useParams();
    const task_id = params.task_id as string;
    const [showForm, setShowForm] = useState(false);
    const [taskDetail, setTaskDetail] = useState<Task | null>(null);
    const getTaskDetails = async () => {
        const userId = JSON.parse(localStorage.getItem('userData') as string).user_id;
        const response = await axios.post(
            'http://localhost:5000/todo/task-details',
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

    const { data, isLoading, error } = useQuery({
        queryKey: ['gettaskdetails', task_id],
        queryFn: getTaskDetails,
    });

    useEffect(() => {
        if (data) {
            setTaskDetail(data); // Set the fetched data
        }
    }, [data]);

    const onSubmitForm = (formData: Task) => {
        setShowForm(false);
        setTaskDetail(formData); // Update the task details with the form data
    };

    const closeForm = () => {
        setShowForm(false);
    };

    return (
        <div>
            {isLoading ? (
                <Loader />
            ) : (
                taskDetail && (
                    <div className="flex flex-col justify-center items-center font-serif">
                        <div className="flex flex-col mt-12 border-4 rounded-xl border-blue-500 p-8 justify-center items-center">
                            <header className="text-blue-700 font-bold text-5xl">Task Details</header>
                            <div className="mt-6 text-lg">
                                <div>Task ID : {taskDetail.task_id}</div>
                                <div>Title : {taskDetail.title}</div>
                                <div>Description : {taskDetail.task_description}</div>
                                <div>Priority : {taskDetail.priority}</div>
                                <div>Status : {taskDetail.status}</div>
                                <div>Due Date : {new Date(taskDetail.dueDate).toISOString().split('T')[0]}</div>
                                <div className="flex justify-center">
                                    <button
                                        className="w-full text-white bg-blue-500 hover:bg-blue-600 p-2 rounded-xl mt-8"
                                        onClick={() => setShowForm(true)}
                                    >
                                        Edit
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            )}
            {showForm && taskDetail && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg overflow-y-auto">
                        <EditForm OldFormData={taskDetail} onFormSubmit={onSubmitForm} onClose={closeForm} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Page;
