'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { loginUser } from '../../UserRequest/userLogin';
import Loader from '@/components/Loader';
const LoginForm = () => {
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationKey: ['loginUser'],
        mutationFn: loginUser,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutate(
            { emailOrUsername, password },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ['userData'] }); 
                    router.push('/');
                },
                onError: (error) => {
                    console.error('Login failed:', error);
                },
            }
        );
    };
    if (isPending) {
        return <Loader />
    }
    return (
        <div className="h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-gray-200">
            <div className="-mt-12 rounded-xl p-2 font-serif bg-white shadow-md p-10 transition-transform">
                <header className="flex items-center justify-center text-4xl font-medium text-blue-700 p-2">Login Form</header>
                <form onSubmit={handleSubmit} className="justify-center mt-4 p-6 text-lg">
                    <table>
                        <tbody>
                            <tr>
                                <td className="p-3">
                                    <label>Email or Username:</label>
                                </td>
                                <td className="p-3">
                                    <input
                                        type="text"
                                        required
                                        onChange={(e) => setEmailOrUsername(e.target.value)}
                                        placeholder="Enter email or username"
                                        className="border-b border-black focus:outline-none"
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className="p-3">
                                    <label>Password:</label>
                                </td>
                                <td className="p-3">
                                    <input
                                        type="password"
                                        required
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        className="border-b border-black focus:outline-none"
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="w-full flex justify-center items-center mt-8">
                        <input type="submit" className="w-full bg-blue-500 rounded-md p-2 text-white" />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;
