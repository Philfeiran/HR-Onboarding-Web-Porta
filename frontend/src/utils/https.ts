// src/utils/http.ts
import axios from 'axios';
import { backendUrl } from '../configs/config';

// 获取 token 的函数
const getTokenFromCookie = (): string | null => {
  const cookies = document.cookie.split(';');
  const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
  return tokenCookie ? tokenCookie.split('=')[1] : null;
};

// 重定向到登录页的函数
const redirectToLogin = (): void => {
  window.location.href = '/login';
};

// 创建一个 axios 实例
const http = axios.create({
  // baseURL: backendUrl, // 移除 baseURL，使用完整的 endpoint
  timeout: 10_000,                             // 10 秒超时
  withCredentials: true,                       // 自动携带跨域 Cookie
  headers: {
    'Content-Type': 'application/json',
    // 可以在这里加一些全局 header，比如版本号、平台信息等
  },
});

// 请求拦截器：每次发请求前可以注入 token，或者做 loading 控制
http.interceptors.request.use(config => {
  // 比如从 Cookie/Redux/Context 里拿 token
  const token = getTokenFromCookie(); 
  if (token) {
    config.headers!.Authorization = `Bearer ${token}`;
  }
  return config;
}, err => Promise.reject(err));

// 响应拦截器：可以做统一的错误处理、状态码判断
http.interceptors.response.use(res => res, err => {
  if (err.response?.status === 401) {
    // 自动跳转登录页或刷新 token
    redirectToLogin();
  }
  return Promise.reject(err);
});

export default http;