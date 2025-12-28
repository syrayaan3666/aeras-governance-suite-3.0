import { motion } from 'framer-motion';
import { 
  Hash, 
  Building2, 
  Calendar, 
  User, 
  ExternalLink,
  Cpu,
  FileText
} from 'lucide-react';
import { AcademicException, EXCEPTION_TYPE_LABELS, STATUS_LABELS, DECISION_AUTHORITY_LABELS, maskStudentId } from '@/lib/aeras-engine';
import { RiskScoreGauge } from './RiskScoreGauge';
import { SLATimer } from './SLATimer';
import { AuditTimeline } from './AuditTimeline';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface CaseDetailViewProps {
  caseData: AcademicException | null;
}

export function CaseDetailView({ caseData }: CaseDetailViewProps) {
  if (!caseData) {
    return (
      <div className="h-full flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <FileText className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-lg font-medium text-muted-foreground">No Case Selected</p>
          <p className="text-sm text-muted-foreground/70 mt-1">
            Select a case from the list to view details
          </p>
        </motion.div>
      </div>
    );
  }

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
    <motion.div
      className="h-full flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      key={caseData.id}
    >
      {/* Header */}
      <div className="p-6 border-b border-border/50 bg-gradient-to-r from-card to-surface-elevated">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="font-mono text-2xl font-bold text-primary">
                {caseData.caseNumber}
              </h2>
              <Badge 
                variant="outline" 
                className={cn('text-xs', statusColors[caseData.status])}
              >
                {STATUS_LABELS[caseData.status]}
              </Badge>
              {caseData.slaBreach && (
                <Badge variant="destructive" className="text-xs animate-pulse">
                  SLA BREACHED
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">
              {EXCEPTION_TYPE_LABELS[caseData.exceptionType]}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <RiskScoreGauge score={caseData.riskScore} size="md" />
            <SLATimer deadline={caseData.slaDeadline} className="text-right" />
          </div>
        </div>

        {/* Quick Info Bar */}
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-muted-foreground" />
            <span className="font-mono">{caseData.departmentCode}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="font-mono">{maskStudentId(caseData.studentId)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-muted-foreground" />
            <span className="text-primary font-medium">
              {DECISION_AUTHORITY_LABELS[caseData.decisionAuthority]}
            </span>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="details" className="flex-1 flex flex-col">
        <TabsList className="mx-6 mt-4 justify-start bg-muted/30">
          <TabsTrigger value="details">Case Details</TabsTrigger>
          <TabsTrigger value="governance">Governance Log</TabsTrigger>
          <TabsTrigger value="system">System Trigger</TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1 p-6">
          <TabsContent value="details" className="mt-0 space-y-6">
            {/* Case Information Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Hash className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider">Policy ID</span>
                </div>
                <p className="font-mono text-lg">{caseData.policyId}</p>
              </div>
              
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider">Course Section</span>
                </div>
                <p className="font-mono text-lg">{caseData.courseSectionId}</p>
              </div>
            </div>

            {/* Risk Assessment */}
            <div className="p-5 bg-muted/20 border border-border/50 rounded-xl">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                Risk Assessment Summary
              </h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Risk Category</p>
                  <p className="font-semibold">{caseData.riskCategory}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Grievance Probability</p>
                  <p className="font-mono font-semibold">{caseData.grievanceProbability}%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Escalation Level</p>
                  <p className="font-mono font-semibold">{caseData.escalationLevel}</p>
                </div>
              </div>
            </div>

            {/* Timestamps */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Created</p>
                <p className="font-mono">{caseData.createdAt.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Last Updated</p>
                <p className="font-mono">{caseData.updatedAt.toLocaleString()}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="governance" className="mt-0">
            <AuditTimeline entries={caseData.auditTrail} />
          </TabsContent>

          <TabsContent value="system" className="mt-0">
            <div className="p-5 bg-primary/5 border border-primary/20 rounded-xl">
              <div className="flex items-center gap-2 mb-4">
                <Cpu className="w-5 h-5 text-primary" />
                <h4 className="text-sm font-semibold uppercase tracking-wider text-primary">
                  System Trigger Details
                </h4>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Source System</p>
                  <p className="font-mono font-medium">{caseData.systemTrigger.source}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Trigger Type</p>
                  <p className="font-mono font-medium">{caseData.systemTrigger.triggerType}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Trigger Value</p>
                  <p className="font-mono font-medium">{caseData.systemTrigger.triggerValue}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Automation ID</p>
                  <p className="font-mono font-medium text-primary">{caseData.systemTrigger.automationId}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-primary/20">
                <p className="text-xs text-muted-foreground mb-1">Trigger Timestamp</p>
                <p className="font-mono">{caseData.systemTrigger.timestamp.toLocaleString()}</p>
              </div>

              <div className="mt-4 p-3 bg-card/50 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  This case was automatically generated by the {caseData.systemTrigger.source} integration. 
                  No manual intervention occurred during case creation.
                </p>
              </div>
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </motion.div>
  );
}
