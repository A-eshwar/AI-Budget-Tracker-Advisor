import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
import api from "../api/axiosClient";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [alertCount, setAlertCount] = useState(0);


  const loadMe = useCallback(async () => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);
      await loadAlertCount(parsed.id); // 🔔
      setLoading(false);
      return;
    }

    try {
      const res = await api.get("/auth/me");
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      await loadAlertCount(res.data.id); // 🔔
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  }, []);

  /* ---------------- ALERT COUNT ---------------- */

  const loadAlertCount = async (userId) => {
    if (!userId) return;

    try {
      const res = await api.get("/budget/alerts/count", {
        params: { userId }
      });
      setAlertCount(res.data);
    } catch {
      setAlertCount(0);
    }
  };

  const refreshAlertCount = async () => {
    if (user?.id) {
      await loadAlertCount(user.id);
    }
  };



  const login = async (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    await loadAlertCount(userData.id); // 🔔
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setAlertCount(0);
  };

  useEffect(() => {
    loadMe();
  }, [loadMe]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        alertCount,  
        setAlertCount,      
        refreshAlertCount    
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
