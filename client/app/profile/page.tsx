'use client'
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from 'next/navigation';
import { useEffect } from "react";

// Define the type of the user data
interface UserData {
    user_id: string;
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    password: string;
}

const Page = () => {
    const user_id = JSON.parse(localStorage.getItem('userData') as string).user_id;
    const router = useRouter()

    useEffect(() => {
        if (!localStorage.getItem('userData')) {
            router.push('/login')
        }
    }, []);

    // Define the getUserData function
    const getUserData = async (): Promise<UserData> => {
        try {
            const response = await axios.post('http://localhost:5000/auth/user-data', { user_id }, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true
            });

            return response.data;
        } catch (error) {
            console.error('Error fetching user data:', error);
            throw error; // Rethrow the error so it can be handled by useQuery
        }
    };

    // Type the useQuery hook with UserData
    const { data, isLoading, error, refetch } = useQuery<UserData>({
        queryKey: ['getUserData'],
        queryFn: getUserData,
    });

    useEffect(() => {
    }, [data]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error instanceof Error) {
        return <div>Error: {error.message}</div>;
    }

    // Render the user data in the table
    return (
        <div>
            {data && (
                <table className="flex justify-center items-center font-serif">
                    <tbody>
                        <tr>
                            <td>User_id </td>
                            <td>: {data.user_id}</td>
                        </tr>
                        <tr>
                            <td>First name </td>
                            <td>: {data.first_name}</td>
                        </tr>
                        <tr>
                            <td>Last name </td>
                            <td>: {data.last_name}</td>
                        </tr>
                        <tr>
                            <td>Username </td>
                            <td>: {data.username}</td>
                        </tr>
                        <tr>
                            <td>Email-id </td>
                            <td>: {data.email}</td>
                        </tr>
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Page;
