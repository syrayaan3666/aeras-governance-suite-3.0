/**
 * Agentforce Insight Generator
 * Pure utility for generating deterministic case insights
 * Business rules and automation are handled by Salesforce Flow.
 * This provides assistive insights only.
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

  // Generate insight based on conditions - purely assistive, no action recommendations
  if (isSlaCritical || isRiskHigh) {
    if (isSlaCritical && isRiskHigh) {
      return `This ${title} case requires attention: SLA deadline approaching with elevated risk score of ${riskValue}. Salesforce Flow will handle any necessary escalation based on configured business rules.`;
    } else if (isSlaCritical) {
      return `This ${title} case has ${slaMinutesRemaining} minutes remaining before SLA deadline. Salesforce Flow monitors this automatically and will trigger appropriate actions if configured.`;
    } else {
      return `This ${title} case shows elevated risk with a score of ${riskValue}. Risk thresholds are monitored by Salesforce Flow for automated responses.`;
    }
  } else {
    // Normal case - provide status awareness
    const hasRecentActivity = recentAuditActions.length > 0;
    if (hasRecentActivity) {
      return `This ${title} case is progressing normally with ${slaMinutesRemaining} minutes remaining on SLA. Recent activity has been logged by Salesforce Flow.`;
    } else {
      return `This ${title} case is in ${status} status with adequate time remaining. All governance events are automatically tracked by Salesforce Flow.`;
    }
  }
}