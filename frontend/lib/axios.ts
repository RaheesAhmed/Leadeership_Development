import axios from "axios";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
  withCredentials: true, // Add this to ensure cookies are sent with requests
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
