import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/client.js";

export const AuthContext = createContext({user: null, loading: true});

export const HOME_BY_ROLE = {
    ADMIN: "/admin",
    COORDINATOR: "/programs",
    LECTURER: "/calendar",
};

export function AuthProvider({children}){
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        api("/auth/me/").then(setUser).catch(()=>setUser(null)).finally(()=>setLoading(false));
    }, []);

    async function login(email, password) {
    const loggedIn = await api("/auth/login/", { method: "POST", body: { email, password } });
    setUser(loggedIn);
    return loggedIn;
 }

    async function logout() {
        await api("/auth/logout/", { method: "POST" });
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
