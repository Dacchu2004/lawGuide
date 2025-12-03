// frontend/src/api/auth.ts
import { api } from "./client";

export type User = {
  id: number;
  email: string;
  state: string;
  language: string;
  username?: string | null;
};

export type AuthResponse = {
  message: string;
  token: string;
  user: User;
};

type SignupPayload = {
  email: string;
  password: string;
  state: string;
  language: string;
  username?: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

export async function signupRequest(payload: SignupPayload): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>("/auth/signup", payload);
  return res.data;
}

export async function loginRequest(payload: LoginPayload): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>("/auth/login", payload);
  return res.data;
}
