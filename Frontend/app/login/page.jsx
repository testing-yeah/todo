'use client'
import { useQuery, gql, useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import { Label } from '../../@/components/ui/label'
import { Form } from '../../@/components/ui/form'
import { Input } from '../../@/components/ui/input'
import { Button } from '../../@/components/ui/button'
import { useRouter } from 'next/navigation';
import { v4 as uuidV4 } from 'uuid';
import Cookies from 'js-cookie';

export default function Login() {
    const LOGIN_USER = gql`
    mutation loginUser($email: String!, $password: String!) {
      loginUser(email: $email, password: $password) {
        user {
          id
          username
          email
        }
        sessionToken
      }
    }
  `;

    const router = useRouter()

    const [login, { data, loading, error }] = useMutation(LOGIN_USER);

    const [formData, setFormData] = useState({})

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const { data } = await login({ variables: { ...formData } });
            console.log('Logged in:', data);
            alert('Login successful!');
            if (data.loginUser.sessionToken) {
                Cookies.set('sessionId', data.loginUser.sessionToken, { expires: 7, secure: true });
                router.replace('/')
            }
        } catch (err) {
            console.error(err);
            alert('Invalid login credentials!');
        }
    }

    function handleChange(e) {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    console.log(data)

    return (
        <div className='bg-white max-w-md mx-auto shadow-lg rounded-md text-black'>
            <div className=" mt-16 p-6 ">
                <h2 className="text-2xl font-semibold text-center mb-6">Log In</h2>
                <Form>
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
                        LogIn
                    </Button>
                </Form>
            </div>
        </div>
    )
}
