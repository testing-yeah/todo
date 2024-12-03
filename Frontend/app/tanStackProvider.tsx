'use client'
import React, { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

interface Props {
    children: React.ReactNode;
}

function TanStackProvider({ children }: Props): React.JSX.Element {
    const [queryClient] = useState(() => new QueryClient());
    return <QueryClientProvider client={queryClient}>
        {children}
    </QueryClientProvider>
}

export default TanStackProvider