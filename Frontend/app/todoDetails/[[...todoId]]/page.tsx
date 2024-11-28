'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { Button } from '../../../@/components/ui/button'
import { Input } from '../../../@/components/ui/input'
import { Textarea } from "../../../@/components/ui/textarea"
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { getTodoDetails } from '../../../todoRequest/getTodoDetails'
import { deleteTodo } from '../../../todoRequest/deleteTodo'
import { editTodoFun } from '../../../todoRequest/editTodo'

interface editTodoForm {
    id: string,
    title: string
    description: string
    completed: boolean
}

interface FormData {
    title: string
    description: string
    completed: boolean
}

interface TodoResponse {
    getTodoById: {
        id: string
        title: string
        description: string
        completed: boolean
    }
}

interface updateTodo {
    id: string,
    title: string
    description: string
    completed: boolean
    token: string
}

function TodoDetails() {
    const param = useParams()
    const token = Cookies.get('sessionId') || ''
    const queryClient = useQueryClient()

    const { mutate, data } = useMutation<TodoResponse, Error, { id: string, token: string }>({
        mutationKey: ['GetTodoDetails'],
        mutationFn: getTodoDetails,
    })

    const [editTodo, setEditTodo] = useState<editTodoForm | null>(null)
    const [inputValue, setInputValue] = useState<FormData>({
        title: '',
        description: '',
        completed: false
    })

    const router = useRouter()

    useEffect(() => {
        const currentParam = param.todoId?.[0] || ''
        async function getTodo() {
            try {
                await mutate({ id: currentParam, token })
            } catch (error) {
                console.log('Error sending ID to server', error)
            }
        }

        getTodo()
    }, [param, queryClient])

    function handleEditTodo(todo: editTodoForm) {
        const editTodo: editTodoForm = {
            id: todo.id,
            title: todo.title,
            description: todo.description,
            completed: todo.completed
        };
        setInputValue({ title: todo.title, description: todo.description, completed: todo.completed })
        setEditTodo(editTodo)
    }

    function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setInputValue((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const { mutate: updateTodoReq } = useMutation<updateTodo, Error, { id: string, title: string, description: string, completed: boolean, token: string }>({
        mutationFn: editTodoFun
    })

    function handleUpdateTodo() {
        if (!editTodo) return;

        if (!inputValue.title || !inputValue.description) {
            console.log("Title or description cannot be empty.");
            return;
        }

        try {
            const todoToUpdate: updateTodo = {
                ...editTodo,
                title: inputValue.title,
                description: inputValue.description,
                completed: inputValue.completed || false,
                token
            };

            updateTodoReq(todoToUpdate, {
                onSuccess: (data, variables) => {
                    setEditTodo(null);
                }
            });
        } catch (error) {
            console.log('Error Updating Todo', error);
        }
    }

    const { mutate: mutateDelete } = useMutation({
        mutationFn: deleteTodo
    })

    function handleDelete(todoId: string) {
        if (!data?.getTodoById?.id) {
            console.error("Todo ID is missing");
            return;
        }

        try {
            mutateDelete({ id: todoId, token }, {
                onSuccess: () => {
                    router.push('/')
                }
            })
        } catch (error) {
            console.log('Error deleting Todo', error)
        }
    }

    return (
        <div className='max-w-[1500px] mx-auto pt-5 px-5'>
            <h1 className='text-3xl font-semibold tracking-wider'>TodoDetails</h1>
            <div className={`my-5`}>
                <div className={`w-full border border-slate-600 rounded-sm py-4 px-3 ${data?.getTodoById.completed ? 'border-r-[12px] border-green-700' : ''}`}>
                    <p className='text-xl flex items-center'>📍 {" "}
                        {!editTodo?.id && data && data.getTodoById && data.getTodoById.title}
                        {editTodo?.id && <Input className='' value={inputValue.title} name='title' onChange={handleChange} />}
                    </p>
                    <div className='pl-7'>
                        {
                            !editTodo?.id ? <p className='py-1 ml-1'>{data && data.getTodoById && data.getTodoById.description}</p> : (
                                <Textarea className='my-2' value={inputValue.description} name='description' onChange={handleChange} />
                            )
                        }
                        <div className='flex gap-3 mt-3'>
                            {
                                !editTodo?.id ? <Button variant='outline' className='bg-blue-600 hover:bg-slate-700' onClick={() => data && handleEditTodo(data.getTodoById)}>Edit</Button> : (
                                    <div className='flex gap-3'>
                                        <Button variant='outline' className='bg-red-600 hover:bg-slate-700' onClick={() => setEditTodo(null)}>Cancel</Button>
                                        <Button variant='outline' className='bg-blue-600 hover:bg-slate-700' onClick={handleUpdateTodo}>Update</Button>
                                    </div>
                                )
                            }
                            <Button variant='outline' className='bg-red-600 hover:bg-slate-700' onClick={() => data && handleDelete(data.getTodoById.id)}>Delete</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TodoDetails
