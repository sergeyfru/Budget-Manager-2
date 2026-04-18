import { Spinner } from "./Spiner";

type LoaderProps = {
  loading: boolean;
  children: React.ReactNode;

  // modes
  overlay?: boolean;      // перекрыть контент
  center?: boolean;       // центрировать

  // spinner props
  size?: number;
  color?: string;

  className?: string;
};

export function Loader({
  loading,
  children,
  overlay = false,
  center = false,
  size,
  color,
  className = "",
}: LoaderProps) {
  if (!loading) return <>{children}</>;

  const spinner = <Spinner size={size} color={color} />;

  // 🔹 overlay режим (блок/страница)
  if (overlay) {
    return (
      <div className={`relative ${className}`}>
        {children}

        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          {spinner}
        </div>
      </div>
    );
  }

  // 🔹 центрированный loader вместо контента
  if (center) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        {spinner}
      </div>
    );
  }

  // 🔹 inline (например внутри кнопки)
  return spinner;
}