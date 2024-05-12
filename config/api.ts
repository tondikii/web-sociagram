import axios from "axios";

export const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://be-sociagram.vercel.app/"
    : "http://localhost:3002/";

export const api = axios.create({
  timeout: 325000,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
  },
  baseURL: BASE_URL,
});
