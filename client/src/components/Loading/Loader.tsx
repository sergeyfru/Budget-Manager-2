import { Spinner } from "./Spiner";

type LoaderProps = {
  loading: boolean;
  children: React.ReactNode;

  // modes
  overlay?: boolean;      
  center?: boolean;       

  // spinner props
  size?: number;

  className?: string;
};

export function Loader({
  loading,
  children,
  overlay = false,
  center = false,
  size,
  className = "",
}: LoaderProps) {
  if (!loading) return <>{children}</>;

  const spinner = <Spinner size={size} />;

  // 🔹 overlay 
  if (overlay) {
    return (
      <div className={`relative ${className}`}>
        {children}

        <div 
          className="absolute inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm">
          {spinner}
        </div>
      </div>
    );
  }

  // 🔹 center 
  if (center) {
    return (
      <div className="flex items-center justify-center w-full h-full min-h-[80px]">
        {spinner}
      </div>
    );
  }
}