import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.1.23:3000", // Base URL for your API
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
