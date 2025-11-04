type StatsCardProps = {
  title: string;
  value: number;
  className?: string;
};

export const StatsCard = ({ title, value, className = '' }: StatsCardProps) => {
  return (
    <div className={`bg-[#63461E] text-white rounded-lg p-3 text-center ${className}`}>
      <div className="text-lg font-bold">{value}</div>
      <div className="text-xs">{title}</div>
    </div>
  );
};
