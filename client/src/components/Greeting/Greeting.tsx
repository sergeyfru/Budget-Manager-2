
// import { useAuthStore } from "../../store/useAuthStore";

export const Greeting = ({ title, subtitle }: { title: string; subtitle: string }) => {

  return (
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-4 sm:px-6 lg:px-8 xl:px-12 py-6 lg:py-8">
          <h1 className="mb-2">{title}</h1>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>
      </div>
  );
};
