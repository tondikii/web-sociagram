import axios from "axios";

export const BASE_URL = "http://localhost:3002/api";

export const api = axios.create({
  timeout: 325000,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
  },
  baseURL: BASE_URL,
});
