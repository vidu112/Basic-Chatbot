// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import { api } from "../api.js";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken]     = useState(null);
  const [loading, setLoading] = useState(true);

  // Redeem the refresh token (HttpOnly cookie) for a new access token
  const refresh = () => {
    return api
      .post("/auth/refresh-token")
      .then(res => {
        console.log("🔄 Refreshed Access Token:", res.data.accessToken);
        setToken(res.data.accessToken);
      })
      .catch(err => {
        console.log("🔄 Refresh failed:", err);
        setToken(null);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // On mount, attempt silent refresh
  useEffect(() => {
    refresh();
  }, []);

  // Log in with username & password
  const login = async (username, password) => {
    const res = await api.post("/auth/login", { username, password });
    console.log("🔑 Received Access Token:", res.data.accessToken);
    setToken(res.data.accessToken);
    return res;
  };

  // Sign up (with email, firstName, lastName) then auto-login
  const signup = async (username, email, firstName, lastName, password) => {
    await api.post("/auth/signup", { username, email, firstName, lastName, password });
    return login(username, password);
  };

  // Log out (clears server-side refresh token & cookie)
  const logout = async () => {
    await api.post("/auth/logout");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, loading, refresh, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}