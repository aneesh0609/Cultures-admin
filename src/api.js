// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL:  import.meta.env.VITE_BACK + "/api", // change if backend URL is different
  withCredentials: true, // important for cookies
});

export default api;
