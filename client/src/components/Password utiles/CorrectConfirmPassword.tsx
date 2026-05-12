import { CheckCircle2 } from "lucide-react";

export const CorrectConfirmPassword = ({
  password,
  confirm_password,
  errors,
}: {
  password: string;
  confirm_password: string;
  errors: any;
}) => {
  if (!password || !confirm_password || errors.confirm_password || password !== confirm_password) return null;
  return (
    <div className="absolute right-12 top-1/2 -translate-y-1/2 text-success-foreground dark:text-success-foreground">
      <CheckCircle2 className="w-5 h-5" />
    </div>
  );
};
