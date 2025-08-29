import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL, // Base URL for API

  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
