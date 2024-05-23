import React, { useEffect, useState } from 'react';
import useConversation from '../zustand/useConversation';
import toast from 'react-hot-toast';

const useGetMessages = () => {
    const [loading, setLoading] = useState(false);
    const { messages, setMessages, selectedConversation } = useConversation();

    useEffect(() => {
        const getMessages = async() => {
            if (!selectedConversation || !selectedConversation._id) return;

            try {
                setLoading(true);
                const token = localStorage.getItem('chat-user') ? JSON.parse(localStorage.getItem('chat-user')).token : '';

                const res = await fetch(`/api/messages/${selectedConversation._id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.error || 'Failed to fetch messages');
                }

                const data = await res.json();
                setMessages(data);
            } catch (error) {
                toast.error(error.message || 'An error occurred while fetching messages');
            } finally {
                setLoading(false);
            }
        };

        getMessages();
    }, [selectedConversation, setMessages]);

    return { messages, loading };
};

export default useGetMessages;