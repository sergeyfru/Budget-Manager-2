import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuthStore } from "../../store/authStore";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import { loginFormSchema, type LoginFormValue, type ReqLogin } from "@shared/core";
import { Lock, Mail, TrendingUp } from "lucide-react";
import { AuthInput } from "../../components/Auth/AuthInput";
import { useState } from "react";
import { ShowPassword } from "../../components/Password utiles/ShowPassword";
import { Spinner } from "../../components/Loading/Spiner";

export const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const authStore = useAuthStore();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValue>({
    resolver: zodResolver(loginFormSchema),
  });

  const onSubmit = async (data: ReqLogin) => {
    // console.log("Submitting login form with data:", data);

    try {
      await authStore.login(data);
      navigate("/");
    } catch (err: any) {
      const data = (err as AxiosError)?.response?.data || err;
      if (data?.errors) {
        data.errors.forEach((e: any) => {
          console.log(e.field, { message: e.message });

          setError(e.field, { message: `${e.message}` });
        });
        return;
      }
      if (data?.message) {
        toast.error(data.message);
        return;
      }
      toast.error("An unexpected error occurred");
      console.error("Login error:", data);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-background to-blue-500/10 dark:from-purple-900/20 dark:via-background dark:to-blue-900/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(124,58,237,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_50%,rgba(124,58,237,0.2),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.2),transparent_50%)]" />

      {/* Auth Card */}
      <div className="w-full max-w-md relative z-10">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 shadow-lg mb-4">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h1 className="mb-2">Welcome back</h1>
          <p className="text-muted-foreground">Sign in to continue to your account</p>
        </div>

        {/* Form Card */}
        <div className="bg-card/70 backdrop-blur-xl rounded-2xl shadow-xl border border-border p-6 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <AuthInput
              label="Email"
              type="email"
              placeholder="you@example.com"
              icon={Mail}
              value={"email" in errors ? "" : undefined}
              {...register("email")}
              error={errors.email?.message}
              disabled={isSubmitting}
            />

            <AuthInput
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              icon={Lock}
              children={
                <ShowPassword
                  showPassword={showPassword}
                  toggleShowPassword={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting}
                />
              }
              {...register("password")}
              error={errors.password?.message}
              disabled={isSubmitting}
            />

            <div className="flex items-center justify-end">
              <button
                type="button"
                className="text-sm text-primary hover:underline transition-all"
                onClick={() => toast.info("Password reset coming soon!")}
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Spinner />
                  <span>Signing in...</span>
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>
        </div>

        {/* Sign Up Link */}
        <div className="text-center mt-6">
          <p className="text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="text-purple-600 dark:text-purple-400 hover:underline transition-all">
              Sign up
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};
