'use client'
import React from 'react'
import AddTodoFrom from '../components/addTodo'
import { useQuery } from '@tanstack/react-query';
import getTodo from '../todoRequest/getTodo'
import Cookies from 'js-cookie'
import TodoNotes from '../components/todoNotes';

function App() {
  const token = Cookies.get('sessionId')
  const { data, isLoading, error } = useQuery({
    queryKey: ['getTodoByUser'],
    queryFn: () => getTodo(token)
  })

  return (
    <>
      <div className='max-w-[1500px] mx-auto p-4 relative'>
        <AddTodoFrom />
        <div className='grid grid-cols-4 gap-4'>
          {
            data && data.getTodoByUser && data.getTodoByUser.map((data) => {
              return (
                <TodoNotes key={data.id} data={data} />
              )
            })
          }
        </div>
      </div >
    </>
  )
}

export default App