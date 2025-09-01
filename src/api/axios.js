import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.1.14:3000", // Base URL for your API
});

export default api;
