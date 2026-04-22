// src/store/useAuthStore.ts
import { create } from "zustand";
import { authApi } from "../api/authApi";
import { toast } from "sonner";
import type {AxiosError } from "axios";
import { persist } from "zustand/middleware";
import type { ReqLogin, ReqRegister, Status, UserDB } from "@shared/core";

type AuthState = {
  user: UserDB | null;
  access_token: string | null;
  isAuth: boolean;
  authStatus: Status;
  authError: string | null;

  setToken: (token: string) => void;
  deleteToken: () => void;
  
  login: (data: ReqLogin) => Promise<void>;

  register: (data: ReqRegister) => Promise<void>;

  logout: () => Promise<void>;
  // fetchMe: () => Promise<void>;
};

export const useAuthStore = create<AuthState>()(
  persist((set, get) => ({
  user: {} as UserDB,
  access_token: null,
  isAuth: true,
  authStatus: "idle",
  authError: null,

  setToken: (token: string) => {
    console.log("Setting token: ", token);
    localStorage.setItem("access_token", token);
    set({ access_token: token })
  },

  deleteToken: () => {
    localStorage.removeItem("access_token");
    set({ access_token: null, isAuth: false, user: null });

  },

  login: async (authdata: ReqLogin) => {
    set({ authStatus: "loading", authError: null });
    try {
      const response = await authApi.login(authdata);

      if (response.status === "error") {
        set({ authStatus: "error", authError: response.message });
        toast.error(response.message);
        return;
      }
      console.log(response);
      
      toast.success("Login successful");
      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("refresh_token", response.data.refresh_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      set({ user: response.data.user, access_token: response.data.access_token, isAuth: true , authStatus: "success"});
    } catch (err: AxiosError | any) {
      set({ authStatus: "error", authError: err.response?.data?.message || err.message || "An unexpected error occurred during login" });
      toast.error(err.response?.data?.message || err.message || "An unexpected error occurred during login");
      throw err;
    } 
  },


  register: async (data: ReqRegister) => {
    set({ authStatus: "loading", authError: null });
    try {
      const response = await authApi.register(data);
      if (response.status === "error") {
        set({ authStatus: "error", authError: response.message });
        toast.error(response.message);
        throw response;
      }
      toast.success("Account created successfully");
      set({ authStatus: "success" });
    } catch (err: AxiosError | any) {
      set({ authStatus: "error", authError: err.response?.data?.message || err.message || "An unexpected error occurred during registration" });
      toast.error(err.response?.data?.message || err.message || "An unexpected error occurred during registration");
      throw err;
    }
  },

  logout: async () => {

    await authApi.logout();
    localStorage.clear();
    set({ user: null, access_token: null, isAuth: false, authStatus: "idle" });
    toast.success("You have been logged out successfully\nPlease log in again to continue using the app");
  },

}),{
  name: "auth-storage", // name of the item in storage
  partialize: (state) => ({
    user: state.user,
    access_token: state.access_token,
    isAuth: state.isAuth,
  }),
}));
