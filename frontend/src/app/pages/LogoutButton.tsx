"use client";

import { useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import React from "react";
import { LOGOUT_USER, LogoutUserResponse } from "../lib/graphql";

const LogoutButton: React.FC = () => {
    const [logout, { loading }] = useMutation<LogoutUserResponse>(LOGOUT_USER);
    const router = useRouter();

    const handleLogout = async () => {
        try {
            const token = await logout();

            if (token) {
                localStorage.removeItem("token");
                router.push("/login");
            }
        } catch (e) {
            console.error("Logout error:", e);
        }
    };

    return (
        <button onClick={handleLogout} disabled={loading}>
            {loading ? "Logging out..." : "Logout"}
        </button>
    );
};

export default LogoutButton;
