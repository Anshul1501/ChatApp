import { createContext, useEffect, useState } from "react";
import { useAuthContext } from './AuthContext';
import { io } from 'socket.io-client'; // Correct import for socket.io-client

export const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const { authUser } = useAuthContext();

    useEffect(() => {
        if (authUser) {
            const newSocket = io("http://localhost:5000"); // Initialize socket connection
            setSocket(newSocket);

            newSocket.on('connect', () => {
                console.log('Socket connected:', newSocket.id);
            });

            newSocket.on('disconnect', () => {
                console.log('Socket disconnected');
            });

            // Clean up on unmount or when authUser changes
            return () => {
                newSocket.close();
                setSocket(null);
            };
        } else {
            if (socket) {
                socket.close();
                setSocket(null);
            }
        }
    }, [authUser]); // Dependency array includes authUser

    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    );
};
