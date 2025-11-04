type StatsCardProps = {
  title: string;
  value: number;
  className?: string;
};

export const StatsCard = ({ title, value, className = '' }: StatsCardProps) => {
  return (
    <div
      className={`bg-[#63461E] dark:bg-[#8B5A2B] text-white rounded-lg p-3 text-center transition-colors ${className}`}
    >
      <div className="text-lg font-bold">{value}</div>
      <div className="text-xs">{title}</div>
    </div>
  );
};
