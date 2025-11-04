type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
};

export const SectionHeader = ({ title, subtitle, actions, className = '' }: SectionHeaderProps) => {
  return (
    <div className={`flex items-center justify-between mb-2 ${className}`}>
      <div>
        <h3 className="font-semibold">{title}</h3>
        {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
};
