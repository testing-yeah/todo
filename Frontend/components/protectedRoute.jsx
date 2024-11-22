'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function ProtectedRoute({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const userSession = Cookies.get('sessionId');

        if (!userSession) {
            router.push('/signup');
        } else {
            router.replace('/')
        }
    }, [router]);


    // useEffect(() => {
    //     const checkSession = async () => {
    //         if (!Cookies.get('sessionId')) {
    //             console.log('No session cookie found');
    //             router.push('/login');
    //             return;
    //         }

    //         try {
    //             const response = await fetch('/api/check-session', { method: 'GET' });
    //             if (!response.ok) {
    //                 if (response.status === 401) {
    //                     console.log('Session expired or invalid');
    //                     Cookies.remove('sessionId');
    //                     router.push('/login');
    //                 }
    //                 return;
    //             }
    //             const data = await response.json();
    //             console.log('Session valid:', data);
    //         } catch (error) {
    //             console.error('Error checking session:', error);
    //             Cookies.remove('sessionId');
    //             router.push('/login');
    //         }
    //     };

    //     checkSession();
    // }, [router]);


    return (
        <div>
            {children}
        </div>
    );
}
