
import axios from "axios";
import type { ReqLogin, ReqRegister, ResLogin, ResRegister, ResSimple } from "@shared/core";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api",
  withCredentials: true,
});


export const authApi = {
  
  login: (data: ReqLogin):Promise<ResLogin> =>
    axiosInstance.post("/auth/login", data).then((res) => { console.log(res); return res.data }),

  register: (data: ReqRegister): Promise<ResSimple> =>
    axiosInstance.post("/auth/register", data).then((res) => res.data),

  logout: (): Promise<ResSimple> => axiosInstance.post("/auth/logout").then((res) => res.data),
};