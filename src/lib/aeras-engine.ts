// AERAS Core Engine - Academic Exception Risk & Accountability System
// Enterprise Governance Logic Layer

export interface AcademicException {
  id: string;
  caseNumber: string;
  exceptionType: ExceptionType;
  status: CaseStatus;
  riskScore: number;
  riskCategory: RiskCategory;
  policyId: string;
  decisionAuthority: DecisionAuthority;
  slaDeadline: Date;
  createdAt: Date;
  updatedAt: Date;
  systemTrigger: SystemTrigger;
  studentId: string; // Masked for display
  departmentCode: string;
  courseSectionId: string;
  auditTrail: GovernanceLogEntry[];
  escalationLevel: number;
  slaBreach: boolean;
  grievanceProbability: number;
}

export type ExceptionType = 
  | 'ATTENDANCE_THRESHOLD_BREACH'
  | 'SUBMISSION_DEADLINE_MISS'
  | 'GRADE_APPEAL_TRIGGER'
  | 'WITHDRAWAL_DEADLINE_EXCEPTION'
  | 'INCOMPLETE_GRADE_REQUEST'
  | 'ACADEMIC_STANDING_OVERRIDE'
  | 'POLICY_DEVIATION_REQUEST';

export type CaseStatus = 
  | 'SYSTEM_INITIATED'
  | 'PENDING_REVIEW'
  | 'UNDER_EVALUATION'
  | 'ESCALATED'
  | 'SLA_BREACHED'
  | 'APPROVED'
  | 'DENIED'
  | 'CLOSED';

export type RiskCategory = 
  | 'COMPLIANCE'
  | 'LEGAL'
  | 'REPUTATIONAL'
  | 'OPERATIONAL';

export type DecisionAuthority = 
  | 'DEPARTMENT_CHAIR'
  | 'ACADEMIC_DEAN'
  | 'PROVOST_OFFICE'
  | 'COMPLIANCE_OFFICER'
  | 'LEGAL_COUNSEL';

export interface SystemTrigger {
  source: 'SIS' | 'LMS' | 'ATTENDANCE_SYSTEM' | 'GRADE_BOOK';
  triggerType: string;
  triggerValue: string;
  timestamp: Date;
  automationId: string;
}

export interface GovernanceLogEntry {
  id: string;
  timestamp: Date;
  eventType: GovernanceEventType;
  actor: string;
  action: string;
  details: string;
  policyReference?: string;
  immutable: boolean;
}

export type GovernanceEventType = 
  | 'CASE_CREATED'
  | 'STATUS_CHANGE'
  | 'ESCALATION'
  | 'SLA_WARNING'
  | 'SLA_BREACH'
  | 'DECISION_MADE'
  | 'POLICY_APPLIED'
  | 'RISK_RECALCULATED';

// Risk Score Calculation Engine
export function calculateInstitutionalRiskScore(
  policyDeviationSeverity: number, // 0-25
  historicalPatternRisk: number,    // 0-25
  grievanceProbability: number,     // 0-25
  timeSensitivity: number           // 0-25
): { score: number; category: RiskCategory } {
  const rawScore = policyDeviationSeverity + historicalPatternRisk + grievanceProbability + timeSensitivity;
  const score = Math.min(100, Math.max(0, rawScore));
  
  let category: RiskCategory;
  if (grievanceProbability > 20 || policyDeviationSeverity > 20) {
    category = 'LEGAL';
  } else if (historicalPatternRisk > 18) {
    category = 'COMPLIANCE';
  } else if (timeSensitivity > 20) {
    category = 'OPERATIONAL';
  } else {
    category = 'REPUTATIONAL';
  }
  
  return { score, category };
}

export function getRiskLevel(score: number): 'critical' | 'high' | 'medium' | 'low' | 'minimal' {
  if (score >= 80) return 'critical';
  if (score >= 60) return 'high';
  if (score >= 40) return 'medium';
  if (score >= 20) return 'low';
  return 'minimal';
}

export function getSLATimeRemaining(deadline: Date): { 
  hours: number; 
  minutes: number; 
  isBreached: boolean;
  isWarning: boolean;
} {
  const now = new Date();
  const diff = deadline.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return {
    hours: Math.max(0, hours),
    minutes: Math.max(0, minutes),
    isBreached: diff < 0,
    isWarning: hours < 12 && hours >= 0
  };
}

export function maskStudentId(id: string): string {
  if (id.length < 4) return '****';
  return `****${id.slice(-4)}`;
}

export function generateCaseNumber(): string {
  const prefix = 'AE';
  const year = new Date().getFullYear();
  const sequence = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  return `${prefix}-${year}-${sequence}`;
}

export const EXCEPTION_TYPE_LABELS: Record<ExceptionType, string> = {
  ATTENDANCE_THRESHOLD_BREACH: 'Attendance Threshold Breach',
  SUBMISSION_DEADLINE_MISS: 'Submission Deadline Exception',
  GRADE_APPEAL_TRIGGER: 'Grade Appeal Trigger',
  WITHDRAWAL_DEADLINE_EXCEPTION: 'Withdrawal Deadline Override',
  INCOMPLETE_GRADE_REQUEST: 'Incomplete Grade Processing',
  ACADEMIC_STANDING_OVERRIDE: 'Academic Standing Override',
  POLICY_DEVIATION_REQUEST: 'Policy Deviation Review'
};

export const STATUS_LABELS: Record<CaseStatus, string> = {
  SYSTEM_INITIATED: 'System Initiated',
  PENDING_REVIEW: 'Pending Review',
  UNDER_EVALUATION: 'Under Evaluation',
  ESCALATED: 'Escalated',
  APPROVED: 'Approved',
  DENIED: 'Denied',
  SLA_BREACHED: 'SLA Breached',
  CLOSED: 'Closed'
};

export const DECISION_AUTHORITY_LABELS: Record<DecisionAuthority, string> = {
  DEPARTMENT_CHAIR: 'Department Chair',
  ACADEMIC_DEAN: 'Academic Dean',
  PROVOST_OFFICE: 'Provost Office',
  COMPLIANCE_OFFICER: 'Compliance Officer',
  LEGAL_COUNSEL: 'Legal Counsel'
};
