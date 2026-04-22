


export const StrongPassword = ( {password}: {password: string} ) => {

const getPasswordStrength = (password: string) => {
    if (!password) return null;
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) return { label: "Weak", color: "bg-red-500", width: "33%" };
    if (strength <= 3) return { label: "Fair", color: "bg-yellow-500", width: "66%" };
    return { label: "Strong", color: "bg-green-500", width: "100%" };
  };

const passwordStrength = getPasswordStrength(password);
if (!passwordStrength) return null;

    return(
        <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Password strength</span>
                    <span
                      className={`font-medium ${
                        passwordStrength.label === "Strong"
                          ? "text-green-600 dark:text-green-400"
                          : passwordStrength.label === "Fair"
                            ? "text-yellow-600 dark:text-yellow-400"
                            : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${passwordStrength.color} transition-all duration-300`}
                      style={{ width: passwordStrength.width }}
                    />
                  </div>
                </div>
    );
    
}
