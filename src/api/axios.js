import axios from "axios";

const api = axios.create({
  // baseURL: "http://192.168.1.14:3000", // Base URL for Locally API
    baseURL: "http://20.193.154.1:3000", // Base URL for Live API

  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
