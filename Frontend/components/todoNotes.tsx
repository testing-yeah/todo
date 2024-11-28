'use client'

import React, { useRef } from 'react'
import { Button } from '../@/components/ui/button'
import { Trash2, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteTodo } from '../todoRequest/deleteTodo'
import Cookies from 'js-cookie'
import { completeTodo } from '../todoRequest/completeTodo'

interface TodoItem {
    id: string;
    title: string;
    description: string;
    completed: boolean
}

interface TodoNotesProps {
    data: TodoItem;
}
function TodoNotes({ data }: TodoNotesProps) {
    const router = useRouter()
    const deleteBtn = useRef<HTMLButtonElement>(null)
    const queryClient = useQueryClient()
    const token = Cookies.get('sessionId')

    const { mutate } = useMutation({
        mutationKey: ['fetchTodos'],
        mutationFn: deleteTodo
    })

    function handleDelete(id: string) {
        try {
            mutate({ id, token }, {
                onSuccess: () => {
                    console.log('Deleted Successfully')
                    queryClient.invalidateQueries(['GET_TODO_QUERY'] as any)
                },
                onError: (err) => {
                    console.log('Error Deleting', err)
                }
            })
        } catch (error) {
            console.error("Error deleting Todo:", error)
        }
    }

    function handleOpenDetail(e: React.MouseEvent) {
        if (deleteBtn.current && deleteBtn.current.contains(e.target as Node)) {
            return
        }
        router.push(`/todoDetails/${data.id}`)
    }

    const { mutate: mutateCompleted } = useMutation({
        mutationFn: completeTodo
    })

    function handleCompleteTask(id, completed) {
        mutateCompleted({ id, completed: !completed, token }, {
            onSuccess: (data) => {
                queryClient.invalidateQueries(['fetchTodos'] as any)
            },
            onError: (err) => {
                alert('Error creating todo. Please try again.')
                console.error(err)
            },
        })
    }

    return (
        <div onClick={handleOpenDetail} className='w-full py-2 px-3 border cursor-pointer border-slate-400 rounded-md'>
            <p className='pb-2'>📍 {" "} {data.title}</p>
            <p className='pl-6 break-words flex gap-1 capitalize mb-4'>
                {data.description.substring(0, 20)}
                <p className='cursor-pointer hover:text-blue-500'>
                    {data.description.length > 15 && '...More'}
                </p>
            </p>
            <div ref={deleteBtn} className='flex flex-col gap-2'>
                <Button className='border border-gray-600 flex items-center' onClick={() => handleDelete(data.id)}>
                    <Trash2 size={20} color={'red'} />
                    Delete Task
                </Button>
                <Button className={`border border-gray-600 flex items-center ${data.completed ? 'bg-green-700' : ''}`} onClick={() => handleCompleteTask(data.id, data.completed)}>
                    <Check size={20} color={'green'} />
                    {!data.completed ? 'Complete Task' : 'Task Completed'}
                </Button>
            </div>
        </div>
    )
}

export default TodoNotes
