
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  className?: string;
}

export function StatCard({ title, value, icon, trend, className }: StatCardProps) {
  return (
    <div className={cn(
      "flex flex-col rounded-xl border bg-card p-6 shadow-sm transition-all duration-300 hover-lift",
      className
    )}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          {icon}
        </div>
      </div>
      <div className="mt-3 flex items-end justify-between">
        <h3 className="text-3xl font-bold">{value}</h3>
        {trend && (
          <div className={cn(
            "flex items-center text-sm",
            trend.direction === 'up' ? 'text-green-500' : 'text-red-500'
          )}>
            <span>{trend.direction === 'up' ? '↑' : '↓'}</span>
            <span className="ml-1">{trend.value}%</span>
          </div>
        )}
      </div>
    </div>
  );
}
