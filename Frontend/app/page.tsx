'use client';
import React from 'react';
import AddTodoFrom from '../components/addTodo';
import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import TodoNotes from '../components/todoNotes';
import getTodo from '../todoRequest/getTodo';

interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

interface GetTodoResponse {
  getTodoByUser: Todo[];
}

function App() {
  const token = Cookies.get('sessionId') || ''

  const { data, isLoading, error } = useQuery<GetTodoResponse, Error>({
    queryKey: ['getTodoByUser'],
    queryFn: () => getTodo({ token } as any),
  });
  console.log(data)
  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div className="max-w-[1500px] mx-auto p-4 relative">
      <AddTodoFrom />
      <div className="grid grid-cols-4 gap-4">
        {data?.getTodoByUser?.map((todo) => (
          <TodoNotes key={todo.id} data={todo} />
        ))}
      </div>
    </div>
  );
}

export default App;
