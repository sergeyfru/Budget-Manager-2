
interface SpinnerProps {
  size?: number;
  className?: string;
};

export const  Spinner = ({
  size = 20,
  className = "",
}: SpinnerProps) => {
  return (
    <div
      className={`
        inline-block rounded-full border-2 animate-spin
        border-muted border-t-foreground
        ${className}
      `}
      style={{ width: size, height: size }}
    />
  );
}
