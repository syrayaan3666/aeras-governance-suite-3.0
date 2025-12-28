import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  TrendingUp, 
  Scale, 
  Clock,
  Info,
  ShieldAlert
} from 'lucide-react';
import { AcademicException, getRiskLevel } from '@/lib/aeras-engine';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface RiskBreakdownPanelProps {
  caseData: AcademicException | null;
}

interface RiskDimension {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  getValue: (c: AcademicException) => number;
  maxValue: number;
  enterpriseImpact: string;
}

const riskDimensions: RiskDimension[] = [
  {
    id: 'policy',
    label: 'Policy Deviation Severity',
    description: 'Measures how far this exception deviates from established institutional policies',
    icon: Scale,
    getValue: (c) => Math.min(30, Math.floor(c.riskScore * 0.3)),
    maxValue: 30,
    enterpriseImpact: 'Accreditation compliance risk, audit finding probability'
  },
  {
    id: 'historical',
    label: 'Historical Pattern Risk',
    description: 'Based on student exception history and department trends',
    icon: TrendingUp,
    getValue: (c) => Math.min(25, Math.floor(c.riskScore * 0.25)),
    maxValue: 25,
    enterpriseImpact: 'Repeat exception indicator, systemic issue detection'
  },
  {
    id: 'grievance',
    label: 'Grievance Probability',
    description: 'Likelihood of formal grievance or appeal based on case characteristics',
    icon: AlertTriangle,
    getValue: (c) => Math.min(25, Math.floor(c.grievanceProbability * 0.25)),
    maxValue: 25,
    enterpriseImpact: 'Legal exposure, Title IX/ADA considerations'
  },
  {
    id: 'time',
    label: 'Time Sensitivity',
    description: 'Urgency based on academic calendar, enrollment deadlines, and SLA status',
    icon: Clock,
    getValue: (c) => Math.min(20, c.slaBreach ? 20 : Math.floor((1 - (c.escalationLevel / 3)) * 20)),
    maxValue: 20,
    enterpriseImpact: 'Enrollment impact, financial aid implications'
  }
];

export function RiskBreakdownPanel({ caseData }: RiskBreakdownPanelProps) {
  if (!caseData) {
    return (
      <div className="p-4 h-full flex items-center justify-center">
        <p className="text-sm text-muted-foreground text-center">
          Select a case to view risk indicator
        </p>
      </div>
    );
  }

  const riskLevel = getRiskLevel(caseData.riskScore);
  
  const riskColors: Record<string, { bg: string; text: string; border: string }> = {
    critical: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30' },
    high: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30' },
    medium: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
    low: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
    minimal: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/30' }
  };

  const progressColors: Record<string, string> = {
    critical: 'bg-red-500',
    high: 'bg-orange-500',
    medium: 'bg-amber-500',
    low: 'bg-emerald-500',
    minimal: 'bg-cyan-500'
  };

  const colors = riskColors[riskLevel];

  return (
    <motion.div
      className="h-full overflow-y-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      key={caseData.id}
    >
      {/* Header */}
      <div className={cn(
        'p-4 border-b',
        colors.bg,
        colors.border
      )}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <ShieldAlert className={cn('w-5 h-5', colors.text)} />
            <h3 className="font-semibold text-sm uppercase tracking-wider">
              Why This Is Risky
            </h3>
          </div>
          <span className={cn(
            'px-3 py-1 rounded-full text-xs font-bold uppercase',
            colors.bg,
            colors.text,
            colors.border,
            'border'
          )}>
            {riskLevel}
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className={cn('text-4xl font-bold font-mono', colors.text)}>
            {caseData.riskScore}
          </span>
          <span className="text-sm text-muted-foreground">/100 Institutional Risk Score</span>
        </div>
      </div>

      {/* Risk Breakdown Accordion */}
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="risk-breakdown">
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <span className="text-sm font-medium">View Risk Breakdown</span>
          </AccordionTrigger>
          <AccordionContent className="px-0 pb-0">
      <div className="p-4 space-y-4">
        <TooltipProvider>
          {riskDimensions.map((dimension, index) => {
            const value = dimension.getValue(caseData);
            const percentage = (value / dimension.maxValue) * 100;
            
            return (
              <motion.div
                key={dimension.id}
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <dimension.icon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{dimension.label}</span>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-3 h-3 text-muted-foreground hover:text-foreground transition-colors" />
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        <p className="text-sm">{dimension.description}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          <strong>Enterprise Impact:</strong> {dimension.enterpriseImpact}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <span className="font-mono text-sm">
                    {value}/{dimension.maxValue}
                  </span>
                </div>
                
                <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className={cn(
                      'absolute inset-y-0 left-0 rounded-full',
                      percentage >= 80 ? 'bg-red-500' :
                      percentage >= 60 ? 'bg-orange-500' :
                      percentage >= 40 ? 'bg-amber-500' :
                      'bg-emerald-500'
                    )}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                  />
                </div>
              </motion.div>
            );
          })}
        </TooltipProvider>
      </div>

      {/* Risk Category */}
      <div className="p-4 border-t border-border/50">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Risk Category Classification
        </h4>
        <div className={cn(
          'p-3 rounded-lg border',
          colors.bg,
          colors.border
        )}>
          <div className="flex items-center gap-2 mb-2">
            <span className={cn('text-lg font-bold', colors.text)}>
              {caseData.riskCategory}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {caseData.riskCategory === 'LEGAL' && 
              'High probability of grievance, Title IX/ADA implications, or litigation risk'}
            {caseData.riskCategory === 'COMPLIANCE' && 
              'Accreditation-sensitive, audit findings likely, policy enforcement critical'}
            {caseData.riskCategory === 'REPUTATIONAL' && 
              'Public perception risk, media attention possible, stakeholder sensitivity'}
            {caseData.riskCategory === 'OPERATIONAL' && 
              'Process disruption, resource allocation impact, system-wide implications'}
          </p>
        </div>
      </div>

      {/* Grievance Indicator */}
      <div className="p-4 border-t border-border/50">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Grievance Probability Assessment
        </h4>
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                className="text-muted"
              />
              <motion.circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                className={
                  caseData.grievanceProbability >= 60 ? 'text-red-500' :
                  caseData.grievanceProbability >= 40 ? 'text-amber-500' :
                  'text-emerald-500'
                }
                initial={{ strokeDasharray: '0 176' }}
                animate={{ 
                  strokeDasharray: `${(caseData.grievanceProbability / 100) * 176} 176` 
                }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-mono font-bold text-sm">
                {caseData.grievanceProbability}%
              </span>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">
              {caseData.grievanceProbability >= 60 ? 'High Risk' :
               caseData.grievanceProbability >= 40 ? 'Moderate Risk' : 'Low Risk'}
            </p>
            <p className="text-xs text-muted-foreground">
              Based on case characteristics, student history, and institutional patterns
            </p>
          </div>
        </div>
      </div>

      {/* Accreditation Badge */}
      <div className="p-4 border-t border-border/50">
        <div className="flex items-center justify-between p-3 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium">Accreditation & Legal Review Ready</span>
          </div>
          <span className="text-[10px] text-muted-foreground font-mono">
            IMMUTABLE LOG
          </span>
        </div>
      </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </motion.div>
  );
}
