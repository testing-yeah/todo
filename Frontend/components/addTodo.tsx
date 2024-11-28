'use client'

import React, { useRef, useState } from 'react'
import useOutside from '../hooks/useOutside'
import { Button } from '../@/components/ui/button'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Cookies from 'js-cookie'
import { X } from 'lucide-react'
import { createTodo, CreateTodoResponse } from '../todoRequest/createTodo'

// Define types for form data
interface TodoFormData {
    title: string
    description: string
    completed: boolean
}

interface AddTodoFormProps {
    // You can add any props here in the future if needed
}

function AddTodoForm({ }: AddTodoFormProps) {
    const queryClient = useQueryClient()
    const token = Cookies.get('sessionId')
    const { mutate } = useMutation<CreateTodoResponse, Error, { title: string, description: string, token: string }>({
        mutationFn: createTodo,
    })

    const formRef = useRef<HTMLFormElement | null>(null)

    const [title, setTitle] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [completed, setCompleted] = useState<boolean>(false)
    const [formPopup, setFormPopup] = useState<boolean>(false)
    const userCookie = Cookies?.get('sessionId')

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!userCookie) {
            alert('User not Logged In')
        }

        if (!title || !description) {
            alert('Please fill in all fields')
            return
        }

        try {
            mutate(
                { title, description, token: userCookie || '' },
                {
                    onSuccess: (data) => {
                        queryClient.invalidateQueries(['getTodoByUser'] as any)
                        console.log('Todo created:', data)
                    },
                    onError: (err) => {
                        alert('Error creating todo. Please try again.')
                        console.error(err)
                    },
                }
            )
        } catch (e) {
            console.error('Error creating todo:', e)
        }

        setTitle('')
        setDescription('')
        setCompleted(false)
        setFormPopup(false)
    }

    useOutside(formRef, () => setFormPopup(false))

    return (
        <>
            <div className='flex justify-end text-white mb-4' onClick={() => setFormPopup(true)}>
                <Button variant='outline' className=' px-2 bg-red-600 hover:bg-slate-800 transition-all duration-200'>
                    Create Todo
                </Button>
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

                            <button
                                type="submit"
                                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                            >
                                Add Todo
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}

export default AddTodoForm
