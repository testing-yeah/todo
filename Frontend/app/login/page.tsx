'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { Label } from '../../@/components/ui/label';
import { Form } from '../../@/components/ui/form';
import { Input } from '../../@/components/ui/input';
import { Button } from '../../@/components/ui/button';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { loginUser, LoginResponse } from '../../userRequests/loginUser';

interface FormData {
    email: string;
    password: string;
}

export default function Login() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState<FormData>({ email: '', password: '' });
    const [error, setError] = useState<string | null>(null);

    const { mutate, status, reset } = useMutation<LoginResponse, Error, FormData>({
        mutationFn: loginUser,
        onSuccess: (data) => {
            console.log('Login successful:', data);
            queryClient.setQueryData(['getUserProfile'], data.user);
            Cookies.set('sessionId', data.token, { expires: 7, secure: true });
            router.replace('/');
        },
        onError: (err) => {
            console.error('Login failed:', err.message);
            setError('Invalid credentials. Please try again.');
        },
        onSettled: () => {
            reset();
        },
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        mutate(formData);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <div className="bg-white max-w-md mx-auto shadow-lg rounded-md text-black">
            <div className="mt-16 p-6">
                <h2 className="text-2xl font-semibold text-center mb-6">Log In</h2>
                <Form>
                    <div className="mb-4">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="mt-2"
                        />
                    </div>
                    <div className="mb-4">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="mt-2"
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    <Button
                        onClick={handleSubmit}
                        className="w-full mt-6 bg-slate-900 text-white hover:bg-neutral-500"
                    >
                        Log In
                    </Button>
                </Form>
            </div>
        </div>
    );
}
