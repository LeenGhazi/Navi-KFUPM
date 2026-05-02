import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(undefined);

const API_URL = `${import.meta.env.VITE_API_URL}/api/users`;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("navikfupm_user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email, password, loginType) => {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, loginType }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Invalid credentials");
    }

    setUser(data);
    localStorage.setItem("navikfupm_user", JSON.stringify(data));

    return true;
  };

  const register = async (email, password, name) => {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, name }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

    setUser(data);
    localStorage.setItem("navikfupm_user", JSON.stringify(data));

    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("navikfupm_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}