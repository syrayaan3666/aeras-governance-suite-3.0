import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  FileText,
  Shield,
  ArrowUpRight,
  Scale
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { GovernanceLogEntry, GovernanceEventType } from '@/lib/aeras-engine';

interface AuditTimelineProps {
  entries: GovernanceLogEntry[];
  className?: string;
}

const eventConfig: Record<GovernanceEventType, { 
  icon: typeof CheckCircle2; 
  color: string; 
  bgColor: string;
  lineColor: string;
}> = {
  CASE_CREATED: { 
    icon: FileText, 
    color: 'text-primary', 
    bgColor: 'bg-primary/10',
    lineColor: 'bg-primary/50'
  },
  STATUS_CHANGE: { 
    icon: Clock, 
    color: 'text-blue-400', 
    bgColor: 'bg-blue-500/10',
    lineColor: 'bg-blue-500/50'
  },
  ESCALATION: { 
    icon: ArrowUpRight, 
    color: 'text-orange-400', 
    bgColor: 'bg-orange-500/10',
    lineColor: 'bg-orange-500/50'
  },
  SLA_WARNING: { 
    icon: Clock, 
    color: 'text-amber-400', 
    bgColor: 'bg-amber-500/10',
    lineColor: 'bg-amber-500/50'
  },
  SLA_BREACH: { 
    icon: AlertTriangle, 
    color: 'text-red-400', 
    bgColor: 'bg-red-500/10',
    lineColor: 'bg-red-500/50'
  },
  DECISION_MADE: { 
    icon: Scale, 
    color: 'text-emerald-400', 
    bgColor: 'bg-emerald-500/10',
    lineColor: 'bg-emerald-500/50'
  },
  POLICY_APPLIED: { 
    icon: Shield, 
    color: 'text-cyan-400', 
    bgColor: 'bg-cyan-500/10',
    lineColor: 'bg-cyan-500/50'
  },
  RISK_RECALCULATED: { 
    icon: CheckCircle2, 
    color: 'text-purple-400', 
    bgColor: 'bg-purple-500/10',
    lineColor: 'bg-purple-500/50'
  }
};

function formatTimestamp(date: Date): string {
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function AuditTimeline({ entries, className }: AuditTimelineProps) {
  return (
    <div className={cn('relative', className)}>
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-sm uppercase tracking-wider">
          Governance Audit Trail
        </h3>
        <span className="ml-auto text-xs px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          Accreditation Ready
        </span>
      </div>
      
      <div className="space-y-0">
        {entries.map((entry, index) => {
          const config = eventConfig[entry.eventType];
          const Icon = config.icon;
          const isLast = index === entries.length - 1;
          
          return (
            <motion.div
              key={entry.id}
              className="relative flex gap-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              {/* Timeline line */}
              {!isLast && (
                <div className={cn(
                  'absolute left-[19px] top-10 w-0.5 h-[calc(100%-16px)]',
                  config.lineColor
                )} />
              )}
              
              {/* Icon */}
              <div className={cn(
                'relative z-10 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
                config.bgColor
              )}>
                <Icon className={cn('w-5 h-5', config.color)} />
              </div>
              
              {/* Content */}
              <div className="flex-1 pb-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className={cn(
                      'font-medium text-sm',
                      entry.eventType === 'SLA_BREACH' && 'text-red-400'
                    )}>
                      {entry.action}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {entry.details}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-mono text-muted-foreground">
                      {formatTimestamp(entry.timestamp)}
                    </p>
                    {entry.immutable && (
                      <span className="text-xs text-primary mt-1 flex items-center justify-end gap-1">
                        <Shield className="w-3 h-3" />
                        Immutable
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground font-mono">
                    {entry.actor}
                  </span>
                  {entry.policyReference && (
                    <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary font-mono">
                      {entry.policyReference}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
