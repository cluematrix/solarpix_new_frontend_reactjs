import axios from "axios";

const api = axios.create({
  baseURL: "http://20.193.154.1:3000", // Base URL for your API
});

export default api;
