import axios from "axios";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add a request interceptor to add the token to all requests
instance.interceptors.request.use(
  (config) => {
    // Only try to access document.cookie if window is defined (client-side)
    if (typeof window !== "undefined") {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      if (token) {
        const decodedToken = decodeURIComponent(token);
        config.headers["Authorization"] = `Bearer ${decodedToken}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
