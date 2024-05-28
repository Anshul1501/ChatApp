import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

const useGetMessages = () => {
    const [loading, setLoading] = useState(false);
    const { setMessages, selectedConversation } = useConversation();
    const token = localStorage.getItem('chat-user') ? JSON.parse(localStorage.getItem('chat-user')).token : null;

    useEffect(() => {
        const getMessages = async() => {
            if (!selectedConversation || !selectedConversation._id) return;

            setLoading(true);
            try {
                const res = await fetch(`/api/messages/get/${selectedConversation._id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                });
                if (!res.ok) {
                    const errorText = await res.text();
                    throw new Error(errorText || 'Failed to fetch messages');
                }
                const data = await res.json();
                if (data.error) throw new Error(data.error);

                setMessages(data); // Assuming messages are directly in the response data
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        getMessages();
    }, [selectedConversation, setMessages, token]);

    return { loading };
};

export default useGetMessages;