import { createContext, useContext, useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode"; // Note the corrected import

export const AuthContext = createContext();

export const useAuthContext = () => {
    return useContext(AuthContext);
}

export const AuthContextProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("chat-user");
        if (storedUser) {
            const { token, ...rest } = JSON.parse(storedUser);
            const decodedUser = jwtDecode(token);
            const user = { ...rest, userId: decodedUser.userId, fullName: decodedUser.fullName }; // Make sure to use userId here
            setAuthUser(user);
            console.log("AuthUser set in context:", user);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ authUser, setAuthUser }}>
            {children}
        </AuthContext.Provider>
    );
}
