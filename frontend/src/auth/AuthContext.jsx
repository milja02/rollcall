import { useEffect, useState } from "react";
import { api } from "../api/client.js";
import { AuthContext } from "./auth.js";

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
