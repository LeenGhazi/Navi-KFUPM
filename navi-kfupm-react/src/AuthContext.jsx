import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [role, setRole] = useState("guest");

  const login = (newRole) => setRole(newRole);
  const signup = () => setRole("user");
  const logout = () => setRole("guest");

  return (
    <AuthContext.Provider value={{ role, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}