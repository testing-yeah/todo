'use client'

import React, { useRef } from 'react'
import { Button } from '../@/components/ui/button'
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTodo } from '../todoRequest/deleteTodo'
import Cookies from 'js-cookie'

function TodoNotes({ data }) {
    const router = useRouter()
    const deleteBtn = useRef()
    const queryClient = useQueryClient()
    const token = Cookies.get('sessionId')

    const { mutate } = useMutation({
        mutationFn: deleteTodo
    })

    function handleDelete(id) {
        try {
            mutate({ id, token }, {
                onSuccess: (data) => {
                    console.log('Delete SuccessFully')
                    queryClient.invalidateQueries(['GET_TODO_QUERY'])
                },

                onError: (err) => {
                    console.log('Error To Delete', err)
                }
            });
        } catch (error) {
            console.error("Error to delete Todo:", error);
        }
    }

    function handleOpenDetail(e) {
        if (deleteBtn.current && deleteBtn.current.contains(e.target)) {
            return
        }
        router.push(`/todoDetails/${data.id}`)
    }

    return (
        <div onClick={handleOpenDetail} className='w-full py-2 px-3 border cursor-pointer border-slate-400 rounded-md'>
            < div className='flex justify-between items-center' >
                <p>📍 {" "} {data.title}</p>
                <Button ref={deleteBtn} className='w-fit' variant="destructive" onClick={() => handleDelete(data.id)}>
                    <Trash2 size={20} color={'red'} />
                </Button>
            </div >
            <p className='pl-6 break-words flex gap-1 capitalize'>{data.description.substring(0, 20)}<p className='cursor-pointer hover:text-blue-500'>{data.description.length > 15 && '...More'}</p></p>
        </div >
    )
}

export default TodoNotes