'use client'
import React, { useRef, useState } from 'react'
import useOutside from '../hooks/useOutside'
import { Button } from '../@/components/ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { X } from 'lucide-react';
import { createTodo } from '../todoRequest/createTodo'

function AddTodoForm() {

    const queryClient = useQueryClient()
    const token = Cookies.get('sessionId')
    const { mutate } = useMutation({
        mutationFn: createTodo,
    })

    const formRef = useRef()

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [completed, setCompleted] = useState(false);
    const [formPopup, setFormPopup] = useState(false)
    const userCookie = Cookies?.get('sessionId')

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!userCookie) {
            alert('User not Logged In')
        }

        if (!title || !description) {
            alert('Please fill in all fields');
            return;
        }

        try {
            const { data } = mutate({ title, description, token }, {
                onSuccess: (data) => {
                    queryClient.invalidateQueries(['getTodoByUser']);
                },
                onError: (err) => {
                    alert('Invalid credentials. Please try again.');
                },
            });
            console.log('Todo created:', data);
        } catch (e) {
            console.error('Error creating todo:', e);
        }

        setTitle('');
        setDescription('');
        setCompleted(false);
        setFormPopup(false)
    };

    useOutside(formRef, () => setFormPopup(false))

    return (
        <>
            <div className='flex justify-end text-white mb-4' onClick={() => setFormPopup(true)}>
                <Button variant='outline' className=' px-2 bg-red-600 hover:bg-slate-800 transition-all duration-200'>Create Todo</Button>
            </div>

            {formPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="w-96 p-6 rounded-lg shadow-lg">
                        <form onSubmit={handleSubmit} className="todo-form mb-6 p-4 border rounded-md shadow-md" ref={formRef}>
                            <div className='flex justify-between items-center mb-4'>
                                <h2 className="text-xl font-semibold">Add Todo</h2>
                                <X size={20} cursor={'pointer'} onClick={() => setFormPopup(false)} />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="title" className="block text-sm font-medium">Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full p-2 border rounded-md mt-1"
                                    placeholder="Enter todo title"
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="description" className="block text-sm font-medium">Description</label>
                                <textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full p-2 border rounded-md mt-1"
                                    placeholder="Enter todo description"
                                />
                            </div>

                            <div className="flex items-center mb-4">
                                <input
                                    type="checkbox"
                                    checked={completed}
                                    id='check'
                                    onChange={() => setCompleted(!completed)}
                                    className="mr-2"
                                />
                                <label htmlFor='check' className="text-sm">Completed</label>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                            >
                                Add Todo
                            </button>
                        </form>
                    </div >
                </div>
            )}
        </>


    )
}

export default AddTodoForm