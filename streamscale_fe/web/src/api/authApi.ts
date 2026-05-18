import axiosClient from './axiosClient';
import type {
  AuthResponse,
  LoginRequest,
  MeResponse,
  RegisterRequest,
} from '../types/auth';

export const authApi = {
  register: (data: RegisterRequest) =>
    axiosClient.post<AuthResponse>('/api/auth/register', data),

  login: (data: LoginRequest) =>
    axiosClient.post<AuthResponse>('/api/auth/login', data),

  me: () => axiosClient.get<MeResponse>('/api/auth/me'),
};
