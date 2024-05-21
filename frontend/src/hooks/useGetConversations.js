import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const useGetConversations = () => {
    const [loading, setLoading] = useState(false);
    const [conversations, setConversations] = useState([]);
    const tokenString = localStorage.getItem('chat-user');
    const token = tokenString ? JSON.parse(tokenString).token : null; // Retrieve token from local storage

    useEffect(() => {
        const getConversations = async() => {
            setLoading(true);
            try {
                const res = await fetch('/api/users', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` // Include the token in the Authorization header
                    }
                });

                if (!res.ok) {
                    const errorText = await res.text();
                    throw new Error(errorText || 'Failed to fetch conversations');
                }

                const data = await res.json();
                console.log(data); // Log the data to verify the response

                if (Array.isArray(data.allUsers)) {
                    setConversations(data.allUsers);
                } else {
                    throw new Error('Invalid response format');
                }
            } catch (error) {
                console.error('Fetch error:', error);
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };
        getConversations();
    }, [token]);

    return { loading, conversations };
};

export default useGetConversations;