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
        <h3 className="font-semibold text-gray-900 dark:text-white transition-colors">{title}</h3>
        {subtitle && (
          <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
};
