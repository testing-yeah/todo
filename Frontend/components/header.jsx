'use client';

import { gql } from '@apollo/client';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { Button } from '../@/components/ui/button';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getUser } from '../userRequests/getUser'

const GET_USER = gql`
  query GetUser {
    getUserProfile {
      id
      username
      email
    }
  }`;

function Header() {
    const token = Cookies.get('sessionId')
    const { data, loading, error } = useQuery({
        queryKey: ['getUserProfile'],
        queryFn: () => getUser(token)
    });
    const router = useRouter()

    async function handleLogout() {
        try {
            const response = await fetch('http://localhost:8000/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sessionId: token }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error logging out:', errorData.message);
                return;
            }

            const data = await response.json();
            // Cookies.remove('sessionId');
            // refetch()
            console.log('Logout successful:', data.message);

            // window.location.href = '/login';
        } catch (error) {
            console.error('Error during logout request:', error);
        }
    }

    return (
        <div className='bg-stone-300 w-full h-16'>
            <div className='max-w-[1500px] mx-auto flex justify-between p-5 text-black'>
                <Link href={'/'} className='text-xl font-semibold'>TODO</Link>
                <div>
                    {loading ? (
                        'Loading...'
                    ) : (
                        data ? <div className='flex gap-3 items-center'>
                            <span>{data ? data.username : 'User'}</span>
                            <Button className='px-3 bg-red-600 text-white hover:bg-gray-600' onClick={() => handleLogout()}>SignOut</Button>
                        </div> :
                            <>
                                <div className='flex gap-2'><Link href={'/login'} className='py-1 px-4 rounded-sm bg-blue-600 text-white'>Login</Link>
                                    <Link className='py-1 px-4 rounded-sm bg-blue-600 text-white' href={'/signup'} variant='outline'>SignUp</Link></div>
                            </>

                    )}
                </div>
            </div>
        </div >
    );
}

export default Header;
