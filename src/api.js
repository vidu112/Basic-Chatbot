import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  withCredentials: true,       // so cookies (refresh-token) are sent
  headers: {
    "Content-Type": "application/json",
  },
});