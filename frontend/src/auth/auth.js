import { createContext, useContext } from "react";

export const AuthContext = createContext({ user: null, loading: true });

export const HOME_BY_ROLE = {
  ADMIN: "/admin",
  COORDINATOR: "/programs",
  LECTURER: "/calendar",
};

export function useAuth() {
  return useContext(AuthContext);
}
