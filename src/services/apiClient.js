// src/services/apiClient.js
import axios from "axios";

// 1. Create a new 'instance' of axios
const apiClient = axios.create({
  // This is the URL of your .NET backend
  baseURL: "https://localhost:7014/api", // (Check your port number)
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. Add an 'interceptor' (a special function)
// This function will run *before* every single API request
apiClient.interceptors.request.use(
  (config) => {
    // Get the token from local storage
    const token = localStorage.getItem("authToken");

    if (token) {
      // If the token exists, add it to the Authorization header
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
