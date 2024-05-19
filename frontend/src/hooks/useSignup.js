import React, { useState } from 'react';
import toast from 'react-hot-toast';

const useSignup = () => {

    const [loading, setLoading] = useState(false);

    const signup = async({ fullName, username, password, confirmPassword, gender }) => {
        const success = handleInputErrors({ fullName, username, password, confirmPassword, gender });
        if (!success) return;

        setLoading(true);

        try {
            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ fullName, username, password, confirmPassword, gender }) // Include user credentials in the request body
            });

            if (!response.ok) {
                // Handle non-successful response (e.g., display error message)
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to Sign up. Please check your credentials.');
            }

            const data = await response.json();
            console.log(data);
            toast.success('Signup successful!');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return { loading, signup };
};

export default useSignup;

function handleInputErrors({ fullName, username, password, confirmPassword, gender }) {
    if (!fullName || !username || !password || !confirmPassword || !gender) {
        toast.error("Please fill in all fields");
        return false;
    }

    if (password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return false;
    }

    return true;
}