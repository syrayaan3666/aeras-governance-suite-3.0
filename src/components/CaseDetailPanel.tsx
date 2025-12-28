import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Building2, Calendar, Hash, User } from 'lucide-react';
import { AcademicException, EXCEPTION_TYPE_LABELS, STATUS_LABELS, DECISION_AUTHORITY_LABELS, maskStudentId } from '@/lib/aeras-engine';
import { RiskScoreGauge } from './RiskScoreGauge';
import { SLATimer } from './SLATimer';
import { AuditTimeline } from './AuditTimeline';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CaseDetailPanelProps {
  caseData: AcademicException | null;
  onClose: () => void;
}

export function CaseDetailPanel({ caseData, onClose }: CaseDetailPanelProps) {
  if (!caseData) return null;
  
  const statusColors: Record<string, string> = {
    SYSTEM_INITIATED: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    PENDING_REVIEW: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    UNDER_EVALUATION: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    ESCALATED: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    SLA_BREACHED: 'bg-red-500/20 text-red-400 border-red-500/30',
    APPROVED: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    DENIED: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    CLOSED: 'bg-slate-500/20 text-slate-400 border-slate-500/30'
  };
  
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-y-0 right-0 w-full max-w-xl glass-heavy shadow-2xl z-50 overflow-y-auto"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 glass border-b border-border/50 p-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="font-mono text-lg font-bold text-primary">
                  {caseData.caseNumber}
                </span>
                <Badge 
                  variant="outline" 
                  className={cn('text-xs', statusColors[caseData.status])}
                >
                  {STATUS_LABELS[caseData.status]}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {EXCEPTION_TYPE_LABELS[caseData.exceptionType]}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hover:bg-muted"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="mt-4">
            <SLATimer deadline={caseData.slaDeadline} className="inline-flex" />
          </div>
        </div>
        
        {/* Content */}
        <div className="p-5 space-y-6">
          {/* Risk Score Section */}
          <motion.div 
            className="flex items-center gap-6 p-5 bg-muted/30 rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <RiskScoreGauge score={caseData.riskScore} size="lg" />
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Institutional Risk Assessment</p>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-muted-foreground">Category:</span>
                  <span className="ml-2 font-medium">{caseData.riskCategory}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Grievance Probability:</span>
                  <span className="ml-2 font-mono font-medium">{caseData.grievanceProbability}%</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Escalation Level:</span>
                  <span className="ml-2 font-mono font-medium">{caseData.escalationLevel}</span>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Case Details */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Case Details
            </h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Hash className="w-4 h-4" />
                  <span className="text-xs">Policy ID</span>
                </div>
                <p className="font-mono text-sm">{caseData.policyId}</p>
              </div>
              
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <User className="w-4 h-4" />
                  <span className="text-xs">Decision Authority</span>
                </div>
                <p className="text-sm font-medium text-primary">
                  {DECISION_AUTHORITY_LABELS[caseData.decisionAuthority]}
                </p>
              </div>
              
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Building2 className="w-4 h-4" />
                  <span className="text-xs">Department</span>
                </div>
                <p className="font-mono text-sm">{caseData.departmentCode}</p>
              </div>
              
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs">Course Section</span>
                </div>
                <p className="font-mono text-sm">{caseData.courseSectionId}</p>
              </div>
            </div>
          </motion.div>
          
          {/* System Trigger Info */}
          <motion.div
            className="p-4 bg-primary/5 border border-primary/20 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="text-sm font-semibold uppercase tracking-wider text-primary mb-3">
              System Trigger Details
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-muted-foreground">Source:</span>
                <span className="ml-2 font-mono">{caseData.systemTrigger.source}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Type:</span>
                <span className="ml-2 font-mono">{caseData.systemTrigger.triggerType}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Value:</span>
                <span className="ml-2 font-mono">{caseData.systemTrigger.triggerValue}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Automation ID:</span>
                <span className="ml-2 font-mono text-primary">{caseData.systemTrigger.automationId}</span>
              </div>
            </div>
          </motion.div>
          
          {/* Audit Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <AuditTimeline entries={caseData.auditTrail} />
          </motion.div>
        </div>
        
        {/* Footer Actions */}
        <div className="sticky bottom-0 glass border-t border-border/50 p-4 flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Close
          </Button>
          <Button className="flex-1 gap-2">
            <ExternalLink className="w-4 h-4" />
            Open in Governance Console
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
