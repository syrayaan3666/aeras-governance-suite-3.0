// Salesforce REST API utilities for browser compatibility
const SF_LOGIN_URL = '/api/sf';
const API_VERSION = 'v58.0';
const CLIENT_ID = import.meta.env.VITE_SF_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_SF_CLIENT_SECRET;
const USERNAME = import.meta.env.VITE_SF_USERNAME;
const PASSWORD = import.meta.env.VITE_SF_PASSWORD + (import.meta.env.VITE_SF_SECURITY_TOKEN || '');

let accessToken: string | null = null;
let instanceUrl: string | null = null;

// Mapping for Governance_Log__c Action_Type__c restricted picklist values
const ACTION_TYPE_MAP: Record<string, string> = {
  REQUEST_INFO: 'Update',
  APPROVE: 'Approve',
  DENY: 'Deny',
  ESCALATE: 'Escalate',
};

// Login to Salesforce and get access token
export const loginToSalesforce = async (): Promise<void> => {
  const response = await fetch(`${SF_LOGIN_URL}/services/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'password',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      username: USERNAME,
      password: PASSWORD,
    }),
  });

  if (!response.ok) {
    throw new Error(`Login failed: ${response.statusText}`);
  }

  const data = await response.json();
  accessToken = data.access_token;
  instanceUrl = data.instance_url;
  console.log('Logged in to Salesforce');
};

// Helper to make authenticated API calls
const sfApiCall = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
  if (!accessToken || !instanceUrl) {
    throw new Error('Not logged in to Salesforce');
  }

  const url = `${instanceUrl}${endpoint}`;
  // Log the outgoing request for debugging (do not log tokens)
  console.debug('SF request', { url, method: options.method || 'GET' });

  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    let bodyText: string;
    try {
      const body = await response.json();
      bodyText = JSON.stringify(body);
    } catch (e) {
      bodyText = await response.text();
    }
    const msg = `API call failed: ${response.status} ${response.statusText} - ${bodyText}`;
    console.error(msg);
    throw new Error(msg);
  }

  // Handle 204 No Content responses (successful updates with no response body)
  if (response.status === 204) {
    return null;
  }

  return response.json();
};

// Query records
export const queryRecords = async (query: string): Promise<any[]> => {
  const data = await sfApiCall(`/services/data/${API_VERSION}/query?q=${encodeURIComponent(query)}`);
  return data.records || [];
};

// Create record
export const createRecord = async (objectName: string, data: any): Promise<any> => {
  return sfApiCall(`/services/data/${API_VERSION}/sobjects/${objectName}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// Update record
export const updateRecord = async (objectName: string, id: string, data: any): Promise<any> => {
  return sfApiCall(`/services/data/${API_VERSION}/sobjects/${objectName}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

// Create governance log record with action type mapping
export const createGovernanceLog = async (caseId: string, actionType: string, newStatus: string, actor: string = 'Current User'): Promise<any> => {
  const mappedActionType = ACTION_TYPE_MAP[actionType.toUpperCase()] || 'Update'; // Default to 'Update' if mapping not found
  
  return createRecord('Governance_Log__c', {
    Case_c__c: caseId,
    Action_Type_c__c: mappedActionType,
    New_Status_c__c: newStatus,
    Actor_c__c: actor
  });
};

// Create sample data
export const createSampleData = async (): Promise<void> => {
  const sampleCases = [
    {
      Name: 'AERAS-2025-001',
      ExceptionType_c__c: 'Attendance',
      Status_c__c: 'New',
      Institutional_Risk_Score_c__c: 85,
      Risk_Category_c__c: 'LEGAL',
      Policy_ID_Applied_c__c: 'POL-2024-001',
      Grievance_Probability_c__c: 75,
      SLA_Deadline_c__c: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
      Is_System_Initiated_c__c: true
    },
    {
      Name: 'AERAS-2025-002',
      ExceptionType_c__c: 'Academic',
      Status_c__c: 'In Review',
      Institutional_Risk_Score_c__c: 65,
      Risk_Category_c__c: 'COMPLIANCE',
      Policy_ID_Applied_c__c: 'POL-2024-002',
      Grievance_Probability_c__c: 45,
      SLA_Deadline_c__c: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      Is_System_Initiated_c__c: true
    }
  ];

  for (const caseData of sampleCases) {
    await createRecord('Academic_Exception_c__c', caseData);
  }
  console.log('Sample data created');
};