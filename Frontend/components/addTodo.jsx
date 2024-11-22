'use client'
import React, { useRef, useState } from 'react'
import useOutside from '../hooks/useOutside'
import { Button } from '../@/components/ui/button';
import { gql, useMutation } from '@apollo/client';
import Cookies from 'js-cookie';

function AddTodoForm() {

    const TODO_MUTATION = gql`
       mutation createTodo($title: String!, $description: String!) {
    createTodo(title: $title, description: $description) {
        id
        title
        description
    }}`;

    const [createTodo, { data, error, loading }] = useMutation(TODO_MUTATION)

    const formRef = useRef()

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [completed, setCompleted] = useState(false);
    const [formPopup, setFormPopup] = useState(false)
    const userCookie = Cookies?.get('sessionId')
    console.log(userCookie)

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userCookie) {
            alert('User not Logged In')
        }
        if (!title || !description) {
            alert('Please fill in all fields');
            return;
        }
        try {
            const { data } = await createTodo({ variables: { title, description } });
            console.log('Todo created:', data);
        } catch (e) {
            console.error('Error creating todo:', e);
        }

        setTitle('');
        setDescription('');
        setCompleted(false);
    };

    useOutside(formRef, () => setFormPopup(false))

    return (
        <>
            <div className='flex justify-end text-white mb-4' onClick={() => setFormPopup(true)}>
                <Button variant='outline' className=' px-2'>Create Todo</Button>
            </div>

            {formPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="w-96 p-6 rounded-lg shadow-lg">
                        <form onSubmit={handleSubmit} className="todo-form mb-6 p-4 border rounded-md shadow-md" ref={formRef}>
                            <h2 className="text-xl font-semibold mb-4">Add Todo</h2>

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