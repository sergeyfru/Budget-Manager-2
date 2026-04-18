
import axios from "axios";
import type { ReqChangePassword, ReqLogin, ReqRegister, ResLogin, ResRefresh, ResSimple } from "@shared/core";

export const apiAuth = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api",
  withCredentials: true,
});


export const authApi = {
  login: (data: ReqLogin):Promise<ResLogin> =>
    apiAuth.post("/auth/login", data).then((res) => res.data),

  register: (data: ReqRegister): Promise<ResSimple> =>
    apiAuth.post("/auth/register", data).then((res) => res.data),

  refresh:(refresh_token: string):Promise<ResRefresh>=>
    apiAuth.post("/auth/refresh",null,{headers:{"x-refresh-token": refresh_token}}).then((res) => res.data),
  
  forgotPassword: (email: string): Promise<ResSimple> =>
    apiAuth.post("/auth/forgot-password", { email }).then((res) => res.data),

  changePassword: (data: ReqChangePassword ): Promise<ResSimple> =>
    apiAuth.post("/auth/change-password", data).then((res) => res.data),

  logout: (): Promise<ResSimple> => apiAuth.post("/auth/logout").then((res) => res.data),

};