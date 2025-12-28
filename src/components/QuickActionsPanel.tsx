import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  XCircle, 
  ArrowUpCircle, 
  MessageSquare,
  FileText,
  Send,
  Shield,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AcademicException, STATUS_LABELS, DECISION_AUTHORITY_LABELS } from '@/lib/aeras-engine';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface QuickActionsPanelProps {
  caseData: AcademicException | null;
  onAction?: (action: string, caseId: string, notes?: string) => void;
}

export function QuickActionsPanel({ caseData, onAction }: QuickActionsPanelProps) {
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAction = async (action: string) => {
    if (!caseData) return;
    
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    onAction?.(action, caseData.id, notes);
    
    const actionLabels: Record<string, string> = {
      approve: 'Approved',
      deny: 'Denied',
      escalate: 'Escalated',
      request_info: 'Information Requested'
    };
    
    toast.success(`Case ${caseData.caseNumber} ${actionLabels[action]}`, {
      description: 'Governance log entry created automatically'
    });
    
    setNotes('');
    setIsSubmitting(false);
  };

  if (!caseData) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-full bg-muted/30 mb-4"
        >
          <Shield className="w-8 h-8 text-muted-foreground" />
        </motion.div>
        <p className="text-sm text-muted-foreground">
          Select a case to view quick actions
        </p>
      </div>
    );
  }

  const isClosed = ['APPROVED', 'DENIED', 'CLOSED'].includes(caseData.status);

  return (
    <motion.div
      className="h-full flex flex-col"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      key={caseData.id}
    >
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">
          Quick Actions
        </h3>
        <div className="flex items-center gap-2 mb-2">
          <span className="font-mono text-primary font-medium">
            {caseData.caseNumber}
          </span>
          {caseData.slaBreach && (
            <span className="flex items-center gap-1 px-2 py-0.5 bg-red-500/20 text-red-400 rounded text-xs">
              <AlertTriangle className="w-3 h-3" />
              SLA BREACHED
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Status: {STATUS_LABELS[caseData.status]}
        </p>
      </div>

      {/* Actions */}
      <div className="p-4 space-y-3 flex-1">
        {!isClosed ? (
          <>
            {/* Primary Actions */}
            <div className="grid grid-cols-2 gap-2">
              <Button 
                onClick={() => handleAction('approve')}
                disabled={isSubmitting}
                className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Approve
              </Button>
              
              <Button 
                onClick={() => handleAction('deny')}
                disabled={isSubmitting}
                variant="destructive"
                className="gap-2"
              >
                <XCircle className="w-4 h-4" />
                Deny
              </Button>
            </div>

            {/* Secondary Actions */}
            <div className="grid grid-cols-2 gap-2">
              <Button 
                onClick={() => handleAction('escalate')}
                disabled={isSubmitting}
                variant="outline"
                className="gap-2 border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
              >
                <ArrowUpCircle className="w-4 h-4" />
                Escalate
              </Button>
              
              <Button 
                onClick={() => handleAction('request_info')}
                disabled={isSubmitting}
                variant="outline"
                className="gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Request Info
              </Button>
            </div>

            {/* Governance Notes */}
            <div className="pt-4 border-t border-border/50">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
                Governance Notes
              </label>
              <Textarea
                placeholder="Enter decision rationale for audit trail..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="bg-muted/30 border-border/50 text-sm min-h-[100px] resize-none"
              />
              <p className="text-[10px] text-muted-foreground mt-2">
                Notes will be logged to immutable governance record
              </p>
            </div>

            {/* Routing Info */}
            <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg mt-4">
              <div className="flex items-center gap-2 mb-2">
                <Send className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium text-primary">Routing</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Assigned to: <span className="text-foreground font-medium">
                  {DECISION_AUTHORITY_LABELS[caseData.decisionAuthority]}
                </span>
              </p>
              {caseData.escalationLevel > 1 && (
                <p className="text-xs text-amber-400 mt-1">
                  Escalation Level: {caseData.escalationLevel}
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="p-3 rounded-full bg-muted/30 mb-3">
              <FileText className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              Case is {caseData.status.toLowerCase()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              No actions available
            </p>
          </div>
        )}
      </div>

      {/* SLA Warning */}
      {!isClosed && !caseData.slaBreach && (
        <div className="p-4 border-t border-border/50">
          <div className={cn(
            'p-3 rounded-lg flex items-center gap-3',
            caseData.escalationLevel > 1 
              ? 'bg-amber-500/10 border border-amber-500/20' 
              : 'bg-muted/30'
          )}>
            <Clock className={cn(
              'w-5 h-5',
              caseData.escalationLevel > 1 ? 'text-amber-400' : 'text-muted-foreground'
            )} />
            <div>
              <p className="text-xs font-medium">
                48-Hour SLA Policy Active
              </p>
              <p className="text-[10px] text-muted-foreground">
                Auto-escalation on breach
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
