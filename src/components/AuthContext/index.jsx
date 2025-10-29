import { createContext, useContext, useState } from "react";
import { loroClient } from "../../loro-api-clients/loroClientInstance";
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [isAuth, setIsAuth] = useState(false);
    const checkAuth = async () => {
        try {
            await loroClient.refreshTokens();
            setIsAuth(true);
        } catch (error) {
            setIsAuth(false);
        }
    }
    
    const data = {
        isAuth,
        setIsAuth,
        checkAuth
    }

    return (
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    )
}

const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth not inside provider");
    return context;
}

export { AuthContext, AuthProvider, useAuth };