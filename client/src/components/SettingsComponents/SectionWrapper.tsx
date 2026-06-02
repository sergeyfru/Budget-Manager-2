interface SectionWrapperProps {
  title: string;
  children: React.ReactNode;
}
export const SectionWrapper = ({ title, children }: SectionWrapperProps) => {
  return (
    <div className="px-4 sm:px-6 lg:px-8 xl:px-10 py-6 max-w-2xl space-y-6">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-1">{title}</h3>
      <div className="bg-card rounded-2xl border border-border shadow-sm divide-y divide-border">
        {children}
      </div>
    </div>
  );
};
