"use client";

import { useState, FormEvent } from "react";
import { REGISTER_USER } from "../lib/graphql";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";

// Define types for the mutation response and variables
interface RegisterUserResponse {
    register: {
        token: string;
    };
}

interface RegisterUserVariables {
    email: string;
    password: string;
    username: string;
}

const RegisterForm: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [username, setUsername] = useState<string>("");

    const [registerUser, { loading }] = useMutation<
        RegisterUserResponse,
        RegisterUserVariables
    >(REGISTER_USER);

    const router = useRouter();

    const handleRegister = async (e: FormEvent) => {
        e.preventDefault();

        try {
            const { data } = await registerUser({
                variables: { email, password, username },
            });

            console.log("Registered successfully:", data?.register);

            // Store the token and redirect
            if (data?.register) {
                router.push("/login");
            }
        } catch (err) {
            console.error("Error during registration:", err);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-black">
            <form
                onSubmit={handleRegister}
                className="w-full max-w-md p-10 bg-white rounded-lg shadow-2xl space-y-4"
            >
                <h2 className="text-4xl font-semibold text-center text-gray-700">
                    Register
                </h2>

                <div>
                    <label
                        htmlFor="username"
                        className="block text-lg text-black font-medium"
                    >
                        Username:
                    </label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

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
                    {loading ? "Registering..." : "Register"}
                </button>
            </form>
        </div>
    );
};

export default RegisterForm;
