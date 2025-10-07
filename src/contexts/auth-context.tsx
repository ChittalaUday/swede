"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Get admin credentials from environment variables
  const ADMIN_USERNAME = process.env.NEXT_PUBLIC_ADMIN_USERNAME || process.env.ADMIN_USERNAME || "admin";
  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD || "wedding2025";
  const SESSION_SECRET = process.env.NEXT_PUBLIC_SESSION_SECRET || process.env.SESSION_SECRET || "your-session-secret-key";

  // Check if user is already logged in on initial load
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      // In a real application, you would verify the token with your backend
      try {
        // Simple token verification (in a real app, this would be a JWT or similar)
        const decoded = atob(token);
        const [username, timestamp, secret] = decoded.split(':');
        
        // Check if token is still valid (24 hours)
        const tokenAge = Date.now() - parseInt(timestamp);
        if (tokenAge < 24 * 60 * 60 * 1000 && secret === SESSION_SECRET) {
          setIsAuthenticated(true);
        } else {
          // Token expired, remove it
          localStorage.removeItem("adminToken");
        }
      } catch (e) {
        // Invalid token, remove it
        localStorage.removeItem("adminToken");
      }
    }
  }, [SESSION_SECRET]);

  const login = async (username: string, password: string): Promise<boolean> => {
    // In a real application, this would be an API call to your backend
    // For demo purposes, we'll use environment variables
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Create a simple token (in a real app, this would be a JWT or similar)
      const token = btoa(`${username}:${Date.now()}:${SESSION_SECRET}`);
      localStorage.setItem("adminToken", token);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
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