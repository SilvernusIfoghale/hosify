import axios, { type AxiosInstance } from "axios";

const refreshClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://housifyapi.fivestarsdigitalmedia.com/api",
  withCredentials: true, // IMPORTANT: Ensures cookies (which hold the refresh token) are sent
  headers: {
    "Content-Type": "application/json",
  },
});

export { refreshClient };
