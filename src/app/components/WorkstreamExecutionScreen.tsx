import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Calendar, TrendingUp, TrendingDown, AlertCircle, Clock, ArrowRight, ChevronRight, Minus, Package, User, CheckCircle2 } from 'lucide-react';

interface WorkstreamData {
  id: string;
  name: string;
  inProgress: number;
  blocked: number;
  avgAge: number;
  throughputTrend: 'up' | 'down' | 'flat';
  throughputChange: number;
  bottleneck: string;
  progressPercent: number;
  color: string;
  owner: string;
  items: WorkItem[];
}

interface WorkItem {
  id: string;
  title: string;
  status: 'in-progress' | 'blocked' | 'waiting' | 'review';
  age: number;
  owner: string;
  milestone: string;
  priority: 'high' | 'medium' | 'low';
}

const workstreams: WorkstreamData[] = [
  {
    id: 'app-dev',
    name: 'Application Development',
    inProgress: 12,
    blocked: 2,
    avgAge: 4.5,
    throughputTrend: 'up',
    throughputChange: 15,
    bottleneck: 'API dependency delays',
    progressPercent: 68,
    color: 'blue',
    owner: 'K. Liu',
    items: [
      { id: 'APP-234', title: 'User profile data model updates', status: 'in-progress', age: 3, owner: 'K. Liu', milestone: 'M1 Auth Release', priority: 'high' },
      { id: 'APP-235', title: 'Session management refactor', status: 'blocked', age: 8, owner: 'S. Patel', milestone: 'M1 Auth Release', priority: 'high' },
      { id: 'APP-236', title: 'Role-based access control logic', status: 'in-progress', age: 2, owner: 'M. Chen', milestone: 'M1 Auth Release', priority: 'medium' },
      { id: 'APP-237', title: 'OAuth callback handlers', status: 'in-progress', age: 5, owner: 'K. Liu', milestone: 'M1 Auth Release', priority: 'medium' },
      { id: 'APP-238', title: 'Error handling improvements', status: 'waiting', age: 6, owner: 'T. Johnson', milestone: 'M1 Auth Release', priority: 'low' },
    ],
  },
  {
    id: 'api',
    name: 'API Integration',
    inProgress: 8,
    blocked: 4,
    avgAge: 7.2,
    throughputTrend: 'down',
    throughputChange: -12,
    bottleneck: 'Vendor API downtime',
    progressPercent: 52,
    color: 'purple',
    owner: 'S. Patel',
    items: [
      { id: 'API-156', title: 'SSO vendor integration', status: 'blocked', age: 12, owner: 'S. Patel', milestone: 'M1 Auth Release', priority: 'high' },
      { id: 'API-157', title: 'Token refresh endpoint', status: 'in-progress', age: 4, owner: 'R. Kim', milestone: 'M1 Auth Release', priority: 'high' },
      { id: 'API-158', title: 'User sync API', status: 'blocked', age: 9, owner: 'S. Patel', milestone: 'M1 Auth Release', priority: 'high' },
      { id: 'API-159', title: 'Rate limiting implementation', status: 'in-progress', age: 6, owner: 'M. Davis', milestone: 'M1 Auth Release', priority: 'medium' },
    ],
  },
  {
    id: 'qa',
    name: 'QA & Testing',
    inProgress: 15,
    blocked: 1,
    avgAge: 3.8,
    throughputTrend: 'up',
    throughputChange: 22,
    bottleneck: 'Test data provisioning',
    progressPercent: 71,
    color: 'green',
    owner: 'QA Lead',
    items: [
      { id: 'QA-445', title: 'Auth flow regression testing', status: 'in-progress', age: 2, owner: 'T. Anderson', milestone: 'M1 Auth Release', priority: 'high' },
      { id: 'QA-446', title: 'Security penetration tests', status: 'in-progress', age: 4, owner: 'J. Wilson', milestone: 'M2 ATO Package', priority: 'high' },
      { id: 'QA-447', title: 'Performance load testing', status: 'waiting', age: 5, owner: 'T. Anderson', milestone: 'M3 Cutover', priority: 'medium' },
      { id: 'QA-448', title: 'Cross-browser compatibility', status: 'in-progress', age: 3, owner: 'L. Martinez', milestone: 'M1 Auth Release', priority: 'medium' },
      { id: 'QA-449', title: 'API contract validation', status: 'blocked', age: 7, owner: 'J. Wilson', milestone: 'M1 Auth Release', priority: 'high' },
    ],
  },
  {
    id: 'security',
    name: 'Security & ATO',
    inProgress: 9,
    blocked: 6,
    avgAge: 9.5,
    throughputTrend: 'down',
    throughputChange: -8,
    bottleneck: 'CISO approval delays',
    progressPercent: 45,
    color: 'orange',
    owner: 'J. Martinez',
    items: [
      { id: 'SEC-678', title: 'Security control assessment', status: 'blocked', age: 15, owner: 'J. Martinez', milestone: 'M2 ATO Package', priority: 'high' },
      { id: 'SEC-679', title: 'Vulnerability scan remediation', status: 'in-progress', age: 8, owner: 'S. Chen', milestone: 'M2 ATO Package', priority: 'high' },
      { id: 'SEC-680', title: 'STIG compliance verification', status: 'blocked', age: 12, owner: 'J. Martinez', milestone: 'M2 ATO Package', priority: 'high' },
      { id: 'SEC-681', title: 'ATO package documentation', status: 'in-progress', age: 6, owner: 'Compliance Lead', milestone: 'M2 ATO Package', priority: 'high' },
      { id: 'SEC-682', title: 'ISSO review prep', status: 'waiting', age: 10, owner: 'S. Chen', milestone: 'M2 ATO Package', priority: 'medium' },
    ],
  },
  {
    id: 'infra',
    name: 'Infrastructure & Deploy',
    inProgress: 10,
    blocked: 3,
    avgAge: 6.1,
    throughputTrend: 'flat',
    throughputChange: 0,
    bottleneck: 'Cloud provisioning approvals',
    progressPercent: 58,
    color: 'indigo',
    owner: 'DevOps Team',
    items: [
      { id: 'INFRA-890', title: 'Production environment setup', status: 'blocked', age: 10, owner: 'DevOps Team', milestone: 'M3 Cutover', priority: 'high' },
      { id: 'INFRA-891', title: 'Load balancer configuration', status: 'waiting', age: 7, owner: 'Network Team', milestone: 'M3 Cutover', priority: 'high' },
      { id: 'INFRA-892', title: 'Database migration scripts', status: 'in-progress', age: 4, owner: 'K. Liu', milestone: 'M3 Cutover', priority: 'high' },
      { id: 'INFRA-893', title: 'Monitoring & alerting setup', status: 'in-progress', age: 5, owner: 'DevOps Team', milestone: 'M3 Cutover', priority: 'medium' },
      { id: 'INFRA-894', title: 'Backup & recovery testing', status: 'blocked', age: 9, owner: 'DevOps Team', milestone: 'M3 Cutover', priority: 'medium' },
    ],
  },
];

const handoffStages = [
  { id: 'dev', name: 'Development', waiting: 2, avgWait: 1.5, color: 'blue' },
  { id: 'qa', name: 'QA Review', waiting: 5, avgWait: 3.2, color: 'green' },
  { id: 'security', name: 'Security', waiting: 8, avgWait: 7.5, color: 'orange' },
  { id: 'deploy', name: 'Deploy', waiting: 3, avgWait: 2.1, color: 'indigo' },
];

export function WorkstreamExecutionScreen() {
  const navigate = useNavigate();
  const [selectedWorkstream, setSelectedWorkstream] = useState<WorkstreamData | null>(workstreams[3]); // Default to Security
  const [viewMode, setViewMode] = useState<'summary' | 'detailed'>('summary');

  const totalInProgress = workstreams.reduce((acc, ws) => acc + ws.inProgress, 0);
  const totalBlocked = workstreams.reduce((acc, ws) => acc + ws.blocked, 0);
  const agingItems = workstreams.reduce((acc, ws) => acc + ws.items.filter(i => i.age > 7).length, 0);
  const handoffDelays = handoffStages.reduce((acc, stage) => acc + stage.waiting, 0);
  const forecastRisks = workstreams.filter(ws => ws.blocked > 2 || ws.avgAge > 7).length;

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="w-[1440px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl text-gray-900">Workstream Execution</h1>
              <div className="text-sm text-gray-600 mt-1">Cross-lane delivery tracking</div>
            </div>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-4 gap-3">
            <FilterButton label="Date Range" value="Last 7 days" />
            <FilterButton label="Milestone" value="All Milestones" />
            <FilterButton label="Workstream" value="All Workstreams" />
            <FilterButton label="Owner" value="All Owners" />
          </div>
        </div>
      </header>

      <main className="w-[1440px] mx-auto px-6 py-6 space-y-6">
        {/* Summary Cards Row */}
        <div className="grid grid-cols-5 gap-4">
          <SummaryCard
            label="Total In Progress"
            value={totalInProgress}
            icon={Package}
            color="blue"
            trend={null}
          />
          <SummaryCard
            label="Blocked Items"
            value={totalBlocked}
            icon={AlertCircle}
            color="red"
            trend={null}
            highlight={totalBlocked > 10}
          />
          <SummaryCard
            label="Aging Items"
            value={agingItems}
            icon={Clock}
            color="yellow"
            trend={null}
            subtitle=">7 days old"
            highlight={agingItems > 5}
          />
          <SummaryCard
            label="Handoff Delays"
            value={handoffDelays}
            icon={ArrowRight}
            color="orange"
            trend={null}
            subtitle="waiting for next stage"
            highlight={handoffDelays > 15}
          />
          <SummaryCard
            label="Forecast Risk"
            value={forecastRisks}
            icon={TrendingDown}
            color="red"
            trend={null}
            subtitle="workstreams at risk"
            highlight={forecastRisks > 2}
          />
        </div>

        {/* View Toggle */}
        <div className="flex items-center justify-between">
          <h2 className="text-gray-900">Workstreams</h2>
          <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-lg">
            <button
              onClick={() => setViewMode('summary')}
              className={`px-3 py-1.5 rounded text-sm transition-colors ${
                viewMode === 'summary' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              Summary View
            </button>
            <button
              onClick={() => setViewMode('detailed')}
              className={`px-3 py-1.5 rounded text-sm transition-colors ${
                viewMode === 'detailed' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              Detailed List
            </button>
          </div>
        </div>

        {/* Workstream Cards */}
        <div className="grid grid-cols-1 gap-4">
          {workstreams.map((workstream) => (
            <WorkstreamCard
              key={workstream.id}
              workstream={workstream}
              isSelected={selectedWorkstream?.id === workstream.id}
              onClick={() => setSelectedWorkstream(workstream)}
              viewMode={viewMode}
            />
          ))}
        </div>

        {/* Handoff Flow Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-gray-900 mb-4">Handoff Flow & Wait States</h2>
          <div className="flex items-center gap-4">
            {handoffStages.map((stage, index) => (
              <div key={stage.id} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className={`p-4 bg-${stage.color}-50 border-2 ${
                    stage.waiting > 5 ? 'border-red-300' : `border-${stage.color}-200`
                  } rounded-lg`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm text-gray-900 font-medium">{stage.name}</div>
                      {stage.waiting > 5 && (
                        <AlertCircle className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="text-xs text-gray-500">Items Waiting</div>
                        <div className={`text-2xl ${stage.waiting > 5 ? 'text-red-600' : 'text-gray-900'}`}>
                          {stage.waiting}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Avg Wait Time</div>
                        <div className={`text-lg ${stage.avgWait > 5 ? 'text-orange-600' : 'text-gray-700'}`}>
                          {stage.avgWait}d
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {index < handoffStages.length - 1 && (
                  <ArrowRight className="w-6 h-6 text-gray-400 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>

          {/* Bottleneck Alert */}
          <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="w-4 h-4 text-orange-600" />
              <span className="text-sm text-gray-900 font-medium">Primary Bottleneck Detected</span>
            </div>
            <div className="text-sm text-gray-700">
              <strong>Security stage</strong> has 8 items waiting with an average wait time of 7.5 days. 
              This is impacting <strong>M2 ATO Package</strong> delivery timeline.
            </div>
          </div>
        </div>
      </main>

      {/* Side Panel - Workstream Detail */}
      {selectedWorkstream && (
        <div className="fixed right-0 top-0 h-full w-[480px] bg-white border-l border-gray-200 shadow-xl overflow-y-auto">
          <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg text-gray-900">{selectedWorkstream.name}</h2>
              <button
                onClick={() => setSelectedWorkstream(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="w-4 h-4" />
              <span>{selectedWorkstream.owner}</span>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-xs text-gray-600 mb-1">In Progress</div>
                <div className="text-2xl text-gray-900">{selectedWorkstream.inProgress}</div>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <div className="text-xs text-gray-600 mb-1">Blocked</div>
                <div className="text-2xl text-red-600">{selectedWorkstream.blocked}</div>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <div className="text-xs text-gray-600 mb-1">Avg Age</div>
                <div className="text-2xl text-gray-900">{selectedWorkstream.avgAge}d</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-xs text-gray-600 mb-1">Progress</div>
                <div className="text-2xl text-gray-900">{selectedWorkstream.progressPercent}%</div>
              </div>
            </div>

            {/* Top Bottleneck */}
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle className="w-4 h-4 text-orange-600" />
                <span className="text-xs text-gray-600 font-medium">TOP BOTTLENECK</span>
              </div>
              <div className="text-sm text-gray-900">{selectedWorkstream.bottleneck}</div>
            </div>

            {/* Top Items */}
            <div>
              <h3 className="text-sm text-gray-900 mb-3">Top Items ({selectedWorkstream.items.length})</h3>
              <div className="space-y-2">
                {selectedWorkstream.items.map((item) => {
                  const statusConfig = {
                    'in-progress': { bg: 'bg-blue-100', text: 'text-blue-700', label: 'In Progress' },
                    'blocked': { bg: 'bg-red-100', text: 'text-red-700', label: 'Blocked' },
                    'waiting': { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Waiting' },
                    'review': { bg: 'bg-purple-100', text: 'text-purple-700', label: 'In Review' },
                  };
                  const status = statusConfig[item.status];

                  return (
                    <div
                      key={item.id}
                      className={`p-3 border rounded-lg ${
                        item.status === 'blocked' || item.age > 7
                          ? 'bg-red-50 border-red-200'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-900 font-mono">{item.id}</span>
                        <div className="flex items-center gap-2">
                          {item.age > 7 && (
                            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {item.age}d
                            </span>
                          )}
                          <span className={`px-2 py-0.5 text-xs rounded ${status.bg} ${status.text}`}>
                            {status.label}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-900 mb-2">{item.title}</div>
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>{item.owner}</span>
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded">
                          {item.milestone.replace('M1 ', '').replace('M2 ', '').replace('M3 ', '')}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Owner Load */}
            <div>
              <h3 className="text-sm text-gray-900 mb-3">Owner Load</h3>
              <div className="space-y-2">
                {Array.from(new Set(selectedWorkstream.items.map(i => i.owner))).map((owner) => {
                  const ownerItems = selectedWorkstream.items.filter(i => i.owner === owner);
                  const blocked = ownerItems.filter(i => i.status === 'blocked').length;
                  
                  return (
                    <div key={owner} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">
                          {owner.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-sm text-gray-900">{owner}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600">{ownerItems.length} items</span>
                        {blocked > 0 && (
                          <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded">
                            {blocked} blocked
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Next Actions */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-sm text-gray-900 mb-2">Recommended Next Actions</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                {selectedWorkstream.blocked > 2 && (
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Escalate {selectedWorkstream.blocked} blocked items to unblock workstream</span>
                  </li>
                )}
                {selectedWorkstream.avgAge > 7 && (
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Review aging items (avg {selectedWorkstream.avgAge} days) with team leads</span>
                  </li>
                )}
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Address primary bottleneck: {selectedWorkstream.bottleneck}</span>
                </li>
                {selectedWorkstream.throughputTrend === 'down' && (
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Schedule retrospective to address {Math.abs(selectedWorkstream.throughputChange)}% throughput decline</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper Components
function FilterButton({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="text-xs text-gray-500 block mb-1">{label}</label>
      <button className="w-full px-3 py-2 border border-gray-300 bg-white rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-between">
        <span>{value}</span>
        <ChevronRight className="w-4 h-4 text-gray-400 rotate-90" />
      </button>
    </div>
  );
}

function SummaryCard({ 
  label, 
  value, 
  icon: Icon, 
  color, 
  trend, 
  subtitle,
  highlight 
}: { 
  label: string; 
  value: number; 
  icon: any; 
  color: string; 
  trend: number | null;
  subtitle?: string;
  highlight?: boolean;
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    red: 'bg-red-50 text-red-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    orange: 'bg-orange-50 text-orange-600',
    green: 'bg-green-50 text-green-600',
  };

  return (
    <div className={`bg-white border-2 rounded-lg p-4 ${
      highlight ? 'border-red-300 bg-red-50' : 'border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend !== null && (
          <div className={`flex items-center gap-1 text-xs ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <div className="text-3xl text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
      {subtitle && <div className="text-xs text-gray-500 mt-1">{subtitle}</div>}
    </div>
  );
}

function WorkstreamCard({ 
  workstream, 
  isSelected, 
  onClick,
  viewMode 
}: { 
  workstream: WorkstreamData; 
  isSelected: boolean; 
  onClick: () => void;
  viewMode: 'summary' | 'detailed';
}) {
  const trendIcon = workstream.throughputTrend === 'up' ? TrendingUp : 
                    workstream.throughputTrend === 'down' ? TrendingDown : Minus;
  const TrendIcon = trendIcon;

  if (viewMode === 'summary') {
    return (
      <button
        onClick={onClick}
        className={`bg-white border-2 rounded-lg p-5 text-left transition-all hover:shadow-md ${
          isSelected ? 'border-blue-500 shadow-md' : 'border-gray-200'
        } ${workstream.blocked > 2 || workstream.avgAge > 7 ? 'bg-orange-50 border-orange-300' : ''}`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-1 h-12 bg-${workstream.color}-600 rounded`} />
            <div>
              <h3 className="text-gray-900 mb-1">{workstream.name}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="w-3.5 h-3.5" />
                <span>{workstream.owner}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-xs text-gray-500 mb-1">Throughput</div>
              <div className={`flex items-center gap-1 ${
                workstream.throughputTrend === 'up' ? 'text-green-600' : 
                workstream.throughputTrend === 'down' ? 'text-red-600' : 'text-gray-600'
              }`}>
                <TrendIcon className="w-4 h-4" />
                <span className="text-sm">{Math.abs(workstream.throughputChange)}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-4">
          <div>
            <div className="text-xs text-gray-500 mb-1">In Progress</div>
            <div className="text-xl text-gray-900">{workstream.inProgress}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">Blocked</div>
            <div className={`text-xl ${workstream.blocked > 2 ? 'text-red-600' : 'text-gray-900'}`}>
              {workstream.blocked}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">Avg Age</div>
            <div className={`text-xl ${workstream.avgAge > 7 ? 'text-orange-600' : 'text-gray-900'}`}>
              {workstream.avgAge}d
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">Progress</div>
            <div className="text-xl text-gray-900">{workstream.progressPercent}%</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`bg-${workstream.color}-600 h-2 rounded-full transition-all`}
              style={{ width: `${workstream.progressPercent}%` }}
            />
          </div>
        </div>

        {/* Bottleneck */}
        {(workstream.blocked > 2 || workstream.avgAge > 7) && (
          <div className="flex items-center gap-2 p-3 bg-orange-100 border border-orange-200 rounded">
            <AlertCircle className="w-4 h-4 text-orange-600 flex-shrink-0" />
            <span className="text-sm text-gray-900">
              <strong>Bottleneck:</strong> {workstream.bottleneck}
            </span>
          </div>
        )}
      </button>
    );
  }

  // Detailed view
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={onClick}
        className={`w-full p-4 text-left transition-colors ${
          isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-1 h-8 bg-${workstream.color}-600 rounded`} />
            <h3 className="text-gray-900">{workstream.name}</h3>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <span className="text-gray-600">{workstream.inProgress} in progress</span>
            <span className={workstream.blocked > 2 ? 'text-red-600' : 'text-gray-600'}>
              {workstream.blocked} blocked
            </span>
            <span className={workstream.avgAge > 7 ? 'text-orange-600' : 'text-gray-600'}>
              {workstream.avgAge}d avg
            </span>
          </div>
        </div>
      </button>
      
      {isSelected && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="space-y-2">
            {workstream.items.slice(0, 3).map((item) => (
              <div key={item.id} className="p-3 bg-white border border-gray-200 rounded">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-600 font-mono">{item.id}</span>
                  <span className={`px-2 py-0.5 text-xs rounded ${
                    item.status === 'blocked' ? 'bg-red-100 text-red-700' :
                    item.status === 'waiting' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <div className="text-sm text-gray-900">{item.title}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
