import { Link, useNavigate, useSearchParams } from "react-router";
import { Spinner } from "../../components/Loading/Spiner";
import { LogoGreeting } from "../../components/Logo/LogoGreting";
import { AuthInput } from "../../components/Auth/AuthInput";

import { reqResetPasswordSchema, type ReqResetPassword } from "@shared/core";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { authApi } from "../../api/authApi";
import { toast } from "sonner";
import { Lock } from "lucide-react";

export const ResetPasswordPage = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ReqResetPassword>({
    resolver: zodResolver(reqResetPasswordSchema),
  });

  const onSubmit = async (data: ReqResetPassword) => {
    try {
      const response = await authApi.resetPassword({ ...data }, token);
      toast.success(response.message);
      navigate("/login");
    } catch (err: any) {
      console.error("Forgot password error:", err);
      toast.error(err?.response?.data?.message || "An unexpected error occurred");
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
        <LogoGreeting title="Reset your password" subtitle="Create a new password for your account." />

        {/* Form Card */}
        <div className="bg-card/70 backdrop-blur-xl rounded-2xl shadow-xl border border-border p-6 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <AuthInput
              label="Password"
              type="password"
              placeholder="Enter your password"
              icon={Lock}
              value={"new_password" in errors ? "" : undefined}
              {...register("new_password")}
              error={errors.new_password?.message}
              disabled={isSubmitting}
            />
            <AuthInput
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              icon={Lock}
              value={"confirm_new_password" in errors ? "" : undefined}
              {...register("confirm_new_password")}
              error={errors.confirm_new_password?.message}
              disabled={isSubmitting}
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Spinner />
                  <span>Sending email...</span>
                </>
              ) : (
                "Send Email"
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
