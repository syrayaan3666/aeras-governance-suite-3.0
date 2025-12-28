import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { getRiskLevel } from '@/lib/aeras-engine';

interface RiskScoreGaugeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function RiskScoreGauge({ score, size = 'md', showLabel = true, className }: RiskScoreGaugeProps) {
  const riskLevel = getRiskLevel(score);
  
  const sizeClasses = {
    sm: 'w-12 h-12 text-xs',
    md: 'w-16 h-16 text-sm',
    lg: 'w-24 h-24 text-lg'
  };
  
  const strokeWidths = {
    sm: 3,
    md: 4,
    lg: 5
  };
  
  const riskColors = {
    critical: '#ef4444',
    high: '#f97316',
    medium: '#eab308',
    low: '#22c55e',
    minimal: '#06b6d4'
  };
  
  const riskGlowColors = {
    critical: 'shadow-red-500/30',
    high: 'shadow-orange-500/30',
    medium: 'shadow-amber-500/30',
    low: 'shadow-emerald-500/30',
    minimal: 'shadow-cyan-500/30'
  };
  
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  return (
    <div className={cn('relative flex flex-col items-center', className)}>
      <div className={cn(
        sizeClasses[size],
        'relative rounded-full shadow-lg',
        riskGlowColors[riskLevel]
      )}>
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="hsl(217 33% 17%)"
            strokeWidth={strokeWidths[size]}
          />
          {/* Animated progress circle */}
          <motion.circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke={riskColors[riskLevel]}
            strokeWidth={strokeWidths[size]}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
          />
        </svg>
        {/* Score display */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center font-semibold font-mono"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.3 }}
          style={{ color: riskColors[riskLevel] }}
        >
          {score}
        </motion.div>
      </div>
      {showLabel && (
        <motion.span 
          className={cn(
            'mt-1 text-xs font-medium uppercase tracking-wider',
            riskLevel === 'critical' && 'text-red-400',
            riskLevel === 'high' && 'text-orange-400',
            riskLevel === 'medium' && 'text-amber-400',
            riskLevel === 'low' && 'text-emerald-400',
            riskLevel === 'minimal' && 'text-cyan-400'
          )}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.3 }}
        >
          {riskLevel}
        </motion.span>
      )}
    </div>
  );
}
