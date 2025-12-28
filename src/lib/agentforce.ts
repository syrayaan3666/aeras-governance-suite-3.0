/**
 * Agentforce Insight Generator
 * Pure utility for generating deterministic case insights
 */

export interface CaseContext {
  title: string;
  status: string;
  slaMinutesRemaining: number;
  riskScore: number | string;
  recentAuditActions: string[];
}

export function generateAgentInsight(caseContext: CaseContext): string {
  const { title, status, slaMinutesRemaining, riskScore, recentAuditActions } = caseContext;

  // Convert riskScore to number if it's a string
  const riskValue = typeof riskScore === 'string' ? parseFloat(riskScore) : riskScore;

  // Determine if SLA is critical (less than 1 hour remaining)
  const isSlaCritical = slaMinutesRemaining < 60;

  // Determine if risk is high (above 70%)
  const isRiskHigh = riskValue > 70;

  // Generate insight based on conditions
  if (isSlaCritical || isRiskHigh) {
    if (isSlaCritical && isRiskHigh) {
      return `This ${title} case is approaching SLA breach with high risk score of ${riskValue}. Recommended next step: immediately request additional information or escalate to supervisor for urgent review.`;
    } else if (isSlaCritical) {
      return `This ${title} case has only ${slaMinutesRemaining} minutes remaining before SLA breach. Recommended next step: request additional information or escalate to meet the deadline.`;
    } else {
      return `This ${title} case shows elevated risk with a score of ${riskValue}. Recommended next step: gather more information or escalate for specialized review.`;
    }
  } else {
    // Normal case - recommend monitoring or routine update
    const hasRecentActivity = recentAuditActions.length > 0;
    if (hasRecentActivity) {
      return `This ${title} case is progressing normally with ${slaMinutesRemaining} minutes remaining on SLA. Recommended next step: continue monitoring or update case status as appropriate.`;
    } else {
      return `This ${title} case is in ${status} status with adequate time remaining. Recommended next step: review recent activity or update case documentation.`;
    }
  }
}