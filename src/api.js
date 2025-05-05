import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,    // send HttpOnly refresh cookie
});
