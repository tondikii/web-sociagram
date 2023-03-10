import axios from "axios";

export const BASE_URL = "https://sociagram-v1-production.up.railway.app/api/";

export const api = axios.create({
  timeout: 325000,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
  },
  baseURL: BASE_URL,
});
