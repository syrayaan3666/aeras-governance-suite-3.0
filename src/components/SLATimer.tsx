import { motion } from 'framer-motion';
import { Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getSLATimeRemaining } from '@/lib/aeras-engine';
import { useEffect, useState } from 'react';

interface SLATimerProps {
  deadline: Date;
  className?: string;
}

export function SLATimer({ deadline, className }: SLATimerProps) {
  const [timeData, setTimeData] = useState(getSLATimeRemaining(deadline));
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeData(getSLATimeRemaining(deadline));
    }, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [deadline]);
  
  const { hours, minutes, isBreached, isWarning } = timeData;
  
  if (isBreached) {
    return (
      <motion.div 
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-md sla-breached',
          className
        )}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <AlertTriangle className="w-4 h-4" />
        <span className="font-mono text-sm font-semibold">SLA BREACHED</span>
      </motion.div>
    );
  }
  
  return (
    <motion.div 
      className={cn(
        'flex items-center gap-2 px-3 py-1.5 rounded-md',
        isWarning 
          ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400' 
          : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400',
        isWarning && 'animate-pulse',
        className
      )}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
    >
      {isWarning ? (
        <Clock className="w-4 h-4" />
      ) : (
        <CheckCircle className="w-4 h-4" />
      )}
      <span className="font-mono text-sm font-medium">
        {hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}
        <span className="text-xs ml-1 opacity-70">remaining</span>
      </span>
    </motion.div>
  );
}
