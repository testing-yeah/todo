'use client';

import { gql } from '@apollo/client';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { Button } from '../@/components/ui/button';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getUser } from '../userRequests/getUser';

const GET_USER = gql`
  query GetUser {
    getUserProfile {
      id
      username
      email
    }
  }
`;

interface UserProfile {
    id: string;
    username: string;
    email: string;
}

const Header: React.FC = () => {
    const token = Cookies.get('sessionId');
    const queryClient = useQueryClient();
    const { data, isLoading, error, refetch } = useQuery<UserProfile | undefined>({
        queryKey: ['getUserProfile'],
        queryFn: () => getUser(Cookies.get('sessionId') as string),
        enabled: !!Cookies.get('sessionId'),
    });

    const router = useRouter();

    const handleLogout = async (): Promise<void> => {
        Cookies.remove('sessionId')
        queryClient.setQueryData(['getUserProfile'], null)
        router.push('/login')
    };

    return (
        <div className="bg-stone-300 w-full h-16">
            <div className="max-w-[1500px] mx-auto flex justify-between p-5 text-black">
                <Link href={'/'} className="text-xl font-semibold">TODO</Link>
                <div>
                    {
                        data ? (
                            <div className="flex gap-3 items-center">
                                <span>{data && data?.username}</span>
                                <Button className="px-3 bg-red-600 text-white hover:bg-gray-600" onClick={handleLogout}>
                                    SignOut
                                </Button>
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <Link href={'/login'} className="py-1 px-4 rounded-sm bg-blue-600 text-white">Login</Link>
                                <Link className="py-1 px-4 rounded-sm bg-blue-600 text-white" href={'/signup'}>SignUp</Link>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
};

export default Header;
