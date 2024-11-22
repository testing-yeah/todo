"use client";

import { useState, FormEvent } from "react";
import { LOGIN_USER } from "../lib/graphql";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";

// Define types for the mutation response and variables
interface LoginUserResponse {
    login: string;
}

interface LoginUserVariables {
    email: string;
    password: string;
}

const LoginForm: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const [loginUser, { loading }] = useMutation<
        LoginUserResponse,
        LoginUserVariables
    >(LOGIN_USER);

    const router = useRouter();

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();

        try {
            const { data } = await loginUser({
                variables: { email, password },
            });

            console.log("Logged in successfully:", data?.login);

            const token = data?.login; // Login is a string (the token itself)
            if (token) {
                localStorage.setItem("token", token); // Save token to localStorage
                router.push("/"); // Navigate to home page
            }
        } catch (err) {
            console.error("Error during login:", err);
        }
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
                    disabled={loading}
                    className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
};

export default LoginForm;
