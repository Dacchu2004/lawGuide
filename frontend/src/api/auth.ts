// src/api/auth.ts
import api from "./client";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  email: string;
  password: string;
  username?: string;
  language: string;
  state: string;
}

export interface AuthUser {
  id: string;
  email: string;
  username?: string;
  language: string;
  state: string;
}

export interface LoginResponse {
  user: AuthUser;
  token: string;
}

// POST /auth/login
export async function loginRequest(payload: LoginPayload): Promise<LoginResponse> {
  const res = await api.post("/auth/login", payload);
  return res.data;
}

// POST /auth/signup
export async function signupRequest(payload: SignupPayload): Promise<void> {
  await api.post("/auth/signup", payload);
}

export interface UpdateProfilePayload {
  language?: string;
  state?: string;
  username?: string;
}

// PUT /auth/update
export async function updateUserRequest(payload: UpdateProfilePayload): Promise<{ user: AuthUser }> {
  const res = await api.put("/auth/update", payload);
  return res.data;
}
