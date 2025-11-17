import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: "http://localhost:3000", // JSON server endpoint
  timeout: 5000, // 5 seconds timeout
});

export default api;