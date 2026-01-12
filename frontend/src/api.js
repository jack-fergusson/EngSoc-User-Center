import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_MYBACKEND_ENV|| "http://localhost:3000",
  withCredentials: true, // <--- Important for session/cookie auth!
});

export default api;
