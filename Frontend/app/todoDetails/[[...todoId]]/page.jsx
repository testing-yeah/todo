'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Button } from '../../../@/components/ui/button'
import { Input } from '../../../@/components/ui/input'
import { Textarea } from "../../../@/components/ui/textarea"
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { getTodoDetails } from '../../../todoRequest/getTodoDetails'
import { deleteTodo } from '../../../todoRequest/deleteTodo'
import { editTodoFun } from '../../../todoRequest/editTodo'

function TodoDetails() {
    const param = useParams()

    const token = Cookies.get('sessionId')
    const queryClient = useQueryClient()

    const { mutate, data } = useMutation({
        mutationFn: getTodoDetails
    })

    const [editTodo, setEditTodo] = useState({})
    const [inputValue, setInputValue] = useState({
        title: '',
        description: '',
        completed: false
    })

    const router = useRouter()

    useEffect(() => {
        const currentParam = param.todoId[0]
        function getTodo() {
            try {
                const res = mutate({ id: currentParam, token })
            } catch (error) {
                console.log('Error To Sending Id To Server', error)
            }
        }

        getTodo()
    }, [param, queryClient])

    function handleEditTodo(todo) {
        setInputValue({ title: todo.title, description: todo.description, completed: todo.completed })
        setEditTodo(todo)
    }

    function handleChange(e) {
        setInputValue((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const { mutate: updateTodoReq } = useMutation({
        mutationFn: editTodoFun
    })

    function handleUpdateTodo() {
        try {
            const data = updateTodoReq({ ...editTodo, title: inputValue.title, description: inputValue.description, completed: false, token }, {
                onSuccess: (data, variables) => {
                    queryClient.invalidateQueries(['GET_TODO_BYID', { id: variables.id }])
                    setEditTodo({})
                }
            })
        } catch (error) {
            console.log('Error To Updating Todo', error)
        }
    }

    const { mutate: mutateDelete } = useMutation({
        mutationFn: deleteTodo
    })

    function handleDelete(todoId) {
        try {
            mutateDelete({ id: todoId, token }, {
                onSuccess: () => {
                    router.push('/')

                }
            })
        } catch (error) {
            console.log('Error To Delete Specific Todo', error)
        }
    }

    return (
        <div className='max-w-[1500px] mx-auto pt-5 px-5'>
            <h1 className='text-3xl font-semibold tracking-wider'>TodoDetails</h1>

            <div className='my-5'>
                <div className='w-full border border-slate-600 rounded-sm py-4 px-3'>
                    <p className='text-xl flex items-center'>📍 {" "}
                        {!editTodo.id && data && data.getTodoById && data.getTodoById.title}
                        {editTodo.id && <Input className='' value={inputValue.title} name='title' onChange={handleChange} />}
                    </p>
                    <div className='pl-7'>
                        {
                            !editTodo.id ? <p className='py-1 ml-1'>{data && data.getTodoById && data.getTodoById.description}</p> : (
                                <Textarea className='my-2' value={inputValue.description} name='description' onChange={handleChange} />
                            )
                        }
                        <div className='flex gap-3 mt-3'>
                            {

                                !editTodo.id ? <Button variant='outline' className='bg-blue-600 hover:bg-slate-700' onClick={() => handleEditTodo(data.getTodoById)}>Edit</Button> : (
                                    <div className='flex gap-3'>
                                        <Button variant='outline' className='bg-red-600 hover:bg-slate-700' onClick={() => setEditTodo({})}>Cancel</Button>
                                        <Button variant='outline' className='bg-blue-600 hover:bg-slate-700' onClick={handleUpdateTodo}>Update</Button>
                                    </div>
                                )
                            }
                            <Button variant='outline' className='bg-red-600 hover:bg-slate-700' onClick={() => handleDelete(data.getTodoById.id)}>Delete</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TodoDetails