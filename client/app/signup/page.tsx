'use client'
import Loader from '@/components/Loader';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from "react";
import { userSignUp } from '../../UserRequest/userSignup';
const page = () => {
    const router = useRouter()
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        username: '',
        password: '',
    });
    const queryClient = useQueryClient();

    const { mutate, data, isPending } = useMutation({
        mutationKey: ['SignupUser'],
        mutationFn: userSignUp
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(formData.email)) {
            alert('Invalid email address');
        }
        else {
            try {
                const res = mutate({ ...formData }, {
                    onSuccess: () => {
                        queryClient.invalidateQueries({ queryKey: ['userData'] }); // Corrected line
                        router.push('/');
                    }
                });
            } catch (err) {
                console.error(err);
            }
        }
    }

    const changeFormData = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        // Update state immutably
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };
    useEffect(() => {
        if (data) {
            router.replace('/')
        }
    }, [data])
    if (isPending) {
        return <Loader />
    }
    return (
        <div className="h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-gray-200">
            <div className="-mt-12 rounded-xl p-2 font-serif bg-white shadow-md p-10 transition-transform">
                <header className="flex items-center justify-center text-4xl font-medium text-blue-700 p-2">SignUp Form</header>
                <form action="" className=" justify-center mt-4 p-6 text-lg " onSubmit={(e) => handleSubmit(e)}>
                    <table >
                        <tbody>
                            <tr >
                                <td className="p-2">
                                    <label htmlFor="" >First name : </label>
                                </td>
                                <td className="p-2">
                                    <input type="text" placeholder="Enter first name" required name="first_name" className="border-b border-black focus:outline-none" onChange={(e) => changeFormData(e)} />
                                </td>
                            </tr>
                            <tr>
                                <td className="p-2">
                                    <label htmlFor="">Last name : </label>
                                </td>
                                <td className="p-2">
                                    <input type="text" placeholder="Enter last name" required name="last_name" className="border-b border-black focus:outline-none" onChange={(e) => changeFormData(e)} />
                                </td>
                            </tr>
                            <tr>
                                <td className="p-2">
                                    <label htmlFor="">Email-id : </label>
                                </td>
                                <td className="p-2">
                                    <input
                                        type="email"
                                        placeholder="Enter email-id"
                                        required
                                        name="email"
                                        className="border-b border-black focus:outline-none"
                                        onChange={(e) => changeFormData(e)}
                                        pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className="p-2">
                                    <label htmlFor="">Username : </label>
                                </td>
                                <td className="p-2">
                                    <input type="text" placeholder="Enter username" required name="username" className="border-b border-black focus:outline-none" onChange={(e) => changeFormData(e)} />
                                </td>
                            </tr>
                            <tr>
                                <td className="p-2">
                                    <label htmlFor="">Password : </label>
                                </td>
                                <td className="p-2">
                                    <input type="password" placeholder="Enter your password" required name="password" className="border-b border-black focus:outline-none" onChange={(e) => changeFormData(e)} />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="form-group ">
                    </div>
                    <div className="w-full form-group flex justify-center items-center mt-4">
                        <input type="Submit" className="w-full bg-blue-500 rounded-md p-2 text-white" />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default page
