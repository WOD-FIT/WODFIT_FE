type PageContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export const PageContainer = ({ children, className = '' }: PageContainerProps) => {
  return <div className={`px-4 py-4 w-full ${className}`}>{children}</div>;
};
