import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Clock,
  TrendingUp,
  Shield,
  FileWarning,
  Scale,
  LayoutDashboard,
  ChevronDown
} from 'lucide-react';
import { ServiceConsoleSidebar } from '@/components/ServiceConsoleSidebar';
import { ConsoleHeader } from '@/components/ConsoleHeader';
import { CaseListPanel } from '@/components/CaseListPanel';
import { CaseDetailView } from '@/components/CaseDetailView';
import { QuickActionsPanel } from '@/components/QuickActionsPanel';
import { RiskBreakdownPanel } from '@/components/RiskBreakdownPanel';
import { MetricCard } from '@/components/MetricCard';
import { GovernanceFeed } from '@/components/GovernanceFeed';
import { PatternDetection } from '@/components/PatternDetection';
import { getAcademicExceptions, getDashboardMetrics } from '@/lib/mock-data';
import { AcademicException } from '@/lib/aeras-engine';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { loginToSalesforce, updateRecord, createRecord, createSampleData, createGovernanceLog } from '@/lib/salesforce';

const Index = () => {
  const [selectedCase, setSelectedCase] = useState<AcademicException | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [caseFilter, setCaseFilter] = useState<'all' | 'critical' | 'sla' | 'escalated'>('all');
  const [rightPanel, setRightPanel] = useState<'actions' | 'risk'>('actions');
  const [cases, setCases] = useState<AcademicException[]>([]);
  const [metrics, setMetrics] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [advancedInsightsOpen, setAdvancedInsightsOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        await loginToSalesforce();
        const [casesData, metricsData] = await Promise.all([
          getAcademicExceptions(),
          getDashboardMetrics()
        ]);
        setCases(casesData);
        setMetrics(metricsData);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleCaseAction = async (action: string, caseId: string, notes?: string) => {
    try {
      // Update case status in Salesforce
      let newStatus: string;
      switch (action) {
        case 'approve':
          newStatus = 'Resolved';
          break;
        case 'deny':
          newStatus = 'Resolved';
          break;
        case 'escalate':
          newStatus = 'Escalated';
          break;
        default:
          newStatus = 'In Review';
      }

      await updateRecord('Academic_Exception_c__c', caseId, { Status_c__c: newStatus });

      // Create governance log
      await createGovernanceLog(caseId, action, newStatus);

      // Refresh data
      const [updatedCases, updatedMetrics] = await Promise.all([
        getAcademicExceptions(),
        getDashboardMetrics()
      ]);
      setCases(updatedCases);
      setMetrics(updatedMetrics);

      console.log('Action completed:', action, caseId);
    } catch (error) {
      console.error('Action failed:', error);
    }
  };

  // Dashboard View
  const DashboardView = () => (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      {/* Page Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold">Executive Risk Command Center</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Real-time institutional governance oversight • System-initiated case management
        </p>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p>Loading Salesforce data...</p>
        </div>
      ) : cases.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <p>No academic exceptions found. Create sample data for demo?</p>
          <button
            onClick={async () => {
              setLoading(true);
              await createSampleData();
              const [updatedCases, updatedMetrics] = await Promise.all([
                getAcademicExceptions(),
                getDashboardMetrics()
              ]);
              setCases(updatedCases);
              setMetrics(updatedMetrics);
              setLoading(false);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Create Sample Cases
          </button>
        </div>
      ) : (
        <>
          {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <MetricCard
          title="Active Cases"
          value={metrics.activeCases || 0}
          subtitle="Requiring attention"
          icon={FileWarning}
          trend="up"
          trendValue="12%"
          delay={0}
        />
        <MetricCard
          title="SLA Breaches"
          value={metrics.slaBreaches || 0}
          subtitle="Governance failures"
          icon={AlertTriangle}
          variant="danger"
          trend="up"
          trendValue="2"
          delay={0.05}
        />
        <MetricCard
          title="Critical Risk"
          value={metrics.criticalRiskCases || 0}
          subtitle="Score ≥80"
          icon={Shield}
          variant="warning"
          delay={0.1}
        />
        <MetricCard
          title="Escalations"
          value={metrics.pendingEscalations || 0}
          subtitle="Pending review"
          icon={TrendingUp}
          variant="warning"
          delay={0.15}
        />
        <MetricCard
          title="Avg Risk Score"
          value={metrics.averageRiskScore || 0}
          subtitle="Institution-wide"
          icon={Scale}
          delay={0.2}
        />
        <MetricCard
          title="Grievance Risk"
          value={metrics.grievanceRiskCases || 0}
          subtitle="Probability ≥60%"
          icon={Clock}
          variant="danger"
          delay={0.25}
        />
      </div>

      {/* Advanced Insights - Collapsible */}
      <Collapsible open={advancedInsightsOpen} onOpenChange={setAdvancedInsightsOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-muted/30 hover:bg-muted/50 rounded-lg transition-colors">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Advanced Insights</h3>
          </div>
          <motion.div
            animate={{ rotate: advancedInsightsOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          </motion.div>
        </CollapsibleTrigger>

        <CollapsibleContent className="space-y-6 mt-4">
          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-6">
            <GovernanceFeed />
            <PatternDetection />
          </div>
        </CollapsibleContent>
      </Collapsible>
        </>
      )}
    </div>
  );

  // Cases View (Service Console Layout)
  const CasesView = () => (
    <ResizablePanelGroup direction="horizontal" className="h-full">
      {/* Left Panel - Case List */}
      <ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
        <CaseListPanel
          cases={cases}
          selectedCase={selectedCase}
          onSelectCase={setSelectedCase}
          filter={caseFilter}
          onFilterChange={setCaseFilter}
        />
      </ResizablePanel>

      <ResizableHandle withHandle />

      {/* Middle Panel - Case Details */}
      <ResizablePanel defaultSize={50} minSize={35}>
        <CaseDetailView caseData={selectedCase} />
      </ResizablePanel>

      <ResizableHandle withHandle />

      {/* Right Panel - Quick Actions / Risk Indicator */}
      <ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
        <div className="h-full flex flex-col bg-card">
          {/* Panel Tabs */}
          <Tabs value={rightPanel} onValueChange={(v) => setRightPanel(v as 'actions' | 'risk')}>
            <TabsList className="mx-4 mt-4 justify-start bg-muted/30">
              <TabsTrigger value="actions" className="text-xs">Quick Actions</TabsTrigger>
              <TabsTrigger value="risk" className="text-xs">Risk Indicator</TabsTrigger>
            </TabsList>

            <TabsContent value="actions" className="flex-1 m-0">
              <QuickActionsPanel caseData={selectedCase} onAction={handleCaseAction} />
            </TabsContent>

            <TabsContent value="risk" className="flex-1 m-0">
              <RiskBreakdownPanel caseData={selectedCase} />
            </TabsContent>
          </Tabs>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      {/* Sidebar */}
      <ServiceConsoleSidebar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab === 'cases' || tab === 'critical' || tab === 'sla' || tab === 'escalations') {
            setActiveTab('cases');
            if (tab === 'critical') setCaseFilter('critical');
            else if (tab === 'sla') setCaseFilter('sla');
            else if (tab === 'escalations') setCaseFilter('escalated');
            else setCaseFilter('all');
          }
        }}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Console Header */}
        <ConsoleHeader />

        {/* Content */}
        <main className="flex-1 overflow-hidden">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'cases' && <CasesView />}
          {activeTab === 'patterns' && (
            <div className="p-6 h-full overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6">Pattern Detection Analytics</h2>
              <PatternDetection />
            </div>
          )}
          {(activeTab === 'authorities' || activeTab === 'policies') && (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <LayoutDashboard className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-lg font-medium text-muted-foreground">
                  {activeTab === 'authorities' ? 'Decision Makers' : 'Policy Library'}
                </p>
                <p className="text-sm text-muted-foreground/70 mt-1">
                  Connect Salesforce to view data
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;
