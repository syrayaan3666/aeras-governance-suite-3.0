import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  variant?: 'default' | 'warning' | 'danger' | 'success';
  delay?: number;
  className?: string;
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  variant = 'default',
  delay = 0,
  className
}: MetricCardProps) {
  const variantStyles = {
    default: {
      border: 'border-border/50 hover:border-primary/30',
      icon: 'text-primary bg-primary/10',
      glow: 'hover:shadow-primary/5'
    },
    warning: {
      border: 'border-amber-500/30 hover:border-amber-500/50',
      icon: 'text-amber-400 bg-amber-500/10',
      glow: 'hover:shadow-amber-500/10'
    },
    danger: {
      border: 'border-red-500/30 hover:border-red-500/50',
      icon: 'text-red-400 bg-red-500/10',
      glow: 'hover:shadow-red-500/10'
    },
    success: {
      border: 'border-emerald-500/30 hover:border-emerald-500/50',
      icon: 'text-emerald-400 bg-emerald-500/10',
      glow: 'hover:shadow-emerald-500/10'
    }
  };
  
  const styles = variantStyles[variant];
  
  return (
    <motion.div
      className={cn(
        'metric-card border transition-all duration-300 shadow-lg',
        styles.border,
        styles.glow,
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            {title}
          </p>
          <motion.p 
            className="text-3xl font-bold font-mono"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.3, duration: 0.5 }}
          >
            {value}
          </motion.p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className={cn('p-3 rounded-lg', styles.icon)}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      
      {trend && trendValue && (
        <motion.div 
          className="mt-4 flex items-center gap-2 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.5 }}
        >
          <span className={cn(
            'font-medium',
            trend === 'up' && variant === 'danger' && 'text-red-400',
            trend === 'up' && variant !== 'danger' && 'text-emerald-400',
            trend === 'down' && variant === 'danger' && 'text-emerald-400',
            trend === 'down' && variant !== 'danger' && 'text-red-400',
            trend === 'stable' && 'text-muted-foreground'
          )}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
          </span>
          <span className="text-muted-foreground">vs last period</span>
        </motion.div>
      )}
    </motion.div>
  );
}
