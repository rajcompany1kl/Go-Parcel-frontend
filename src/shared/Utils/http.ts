import axios, { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";
import Cookie from 'js-cookie'

const http = axios.create({
  baseURL: 'http://localhost:5000/', // Base URL for your API
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Cookie.get('authToken')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
http.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(response)
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.error('Unauthorized access - redirecting to login.');
    }
    return Promise.reject(error);
  }
);

export default http;