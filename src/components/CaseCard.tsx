import { motion } from 'framer-motion';
import { 
  Shield, 
  FileText, 
  Building2, 
  User, 
  Hash,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  AcademicException, 
  getRiskLevel,
  EXCEPTION_TYPE_LABELS,
  STATUS_LABELS,
  DECISION_AUTHORITY_LABELS,
  maskStudentId
} from '@/lib/aeras-engine';
import { RiskScoreGauge } from './RiskScoreGauge';
import { SLATimer } from './SLATimer';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface CaseCardProps {
  caseData: AcademicException;
  index: number;
  onClick?: () => void;
}

export function CaseCard({ caseData, index, onClick }: CaseCardProps) {
  const riskLevel = getRiskLevel(caseData.riskScore);
  
  const statusColors: Record<string, string> = {
    'New': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'In Review': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    'Escalated': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    'Resolved': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
  };
  
  const riskCategoryColors: Record<string, string> = {
    LEGAL: 'text-red-400',
    COMPLIANCE: 'text-orange-400',
    REPUTATIONAL: 'text-amber-400',
    OPERATIONAL: 'text-blue-400'
  };
  
  return (
    <motion.div
      className={cn(
        'card-glow bg-card border rounded-xl p-5 cursor-pointer transition-all duration-300',
        'hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5',
        caseData.slaBreach && 'border-red-500/50 shadow-red-500/10'
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onClick={onClick}
      whileHover={{ y: -2 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-semibold text-primary">
              {caseData.caseNumber}
            </span>
            {caseData.slaBreach && (
              <Badge variant="destructive" className="text-xs animate-pulse">
                SLA BREACH
              </Badge>
            )}
          </div>
          <p className="text-sm font-medium">
            {EXCEPTION_TYPE_LABELS[caseData.exceptionType]}
          </p>
        </div>
        <RiskScoreGauge score={caseData.riskScore} size="sm" showLabel={false} />
      </div>
      
      {/* Status & SLA Row */}
      <div className="flex items-center justify-between mb-4">
        <Badge 
          variant="outline" 
          className={cn('text-xs', statusColors[caseData.status])}
        >
          {STATUS_LABELS[caseData.status]}
        </Badge>
        <SLATimer deadline={caseData.slaDeadline} />
      </div>
      
      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2 text-muted-foreground">
              <FileText className="w-3.5 h-3.5" />
              <span className="font-mono">{caseData.policyId}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-xs">
            <p className="text-xs">
              <strong>Applied Policy ID:</strong> {caseData.policyId}<br />
              Routing determined by institutional governance framework
            </p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Shield className="w-3.5 h-3.5" />
              <span className={riskCategoryColors[caseData.riskCategory]}>
                {caseData.riskCategory}
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-xs">
            <p className="text-xs">
              <strong>Risk Category:</strong> {caseData.riskCategory}<br />
              Score: {caseData.riskScore}/100 ({riskLevel.toUpperCase()})<br />
              Grievance Probability: {caseData.grievanceProbability}%
            </p>
          </TooltipContent>
        </Tooltip>
        
        <div className="flex items-center gap-2 text-muted-foreground">
          <Building2 className="w-3.5 h-3.5" />
          <span>{caseData.departmentCode}</span>
        </div>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="w-3.5 h-3.5" />
              <span className="font-mono">{maskStudentId(caseData.studentId)}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p className="text-xs">Student ID masked for data protection compliance</p>
          </TooltipContent>
        </Tooltip>
      </div>
      
      {/* Footer - Decision Authority */}
      <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Hash className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            Decision Authority:
          </span>
          <span className="text-xs font-medium text-primary">
            {DECISION_AUTHORITY_LABELS[caseData.decisionAuthority]}
          </span>
        </div>
        <ExternalLink className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
      </div>
    </motion.div>
  );
}
