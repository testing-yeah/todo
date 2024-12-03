'use client'
import { FormEvent, useEffect, useState, ChangeEvent } from 'react';
import { Label } from '../../@/components/ui/label'
import { Form } from '../../@/components/ui/form'
import { Input } from '../../@/components/ui/input'
import { Button } from '../../@/components/ui/button'
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { signUpUser } from '../../userRequests/signUp';

interface formData {
    username: string,
    email: string,
    password: string
}

export default function SignUp() {

    const router = useRouter()

    const [formData, setFormData] = useState<formData>({
        email: '', password: '', username: ''
    })

    const { mutate, data } = useMutation({
        mutationFn: signUpUser
    })

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const res = mutate({ ...formData }, {
                onSuccess: () => {
                    router.push('/login')
                }
            });
            console.log('response data', res);
            alert('User created successfully!');
        } catch (err) {
            console.error(err);
            alert('Error creating user!');
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    };

    useEffect(() => {
        if (data) {
            router.replace('/login')
        }
    }, [data])

    return (
        <div className='bg-white max-w-md mx-auto shadow-lg rounded-md text-black'>
            <div className=" mt-16 p-6 ">
                <h2 className="text-2xl font-semibold text-center mb-6">Sign Up</h2>
                <Form>
                    <div>
                        <Label htmlFor="email">Username</Label>
                        <Input
                            id="username"
                            type="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            className="mt-2 bg-transparent border"
                        />
                    </div>

                    <div>
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

                    <div>
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

                    <Button onClick={(e) => handleSubmit(e)} className="w-full mt-6 bg-slate-900 text-white hover:bg-neutral-500">
                        Sign Up
                    </Button>
                </Form>
            </div>
        </div>
    )
}
