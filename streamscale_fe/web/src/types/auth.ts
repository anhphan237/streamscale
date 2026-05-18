export interface UserInfo {
  id: number;
  email: string;
  role: string;
}

export interface AuthResponse {
  accessToken: string;
  user: UserInfo;
}

export interface MeResponse {
  id: number;
  email: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}
