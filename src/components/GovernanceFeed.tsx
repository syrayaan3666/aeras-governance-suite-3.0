import { motion } from 'framer-motion';
import { 
  FileWarning, 
  Clock, 
  ArrowUpRight, 
  RefreshCw,
  AlertOctagon,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { governanceFeed } from '@/lib/mock-data';

const feedTypeConfig: Record<string, { icon: typeof FileWarning; color: string; bgColor: string }> = {
  CASE_CREATED: { 
    icon: FileWarning, 
    color: 'text-primary', 
    bgColor: 'bg-primary/10' 
  },
  SLA_WARNING: { 
    icon: Clock, 
    color: 'text-amber-400', 
    bgColor: 'bg-amber-500/10' 
  },
  ESCALATION: { 
    icon: ArrowUpRight, 
    color: 'text-orange-400', 
    bgColor: 'bg-orange-500/10' 
  },
  RISK_RECALCULATED: { 
    icon: RefreshCw, 
    color: 'text-cyan-400', 
    bgColor: 'bg-cyan-500/10' 
  },
  SLA_BREACH: { 
    icon: AlertOctagon, 
    color: 'text-red-400', 
    bgColor: 'bg-red-500/10' 
  }
};

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
}

export function GovernanceFeed() {
  return (
    <motion.div
      className="glass rounded-xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="p-4 border-b border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-sm uppercase tracking-wider">
            System Governance Feed
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="status-dot status-dot-active" />
          <span className="text-xs text-muted-foreground">Live</span>
        </div>
      </div>
      
      <div className="divide-y divide-border/30">
        {governanceFeed.map((item, index) => {
          const config = feedTypeConfig[item.type] || feedTypeConfig.CASE_CREATED;
          const Icon = config.icon;
          
          return (
            <motion.div
              key={item.id}
              className="p-4 hover:bg-muted/30 transition-colors cursor-pointer feed-item"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
            >
              <div className="flex items-start gap-3">
                <div className={cn('p-2 rounded-lg', config.bgColor)}>
                  <Icon className={cn('w-4 h-4', config.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    'text-sm leading-relaxed',
                    item.type === 'SLA_BREACH' && 'text-red-400 font-medium'
                  )}>
                    {item.message}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-muted-foreground">
                      {formatTimeAgo(item.timestamp)}
                    </span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs font-mono text-muted-foreground">
                      {item.source}
                    </span>
                    {item.caseNumber && (
                      <>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs font-mono text-primary">
                          {item.caseNumber}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
