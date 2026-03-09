import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatusCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  variant?: 'default' | 'success' | 'warning' | 'danger';
  className?: string;
}

export function StatusCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
  className,
}: StatusCardProps) {
  const variantConfig = {
    default: { border: 'border-border/40', bg: '', icon: 'text-primary bg-primary/10', value: 'text-foreground' },
    success: { border: 'border-success/20', bg: 'bg-success/[0.03]', icon: 'text-success bg-success/10', value: 'text-success' },
    warning: { border: 'border-warning/20', bg: 'bg-warning/[0.03]', icon: 'text-warning bg-warning/10', value: 'text-warning' },
    danger: { border: 'border-destructive/20', bg: 'bg-destructive/[0.03]', icon: 'text-destructive bg-destructive/10', value: 'text-destructive' },
  };

  const v = variantConfig[variant];

  return (
    <div
      className={cn(
        "glass-card rounded-xl p-4 animate-slide-up group hover:border-primary/20 transition-all duration-300",
        v.border, v.bg,
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1.5 min-w-0">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider truncate">{title}</p>
          <p className={cn("text-xl font-semibold font-mono tracking-tight", v.value)}>
            {value}
          </p>
          {subtitle && (
            <p className="text-[10px] text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className={cn("p-2 rounded-lg shrink-0", v.icon)}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      {trend && (
        <div className="mt-2 flex items-center gap-1">
          <span className={cn(
            "text-[10px] font-medium",
            trend === 'up' && "text-success",
            trend === 'down' && "text-destructive",
            trend === 'neutral' && "text-muted-foreground"
          )}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
          </span>
        </div>
      )}
    </div>
  );
}
