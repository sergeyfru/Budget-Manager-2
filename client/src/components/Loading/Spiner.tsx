type SpinnerProps = {
  size?: number;          // px
  color?: string;         // tailwind color class
  className?: string;
};

export function Spinner({
  size = 20,
  color = "border-blue-500",
  className = "",
}: SpinnerProps) {
  return (
    <div
      className={`inline-block rounded-full border-2 border-white/30 border-t-white animate-spin ${color} ${className}`}

      style={{ width: size, height: size }}
    />
  );
}