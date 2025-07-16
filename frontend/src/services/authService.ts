import http from '../utils/https';
import { endpoints } from '../configs/config';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  role: string;
  userName: string;
  email: string;
}

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await http.post<LoginResponse>(endpoints.loginEndpoint, credentials);
      return response.data;
    } catch (error: any) {
      //有bug，后端没起来也返回404
      if (error.response?.status === 404) {
        throw new Error('用户不存在');
      }
      if (error.response?.status === 401) {
        throw new Error('密码错误');
      }
      throw new Error('登录失败，请稍后重试');
    }
  },
  async getCurrentUser(): Promise<LoginResponse | null> {
    try {
      const response = await http.get(endpoints.meEndpoint);
      return response.data;
    } catch (error: any) {
      return null;
    }
  }
}; 