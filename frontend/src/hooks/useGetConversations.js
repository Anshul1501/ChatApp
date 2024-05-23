import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const useGetConversations = () => {
    const [loading, setLoading] = useState(false);
    const [conversations, setConversations] = useState([]);

    // Retrieve token from local storage
    const tokenString = localStorage.getItem('chat-user');
    const token = tokenString ? JSON.parse(tokenString).token : null;

    useEffect(() => {
        const getConversations = async() => {
            if (!token) {
                toast.error('User is not authenticated');
                return;
            }

            setLoading(true);
            try {
                const res = await fetch('api/users', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!res.ok) {
                    const errorText = await res.text();
                    console.error('Fetch error:', errorText);
                    throw new Error(errorText || 'Failed to fetch conversations');
                }

                const data = await res.json();
                console.log('Fetched data:', data); // Log the data to verify the response

                if (Array.isArray(data.allUsers)) {
                    setConversations(data.allUsers);
                } else {
                    throw new Error('Invalid response format');
                }
            } catch (error) {
                console.error('Fetch error:', error);
                toast.error(error.message || 'An error occurred while fetching conversations');
            } finally {
                setLoading(false);
            }
        };

        getConversations();
    }, [token]);

    return { loading, conversations };
};

export default useGetConversations;