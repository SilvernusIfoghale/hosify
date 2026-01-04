import axios, { type AxiosInstance } from "axios";

// Create an axios instance with default configuration
const apiClient: AxiosInstance = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    "https://housifyapi.fivestarsdigitalmedia.com/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    // Don't add token here - let individual requests handle it
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      console.error("API Error:", error.response.data);
      console.error("Status:", error.response.status);
    } else if (error.request) {
      console.error("No response received:", error.request);
      if (error.code === "ECONNABORTED") {
        console.error("Request timeout - server not responding");
      } else if (error.message === "Network Error") {
        console.error(
          "Network connection failed - check if backend is running"
        );
      }
    } else {
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export { apiClient };
