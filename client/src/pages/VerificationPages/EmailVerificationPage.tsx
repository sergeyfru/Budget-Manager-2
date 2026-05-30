import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import { LogoGreeting } from "../../components/Logo/LogoGreting";
import type { AxiosError } from "axios";
import { verificationApi } from "../../api/verificationApi";
import { CheckCircle2, Mail } from "lucide-react";

interface EmailVerificationPageProps {
  // email:string
}

const EmailVerificationPage = ({}: EmailVerificationPageProps) => {
  const navigate = useNavigate();
  const email = useLocation().state?.email as string;
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isChecking, setIsChecking] = useState(false);

  const emailToShow = email ? `${email.slice(0, 3)}****${email.slice(email.indexOf("@"))}` : null;

  // Cooldown timer
  useEffect(() => {
    if (email) {
      let recheckTimer: ReturnType<typeof setTimeout>;

      recheckTimer = setInterval(handleCheckStatus, 15000);
      return () => clearInterval(recheckTimer);
    }
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleResend = async (email: string) => {
    if (!email) return;
    if (resendCooldown > 0) return;
    setResendCooldown(60);
    try {
      const response = await verificationApi.resendVerificationEmail({ email });
      if (response.status === "error") {
        toast.error(response.message);
        throw response;
      }
      toast.success(response.message || "Verification email resent successfully");
    } catch (err: AxiosError | any) {
      toast.error(
        err.response?.data?.message || err.message || "An unexpected error occurred while resending verification email",
      );
      throw err;
    }
  };
  const handleChangeEmail = () => {
    toast.info("Redirecting to change email...");
    navigate("/login");
  };

  const handleCheckStatus = async () => {
    if (!email) return;
    try {
      setIsChecking(true);

      const checkingStatus = await verificationApi.checkVerificationStatus({ email });

      if (checkingStatus.status === "error") {
        toast.error(checkingStatus.message);
        throw checkingStatus;
      }

      toast.info(checkingStatus.message);

      setIsChecking(false);
      if (checkingStatus.data.email_verified) {
        navigate("/login");
      }
    } catch (error) {
      setIsChecking(false);
      console.error("An error occurred while checking verification status");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
         
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-background to-blue-500/10 dark:from-purple-900/20 dark:via-background dark:to-blue-900/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(124,58,237,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_50%,rgba(124,58,237,0.2),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.2),transparent_50%)]" />

      <div className="w-full max-w-md relative z-10">
        <LogoGreeting title="Budget Manager" subtitle=" " />

        {/* Verification Card */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-8 sm:p-10">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <Mail className="w-10 h-10 text-primary" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-center mb-3">Verify your email</h1>

          {/* Subtitle */}
          <p className="text-center text-muted-foreground mb-6">
            We've sent a verification link to your email address. Please confirm your email to continue.
          </p>

          {/* Masked Email Display */}
          <div className="bg-muted/50 rounded-xl p-4 mb-6 text-center">
            <p className="text-sm text-muted-foreground mb-1">Email sent to</p>
            <p className="font-medium">{emailToShow}</p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            {/* // Primary: Resend  */}
            <button
              type="button"
              className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg flex items-center justify-center gap-2"
              disabled={!email || resendCooldown > 0}
              onClick={() => handleResend(email)}
              // disabled={isSubmitting}
            >
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend verification email"}
            </button>

            {/* Helper text for cooldown */}
            {resendCooldown > 0 && (
              <p className="text-xs text-center text-muted-foreground">Please wait before requesting another email</p>
            )}

            {/* Secondary: Change Email */}
            <button
              type="button"
              className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg flex items-center justify-center gap-2"
              onClick={handleChangeEmail}
            >
              Change email address
            </button>

            {/* Check Status */}
            <button
              type="button"
              className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg flex items-center justify-center gap-2"
              onClick={handleCheckStatus}
              disabled={!email || isChecking}
            >
              {isChecking ? (
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : (
                <CheckCircle2 />
              )}
              Check verification status
            </button>
          </div>

          {/* Logout Link */}
          {/* <div className="mt-8 pt-6 border-t border-border text-center">
            <button
              onClick={handleLogout}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Log out
            </button>
          </div> */}
        </div>

        {/* Additional Help */}
        <p className="text-sm text-center text-muted-foreground mt-6">
          Didn't receive an email? Check your spam folder or try resending.
        </p>
      </div>
     </div>
  );
};

export default EmailVerificationPage;
