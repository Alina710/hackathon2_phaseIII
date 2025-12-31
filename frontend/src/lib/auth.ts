import { api } from "./api";
import { AuthResponse, SignupRequest, SigninRequest } from "./types";

export const authApi = {
  signup: (data: SignupRequest) =>
    api.post<AuthResponse>("/auth/signup", data),

  signin: (data: SigninRequest) =>
    api.post<AuthResponse>("/auth/signin", data),

  signout: () =>
    api.post<{ message: string }>("/auth/signout"),

  getSession: () =>
    api.get<AuthResponse>("/auth/session"),
};
