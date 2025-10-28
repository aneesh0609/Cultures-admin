// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api", // change if backend URL is different
  withCredentials: true, // important for cookies
});

export default api;
