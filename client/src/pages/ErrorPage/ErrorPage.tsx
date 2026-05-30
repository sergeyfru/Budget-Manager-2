import { useNavigate, useRouteError } from "react-router";
import { AlertCircle } from "lucide-react";
import { LogoGreeting } from "../../components/Logo/LogoGreting";

interface ErrorPageProps {
  code?: string;
  title?: string;
  message?: string;
}

export const ErrorPage = ({ code, title, message }: ErrorPageProps) => {
  const navigate = useNavigate();
  const error = useRouteError() as { status?: number; statusText?: string; message?: string };

  // Determine error details
  const errorCode = code || error?.status?.toString() || "500";
  const errorTitle = title || (errorCode === "404" ? "Page Not Found" : "Something Went Wrong");
  const errorMessage = message || error?.statusText || error?.message || "An unexpected error occurred";

  return (
    // <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
    <>
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-background to-blue-500/10 dark:from-purple-900/20 dark:via-background dark:to-blue-900/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(124,58,237,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_50%,rgba(124,58,237,0.2),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.2),transparent_50%)]" />

      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center relative z-10">
          {/* Logo */}

          <LogoGreeting title="Budget Manager" subtitle="" />

          {/* Error Card */}
          <div className="bg-card rounded-2xl border border-border shadow-sm p-8 sm:p-10">
            {/* Error Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-destructive" />
              </div>
            </div>

            {/* Error Code */}
            <div className="mb-4">
              <h1 className="text-6xl sm:text-7xl mb-2 text-muted-foreground">{errorCode}</h1>
            </div>

            {/* Error Title */}
            <h2 className="mb-3">{errorTitle}</h2>

            {/* Error Message */}
            <p className="text-muted-foreground mb-8">{errorMessage}</p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate("/")}
                className="flex-1 h-12 rounded-xl border border-border bg-card text-foreground hover:bg-muted transition-colors"
                >
                Go Home
              </button>
              <button
                // variant="outline"
                onClick={() => navigate(-1)}
                className="flex flex-1 items-center justify-center gap-2 h-12 rounded-xl bg-primary/80 text-primary-foreground hover:opacity-70 transition-opacity"
              >
                Go Back
              </button>
            </div>
          </div>

          {/* Additional Help */}
          <p className="text-sm text-muted-foreground mt-6">If this problem persists, please contact support</p>
        </div>
      </div>
    </>
    // </div>
  );
};
