import React from 'react'
import { Trash2 } from 'lucide-react';
import { Button } from '../@/components/ui/button';
import AddTodoFrom from '../components/addTodo'

function App() {

  const fakeData = [
    {
      id: 1,
      title: 'Complete Work',
      desc: "ajsndasdasdkjasjksd"
    },
    {
      id: 2,
      title: 'Complete Work',
      desc: "ajsndasdasdkjasjksd"
    },
    {
      id: 3,
      title: 'Complete Work',
      desc: "ajsndasdasdkjasjksd"
    },
    {
      id: 4,
      title: 'Complete Work',
      desc: "ajsndasdasdkjasjksd"
    },
    {
      id: 5,
      title: 'Complete Work',
      desc: "ajsndasdasdkjasjksd"
    },
    {
      id: 6,
      title: 'Complete Work',
      desc: "ajsndasdasdkjasjksd"
    },
  ]

  return (
    <>
      <div className='max-w-[1500px] mx-auto p-4 relative'>
        <AddTodoFrom />
        <div className='grid grid-cols-4 gap-4'>
          {
            fakeData.map((data) => {
              return (
                <div key={data.id} className='w-full py-2 px-3 border border-slate-400 rounded-md'>
                  <div className='flex justify-between items-center'>
                    <p>📍 {" "} {data.title}</p>
                    <Button variant="destructive">
                      <Trash2 size={20} color={'red'} />
                    </Button>
                  </div>
                  <p className='pl-6'>{data.desc}</p>
                </div>
              )
            })
          }
        </div >
      </div >
    </>
  )
}

export default App