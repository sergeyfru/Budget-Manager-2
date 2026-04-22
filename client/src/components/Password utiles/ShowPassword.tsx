import { Eye, EyeOff } from "lucide-react";

export const ShowPassword = ({ showPassword, toggleShowPassword, disabled }: { showPassword: boolean; toggleShowPassword: () => void; disabled?: boolean }) => {
    return (
        <button
                  type="button"
                  onClick={toggleShowPassword}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  disabled={disabled}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
    )
}