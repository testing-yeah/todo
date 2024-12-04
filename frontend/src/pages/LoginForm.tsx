"use client";

import { loginUserRequest } from "@/userRequests/loginUserRequest";
import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginForm: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const router = useRouter();

    const { mutate: loginUser } = useMutation({
        mutationFn: loginUserRequest,

        onSuccess: (token: string) => {
            const isSecure = window.location.protocol === "https:";
            localStorage.setItem("token", token);
            Cookies.set("token", token, { expires: 7, secure: isSecure });
            toast.success("Login successful!");
            router.replace("/");
        },
        onError: (err) => {
            console.error("Error during login:", err);
            toast.error("Invalid email or password. Please try again.");
        },
    });

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        loginUser({ email, password });
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-black">
            <form
                onSubmit={handleLogin}
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

            <ToastContainer position="top-right" autoClose={2000} newestOnTop />
        </div>
    );
};

export default LoginForm;
