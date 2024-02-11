import axios from "axios";

export const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://gold-friendly-tortoise.cyclic.app/api"
    : "http://localhost:3002/api";

export const api = axios.create({
  timeout: 325000,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
  },
  baseURL: BASE_URL,
});
