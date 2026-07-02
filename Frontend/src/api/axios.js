import axios from "axios";

// Create a custom axios instance so we don't repeat
// "http://localhost:5000/api" in every single API call
const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// This interceptor runs automatically before EVERY request
// Its job: attach the login token so protected routes accept our request
api.interceptors.request.use((config) => {
  // Grab token saved during login
  const token = localStorage.getItem("token");

  // If token exists, add it to the Authorization header
  // Our backend's protect middleware reads this exact header
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config; // proceed with the request
});

export default api;