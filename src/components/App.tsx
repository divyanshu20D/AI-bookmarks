"use client";

import React, { useState, useEffect } from "react";
import { AuthForm } from "./AuthForm";
import { Dashboard } from "./Dashboard";

export const App: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authToken, setAuthToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for existing auth token in localStorage
        const token = localStorage.getItem("bookmarkAI_token");
        if (token) {
            setAuthToken(token);
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, []);

    const handleLogin = (token: string) => {
        localStorage.setItem("bookmarkAI_token", token);
        setAuthToken(token);
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        localStorage.removeItem("bookmarkAI_token");
        setAuthToken(null);
        setIsAuthenticated(false);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <>
            {isAuthenticated ? (
                <Dashboard onLogout={handleLogout} />
            ) : (
                <AuthForm onLogin={handleLogin} />
            )}
        </>
    );
};