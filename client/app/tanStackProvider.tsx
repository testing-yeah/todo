'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useState } from 'react';

interface Props {
    children: React.ReactNode;
}
interface AuthState {
    user_id: string;
    username: string;
    email: string;
}

function TanStackProvider({ children }: Props): React.JSX.Element {

    const [authState, setAuthState] = useState<AuthState>({
        user_id: '',
        username: '',
        email: '',
    });
    const [queryClient] = useState(() => new QueryClient());
    return <QueryClientProvider client={queryClient}>
        {children}
    </QueryClientProvider>
}

export default TanStackProvider