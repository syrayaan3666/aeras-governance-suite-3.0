import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  AlertTriangle, 
  Users,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { patternData } from '@/lib/mock-data';
import { Progress } from '@/components/ui/progress';

export function PatternDetection() {
  return (
    <div className="space-y-4">
      {/* Repeat Exception Hotspots */}
      <motion.div
        className="glass rounded-xl p-5"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-orange-400" />
          <h3 className="font-semibold text-sm uppercase tracking-wider">
            Repeat Exception Hotspots
          </h3>
        </div>
        
        <div className="space-y-3">
          {patternData.repeatExceptionHotspots.map((item, index) => (
            <motion.div
              key={item.department}
              className="flex items-center justify-between"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-medium w-12">
                  {item.department}
                </span>
                <div className="w-24">
                  <Progress 
                    value={(item.count / 15) * 100} 
                    className="h-2 bg-muted"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono">{item.count}</span>
                <span className={cn(
                  'text-xs px-2 py-0.5 rounded',
                  item.trend === 'increasing' && 'bg-red-500/20 text-red-400',
                  item.trend === 'stable' && 'bg-amber-500/20 text-amber-400',
                  item.trend === 'decreasing' && 'bg-emerald-500/20 text-emerald-400'
                )}>
                  {item.trend === 'increasing' ? '↑' : item.trend === 'decreasing' ? '↓' : '→'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
      
      {/* Decision Bias Indicators */}
      <motion.div
        className="glass rounded-xl p-5"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-amber-400" />
          <h3 className="font-semibold text-sm uppercase tracking-wider">
            Decision Bias Indicators
          </h3>
        </div>
        
        <div className="space-y-3">
          {patternData.decisionBiasIndicators.map((item, index) => (
            <motion.div
              key={item.authority}
              className="p-3 bg-muted/30 rounded-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">
                  {item.authority.replace(/_/g, ' ')}
                </span>
                {item.flag === 'HIGH_APPROVAL' && (
                  <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Review Recommended
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Approval Rate: <span className="font-mono text-foreground">{(item.approvalRate * 100).toFixed(0)}%</span></span>
                <span>Cases: <span className="font-mono text-foreground">{item.cases}</span></span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
      
      {/* SLA Performance */}
      <motion.div
        className="glass rounded-xl p-5"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-sm uppercase tracking-wider">
            SLA Performance
          </h3>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          <motion.div 
            className="text-center p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <p className="text-2xl font-bold font-mono text-emerald-400">
              {patternData.slaPerformance.met}
            </p>
            <p className="text-xs text-muted-foreground mt-1">SLA Met</p>
          </motion.div>
          
          <motion.div 
            className="text-center p-3 bg-amber-500/10 rounded-lg border border-amber-500/20"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p className="text-2xl font-bold font-mono text-amber-400">
              {patternData.slaPerformance.atRisk}
            </p>
            <p className="text-xs text-muted-foreground mt-1">At Risk</p>
          </motion.div>
          
          <motion.div 
            className="text-center p-3 bg-red-500/10 rounded-lg border border-red-500/20"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <p className="text-2xl font-bold font-mono text-red-400">
              {patternData.slaPerformance.breached}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Breached</p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
