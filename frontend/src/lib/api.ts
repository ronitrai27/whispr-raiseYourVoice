import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000", // fallback to local
  withCredentials: true, // always send cookies (important for auth)
});

export default api;
