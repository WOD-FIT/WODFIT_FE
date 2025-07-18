import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_DEV_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
