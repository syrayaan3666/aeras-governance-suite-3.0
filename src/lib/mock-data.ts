import {
  AcademicException,
  ExceptionType,
  CaseStatus,
  DecisionAuthority,
  GovernanceLogEntry,
  calculateInstitutionalRiskScore,
  generateCaseNumber
} from './aeras-engine';
import { queryRecords } from './salesforce';

// Fetch academic exceptions from Salesforce
export const getAcademicExceptions = async (): Promise<AcademicException[]> => {
  const query = `SELECT Id, Name, ExceptionType_c__c, Status_c__c, Institutional_Risk_Score_c__c, Risk_Category_c__c, Policy_ID_Applied_c__c, Grievance_Probability_c__c, SLA_Deadline_c__c, CreatedDate, LastModifiedDate, Is_System_Initiated_c__c FROM Academic_Exception_c__c ORDER BY CreatedDate DESC LIMIT 50`;
  const records = await queryRecords(query);
  return records.map(record => ({
    id: record.Id,
    caseNumber: record.Name,
    exceptionType: record.ExceptionType_c__c as ExceptionType,
    status: record.Status_c__c as CaseStatus,
    riskScore: record.Institutional_Risk_Score_c__c,
    riskCategory: record.Risk_Category_c__c,
    policyId: record.Policy_ID_Applied_c__c,
    decisionAuthority: 'DEPARTMENT_CHAIR' as DecisionAuthority, // Placeholder
    slaDeadline: new Date(record.SLA_Deadline_c__c),
    createdAt: new Date(record.CreatedDate),
    updatedAt: new Date(record.LastModifiedDate),
    systemTrigger: {
      source: 'SIS' as any,
      triggerType: 'AUTO_TRIGGER',
      triggerValue: 'THRESHOLD_EXCEEDED',
      timestamp: new Date(record.CreatedDate),
      automationId: record.Id
    },
    studentId: 'MASKED',
    departmentCode: 'DEPT001',
    courseSectionId: 'CS001',
    auditTrail: [],
    escalationLevel: 0,
    slaBreach: new Date() > new Date(record.SLA_Deadline_c__c),
    grievanceProbability: record.Grievance_Probability_c__c
  }));
};

// Fetch dashboard metrics from Salesforce
export const getDashboardMetrics = async () => {
  const records = await queryRecords(`SELECT Status_c__c, Institutional_Risk_Score_c__c, Grievance_Probability_c__c, SLA_Deadline_c__c FROM Academic_Exception_c__c`);

  const now = new Date();
  const activeCases = records.filter(r => ['New', 'In Review'].includes(r.Status_c__c)).length;
  const slaBreaches = records.filter(r => new Date(r.SLA_Deadline_c__c) < now).length;
  const criticalRiskCases = records.filter(r => r.Institutional_Risk_Score_c__c >= 80).length;
  const pendingEscalations = records.filter(r => r.Status_c__c === 'ESCALATED').length;
  const averageRiskScore = records.length > 0 ? Math.round(records.reduce((acc, r) => acc + (r.Institutional_Risk_Score_c__c || 0), 0) / records.length) : 0;
  const grievanceRiskCases = records.filter(r => (r.Grievance_Probability_c__c || 0) >= 60).length;

  return {
    activeCases,
    slaBreaches,
    criticalRiskCases,
    pendingEscalations,
    averageRiskScore,
    grievanceRiskCases
  };
};

// Fetch governance logs
export const getGovernanceLogs = async (caseId?: string): Promise<GovernanceLogEntry[]> => {
  const query = caseId
    ? `SELECT Id, Action_Type_c__c, Previous_Status_c__c, New_Status_c__c, Actor_c__c, CreatedDate FROM Governance_Log__c WHERE Case_c__c = '${caseId}' ORDER BY CreatedDate DESC`
    : `SELECT Id, Action_Type_c__c, Previous_Status_c__c, New_Status_c__c, Actor_c__c, CreatedDate FROM Governance_Log__c ORDER BY CreatedDate DESC LIMIT 20`;

  const records = await queryRecords(query);
  return records.map(record => ({
    id: record.Id,
    timestamp: new Date(record.CreatedDate),
    eventType: record.Action_Type_c__c as any,
    actor: record.Actor_c__c || 'SYSTEM',
    action: record.Action_Type_c__c,
    details: `Changed from ${record.Previous_Status_c__c} to ${record.New_Status_c__c}`,
    immutable: true
  }));
};

// Static data for components (can be made dynamic later)
export const governanceFeed = [
  {
    id: 'feed-1',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    type: 'CASE_CREATED',
    message: 'Attendance threshold breach detected for section ENGR-301-2. Case auto-generated.',
    source: 'ATTENDANCE_SYSTEM',
    caseNumber: 'AE-2024-00892'
  },
  {
    id: 'feed-2',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    type: 'SLA_WARNING',
    message: 'Case AE-2024-00847 approaching SLA deadline. 8 hours remaining.',
    source: 'SLA_MONITOR',
    caseNumber: 'AE-2024-00847'
  },
  {
    id: 'feed-3',
    timestamp: new Date(Date.now() - 32 * 60 * 1000),
    type: 'ESCALATION',
    message: 'Case AE-2024-00831 escalated to Provost Office due to risk threshold.',
    source: 'RISK_ENGINE',
    caseNumber: 'AE-2024-00831'
  },
  {
    id: 'feed-4',
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    type: 'RISK_RECALCULATED',
    message: 'Risk score updated for 3 cases based on historical pattern analysis.',
    source: 'PATTERN_ENGINE',
    caseNumber: null
  },
  {
    id: 'feed-5',
    timestamp: new Date(Date.now() - 68 * 60 * 1000),
    type: 'SLA_BREACH',
    message: 'GOVERNANCE FAILURE: Case AE-2024-00789 breached 48hr SLA. Auto-escalation triggered.',
    source: 'SLA_MONITOR',
    caseNumber: 'AE-2024-00789'
  }
];

export const patternData = {
  repeatExceptionHotspots: [
    { department: 'ENGR', count: 12, trend: 'increasing' },
    { department: 'BUSN', count: 8, trend: 'stable' },
    { department: 'SCIN', count: 6, trend: 'decreasing' }
  ],
  decisionBiasIndicators: [
    { authority: 'DEPARTMENT_CHAIR', approvalRate: 0.89, cases: 45, flag: 'HIGH_APPROVAL' },
    { authority: 'ACADEMIC_DEAN', approvalRate: 0.52, cases: 31, flag: 'NORMAL' },
    { authority: 'COMPLIANCE_OFFICER', approvalRate: 0.34, cases: 18, flag: 'NORMAL' }
  ],
  slaPerformance: {
    met: 127,
    breached: 8,
    atRisk: 5
  }
};
