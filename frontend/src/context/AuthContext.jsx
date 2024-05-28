import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const useAuthContext = () => {
    return useContext(AuthContext);
}

export const AuthContextProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("chat-user");
        if (storedUser) {
            const token = JSON.parse(storedUser).token;
            const decodedUser = jwtDecode(token);
            setAuthUser({ ...JSON.parse(storedUser), _id: decodedUser.userId });
        }
    }, []);

    return (
        <AuthContext.Provider value={{ authUser, setAuthUser }}>
            {children}
        </AuthContext.Provider>
    );
}
