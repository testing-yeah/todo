"use client";

import { useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import React from "react";
import { LOGOUT_USER, LogoutUserResponse } from "../lib/graphql";
import Cookies from "js-cookie";

const LogoutButton: React.FC = () => {
    const [logout, { loading }] = useMutation<LogoutUserResponse>(LOGOUT_USER);
    const router = useRouter();

    const handleLogout = async () => {
        try {
            const token = await logout();

            if (token) {
                Cookies.remove("token");
                router.push("/login");
            }
        } catch (e) {
            console.error("Logout error:", e);
        }
    };

    return (
        <button
            onClick={handleLogout}
            disabled={loading}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg shadow-lg transform transition-all duration-200 ease-in-out hover:scale-105 disabled:opacity-50"
        >
            {loading ? "Logging out..." : "Logout"}
        </button>
    );
};

export default LogoutButton;
