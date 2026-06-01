interface SectionWrapperProps {
  title: string;
  children: React.ReactNode;
}
export const SectionWrapper = ({ title, children }: SectionWrapperProps) => {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-1">{title}</h3>
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden divide-y divide-border">
        {children}
      </div>
    </div>
  );
};
