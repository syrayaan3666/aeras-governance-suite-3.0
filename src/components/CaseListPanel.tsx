import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  SortDesc,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AcademicException, EXCEPTION_TYPE_LABELS, STATUS_LABELS, getRiskLevel, getSLATimeRemaining } from '@/lib/aeras-engine';
import { cn } from '@/lib/utils';
import { useState, useMemo } from 'react';

interface CaseListPanelProps {
  cases: AcademicException[];
  selectedCase: AcademicException | null;
  onSelectCase: (caseData: AcademicException) => void;
  filter?: 'all' | 'critical' | 'sla' | 'escalated';
  onFilterChange?: (filter: 'all' | 'critical' | 'sla' | 'escalated') => void;
}

export function CaseListPanel({ 
  cases, 
  selectedCase, 
  onSelectCase,
  filter = 'all',
  onFilterChange
}: CaseListPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCases = useMemo(() => {
    let result = cases;
    
    // Apply filter
    if (filter === 'critical') {
      result = result.filter(c => c.riskScore >= 80);
    } else if (filter === 'sla') {
      result = result.filter(c => c.slaBreach);
    } else if (filter === 'escalated') {
      result = result.filter(c => c.status === 'ESCALATED');
    }
    
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(c => 
        c.caseNumber.toLowerCase().includes(query) ||
        c.departmentCode.toLowerCase().includes(query) ||
        EXCEPTION_TYPE_LABELS[c.exceptionType].toLowerCase().includes(query)
      );
    }
    
    return result;
  }, [cases, filter, searchQuery]);

  const riskColors: Record<string, string> = {
    critical: 'bg-red-500',
    high: 'bg-orange-500',
    medium: 'bg-amber-500',
    low: 'bg-emerald-500',
    minimal: 'bg-cyan-500'
  };

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
    <div className="h-full flex flex-col bg-card border-r border-border/50">
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
            High Risk Cases
          </h2>
          <span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs font-mono">
            {filteredCases.length}
          </span>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search cases..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-muted/30 border-border/50 h-9 text-sm"
          />
        </div>
        
        {/* Quick Filters */}
        <div className="flex gap-2 mt-3">
          <Button 
            size="sm" 
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => onFilterChange?.('all')}
            className="text-xs h-7"
          >
            All
          </Button>
          <Button 
            size="sm" 
            variant={filter === 'critical' ? 'default' : 'outline'}
            onClick={() => onFilterChange?.('critical')}
            className={cn(
              "text-xs h-7",
              filter === 'critical' && 'bg-red-600 hover:bg-red-700'
            )}
          >
            Critical
          </Button>
          <Button 
            size="sm" 
            variant={filter === 'sla' ? 'default' : 'outline'}
            onClick={() => onFilterChange?.('sla')}
            className={cn(
              "text-xs h-7",
              filter === 'sla' && 'bg-amber-600 hover:bg-amber-700'
            )}
          >
            SLA
          </Button>
        </div>
      </div>

      {/* Sort Indicator */}
      <div className="px-4 py-2 border-b border-border/50 flex items-center gap-2">
        <SortDesc className="w-3 h-3 text-muted-foreground" />
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
          Sorted by Risk Score (Descending)
        </span>
      </div>

      {/* Case List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {filteredCases.map((caseData, index) => {
            const riskLevel = getRiskLevel(caseData.riskScore);
            const slaStatus = getSLATimeRemaining(caseData.slaDeadline);
            const isSelected = selectedCase?.id === caseData.id;
            
            return (
              <motion.button
                key={caseData.id}
                onClick={() => onSelectCase(caseData)}
                className={cn(
                  'w-full p-3 rounded-lg text-left transition-all duration-200',
                  'hover:bg-muted/50',
                  isSelected ? 'bg-primary/10 border border-primary/30' : 'border border-transparent',
                  caseData.slaBreach && 'bg-red-500/5'
                )}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                whileHover={{ x: 2 }}
              >
                {/* Top Row */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      'w-2 h-2 rounded-full',
                      riskColors[riskLevel]
                    )} />
                    <span className="font-mono text-sm font-medium">
                      {caseData.caseNumber}
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold">
                    {caseData.riskScore}
                  </span>
                </div>

                {/* Exception Type */}
                <p className="text-xs text-muted-foreground mb-2 truncate">
                  {EXCEPTION_TYPE_LABELS[caseData.exceptionType]}
                </p>

                {/* Bottom Row */}
                <div className="flex items-center justify-between">
                  <Badge 
                    variant="outline" 
                    className={cn('text-[10px] py-0', statusColors[caseData.status])}
                  >
                    {STATUS_LABELS[caseData.status]}
                  </Badge>
                  
                  {slaStatus.isBreached ? (
                    <span className="flex items-center gap-1 text-red-400 text-[10px] animate-pulse">
                      <AlertTriangle className="w-3 h-3" />
                      BREACHED
                    </span>
                  ) : slaStatus.isWarning ? (
                    <span className="flex items-center gap-1 text-amber-400 text-[10px]">
                      <Clock className="w-3 h-3" />
                      {slaStatus.hours}h
                    </span>
                  ) : (
                    <span className="text-muted-foreground text-[10px] font-mono">
                      {caseData.departmentCode}
                    </span>
                  )}
                </div>
              </motion.button>
            );
          })}

          {filteredCases.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-sm text-muted-foreground">No cases found</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
