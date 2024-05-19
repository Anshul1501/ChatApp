import React, { useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const { setAuthUser } = useAuthContext();

    const login = async (username, password) => {
        setLoading(true);
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });
            if (!res.ok) {
                throw new Error('Failed to login. Please check your credentials.');
            }
            const data = await res.json();
            localStorage.setItem('chat-user', JSON.stringify(data));
            setAuthUser(data);
            toast.success('Login successful!');
        } catch (error) {
            toast.error(error.message || 'Failed to login. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return { loading, login };
};

export default useLogin;
