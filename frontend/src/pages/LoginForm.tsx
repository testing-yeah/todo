"use client";

import { QueryClient, dehydrate } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { loginUserRequest } from "@/userRequests/loginUserRequest";
import Cookies from "js-cookie";
import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Link from "next/link";

export async function getServerSideProps() {
    const queryClient = new QueryClient();

    return {
        props: {
            dehydratedState: dehydrate(queryClient),
        },
    };
}

const LoginPage = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { mutate: loginUser } = useMutation({
        mutationFn: loginUserRequest,
        onSuccess: (token: string) => {
            const isSecure = window.location.protocol === "https:";
            Cookies.set("token", token, { expires: 7, secure: isSecure });
            toast.success("Login successful!");
            router.push("/");
        },
        onError: (error: Error) => {
            toast.error("Login failed! Please check your credentials.");
            console.error("Error during login:", error);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        loginUser({ email, password });
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md p-10 bg-white rounded-lg shadow-2xl space-y-4"
            >
                <h2 className="text-4xl font-semibold text-center text-gray-700">
                    Login
                </h2>

                <div>
                    <label
                        htmlFor="email"
                        className="block font-medium text-lg text-black"
                    >
                        Email:
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label
                        htmlFor="password"
                        className="block font-medium text-lg text-black"
                    >
                        Password:
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    Login
                </button>

                <div>
                    <p className="text-base text-black">
                        Don&apos;t have an account?{" "}
                        <Link href="/register" className="text-blue-700 underline">
                            Register
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default LoginPage;
