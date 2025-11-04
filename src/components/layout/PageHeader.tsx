type PageHeaderProps = {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
};

export const PageHeader = ({ title, subtitle, actions, className = '' }: PageHeaderProps) => {
  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white transition-colors">{title}</h2>
        {subtitle && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 transition-colors">
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
};
