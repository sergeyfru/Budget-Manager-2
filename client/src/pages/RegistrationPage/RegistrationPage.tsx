import { Link, useNavigate } from "react-router";
import { AuthInput } from "../../components/Auth/AuthInput";
import { Mail, Lock, Phone } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerFormSchema } from "@shared/core";
import { useAuthStore } from "../../store/authStore";
import type { AxiosError } from "axios";
import { LogoGreeting } from "../../components/Logo/LogoGreting";
import { ShowPassword } from "../../components/Password utiles/ShowPassword";
import { StrongPassword } from "../../components/Password utiles/StrongPassword";
import { CorrectConfirmPassword } from "../../components/Password utiles/CorrectConfirmPassword";

export const RegistrationPage = () => {
  const authStore = useAuthStore();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerFormSchema),
  });

  const password = watch("password");
  const confirm_password = watch("confirm_password");

  const onSubmit = async (data: any) => {
    console.log("Submitting registration form with data:", data);

    try {
      await authStore.register(data);
      toast.success("Account created successfully!");
      navigate("/login");
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
      <div className="w-full max-w-md md:max-w-2xl relative z-10">
        {/* Logo/Brand */}
        <LogoGreeting title="Create account" subtitle="Start managing your finances today" />

        {/* Form Card */}
        <div className="bg-card/70 backdrop-blur-xl rounded-2xl shadow-xl border border-border p-6 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">   {/* First Name & Last Name */}
              <div className="space-y-2">
                <AuthInput
                  label="First Name"
                  type="text"
                  placeholder="John"
                  // icon={TrendingUp}
                  {...register("first_name")}
                  error={errors.first_name?.message}
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <AuthInput
                  label="Last Name"
                  type="text"
                  placeholder="Doe"
                  // icon={TrendingUp}
                  {...register("last_name")}
                  error={errors.last_name?.message}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">   {/* Email & Phone */}
              <div className="space-y-2">
                <AuthInput
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  icon={Mail}
                  {...register("email")}
                  error={errors.email?.message}
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <AuthInput
                  label="Phone number"
                  type="tel"
                  placeholder="(012) 345-6789"
                  icon={Phone}
                  {...register("phone_number")}
                  error={errors.phone_number?.message}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">   {/* Password & Confirm Password */}
              <div className="space-y-2">
                <AuthInput
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  children={
                    <ShowPassword
                      showPassword={showPassword}
                      toggleShowPassword={() => setShowPassword(!showPassword)}
                      disabled={isSubmitting}
                    />
                  }
                  icon={Lock}
                  {...register("password")}
                  error={errors.password?.message}
                  disabled={isSubmitting}
                />

                {/* Password Strength Indicator */}
                {password && <StrongPassword password={password} />}
              </div>
              <div className="space-y-2">
                <AuthInput
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  icon={Lock}
                  children={
                    <>
                      <CorrectConfirmPassword password={password} confirm_password={confirm_password} errors={errors} />
                      <ShowPassword
                        showPassword={showConfirmPassword}
                        toggleShowPassword={() => setShowConfirmPassword(!showConfirmPassword)}
                        disabled={isSubmitting}
                      />
                    </>
                  }
                  {...register("confirm_password")}
                  error={errors.confirm_password?.message}
                  disabled={isSubmitting}
                />
              </div>
            </div>



            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                "Create account"
              )}
            </button>

            <p className="text-xs text-center text-muted-foreground leading-relaxed">
              By signing up, you agree to our{" "}
              <button type="button" className="text-primary hover:underline">
                Terms of Service
              </button>{" "}
              and{" "}
              <button type="button" className="text-primary hover:underline">
                Privacy Policy
              </button>
            </p>
          </form>
        </div>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-purple-600 dark:text-purple-400 hover:underline transition-all">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
