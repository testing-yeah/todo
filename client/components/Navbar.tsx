'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { logout } from '../UserRequest/userLogout';
import { validateUser } from '../UserRequest/userValidation';
import Loader from './Loader';

const Navbar = () => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['userData'],
        queryFn: validateUser,
    });

    useEffect(() => {
        if (data?.isAuthenticated) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    }, [data, isAuthenticated]);

    const { mutate } = useMutation({
        mutationKey: ['logout'],
        mutationFn: logout,
        onSuccess: () => {
            localStorage.removeItem('userData');
            setIsAuthenticated(false);
            refetch()
            router.push('/login');
        },
        onError: (error) => {
            console.error('Logout failed:', error);
        },
    });

    const handleLogout = () => {
        mutate();
    };

    if (isLoading) {
        return <Loader />;
    }

    if (error) {
        console.error('Error fetching user data:', error);
        return (
            <div className="w-full bg-red-700 font-serif text-lg font-medium flex justify-center items-center text-white">
                <span>Error loading user data</span>
            </div>
        );
    }

    return (
        <div className="w-full bg-blue-700 font-serif text-lg font-medium flex justify-between items-center">
            <span className="ml-10 m-4 font-bold text-4xl text-white">To-Do List</span>
            <ul className="flex flex-row mr-10 text-white">
                {isAuthenticated ? (
                    <>
                        <li className="m-4">
                            <Link href="/">Home</Link>
                        </li>
                        <li className="m-4">
                            <Link href="/profile">Profile</Link>
                        </li>

                        <li className="m-4">
                            <button onClick={handleLogout}>Logout</button>
                        </li>
                    </>
                ) : (
                    <>
                        <li className="m-4">
                            <Link href="/login">Login</Link>
                        </li>
                        <li className="m-4">
                            <Link href="/signup">SignUp</Link>
                        </li>
                    </>
                )}
            </ul>
        </div>
    );
};

export default Navbar;
