// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../AuthContext";

export default function ProtectedRoute({ children }) {
  const { token, loading } = useContext(AuthContext);

  // While refreshing token, don’t flash the login screen
  if (loading) return null;

  return token ? children : <Navigate to="/login" replace />;
}
