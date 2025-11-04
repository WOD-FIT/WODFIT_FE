import { StatsCard } from '../cards/StatsCard';

type Stat = {
  title: string;
  value: number;
};

type StatsGridProps = {
  stats: Stat[];
  className?: string;
};

export const StatsGrid = ({ stats, className = '' }: StatsGridProps) => {
  return (
    <div className={`grid grid-cols-3 gap-3 ${className}`}>
      {stats.map((stat, index) => (
        <StatsCard key={index} title={stat.title} value={stat.value} />
      ))}
    </div>
  );
};
