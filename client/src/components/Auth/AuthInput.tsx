import type { LucideIcon } from 'lucide-react';
import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: LucideIcon;
  error?: string;
  children?: ReactNode;
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, icon: Icon, error, className = '', children, ...props }, ref) => {

    const generatedId = useId();
  return (
    <>
      <label className="block text-sm" htmlFor={generatedId}>{label}</label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <input
        ref={ref}
          id={generatedId}
          className={`w-full ${Icon ? 'pl-12' : 'pl-4'} pr-4 py-3.5 bg-muted rounded-xl border-2 transition-all
            ${error 
              ? 'border-destructive focus:border-destructive' 
              : 'border-transparent focus:border-primary focus:bg-card'
            }
            placeholder:text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed
            ${className}`}
          {...props}
        />
         {/* right side slot (children) */}
          {children && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
              {children}
            </div>
          )}
      </div>
      {error && (
        <p className="text-sm text-destructive flex items-center gap-1.5">
          <span className="inline-block w-1 h-1 rounded-full bg-destructive" />
          {error}
        </p>
      )}
    </>
  );
});

AuthInput.displayName = 'AuthInput';