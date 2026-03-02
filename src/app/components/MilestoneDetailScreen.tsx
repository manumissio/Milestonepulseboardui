import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ChevronRight, Calendar, TrendingUp, AlertTriangle, CheckCircle2, ArrowUpRight, ArrowDownRight, FileText, MessageSquare, Bell } from 'lucide-react';
import { BlockerDetailDrawer } from './BlockerDetailDrawer';

// Milestone data mapping
const milestoneData: Record<string, any> = {
  ato: {
    id: 'M2',
    name: 'ATO Package',
    description: 'Authority to Operate (ATO) package submission and approval',
    status: 'at-risk',
    percentComplete: 64,
    openRisks: 4,
    confidenceScore: 68,
    targetDate: 'Mar 22, 2026',
    forecastDate: 'Mar 25, 2026',
    forecastDelta: '+3 days slip',
  },
  auth: {
    id: 'M1',
    name: 'Auth Release',
    description: 'Authentication and authorization system deployment',
    status: 'on-track',
    percentComplete: 87,
    openRisks: 1,
    confidenceScore: 92,
    targetDate: 'Mar 15, 2026',
    forecastDate: 'Mar 15, 2026',
    forecastDelta: 'On schedule',
  },
  cutover: {
    id: 'M3',
    name: 'Cutover',
    description: 'Production environment cutover and migration',
    status: 'at-risk',
    percentComplete: 42,
    openRisks: 6,
    confidenceScore: 58,
    targetDate: 'Apr 5, 2026',
    forecastDate: 'Apr 10, 2026',
    forecastDelta: '+5 days slip',
  },
  prod: {
    id: 'M4',
    name: 'Production Release',
    description: 'Full production release and go-live',
    status: 'on-track',
    percentComplete: 28,
    openRisks: 2,
    confidenceScore: 85,
    targetDate: 'Apr 19, 2026',
    forecastDate: 'Apr 19, 2026',
    forecastDelta: 'On schedule',
  },
};

export function MilestoneDetailScreen() {
  const navigate = useNavigate();
  const { milestoneId } = useParams();
  const [selectedBlocker, setSelectedBlocker] = useState<string | null>(null);
  const [expandedChanges, setExpandedChanges] = useState<string[]>([]);

  // Get milestone data or default to ATO
  const milestone = milestoneData[milestoneId || 'ato'] || milestoneData.ato;
  const statusColor = milestone.status === 'on-track' ? 'green' : milestone.status === 'at-risk' ? 'yellow' : 'red';

  const toggleChange = (id: string) => {
    setExpandedChanges(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Header with Breadcrumb */}
      <header className="bg-white border-b border-gray-200">
        <div className="w-[1440px] mx-auto px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <button 
              onClick={() => navigate('/')}
              className="hover:text-blue-600 transition-colors"
            >
              Dashboard
            </button>
            <ChevronRight className="w-4 h-4" />
            <button 
              onClick={() => navigate('/')}
              className="hover:text-blue-600 transition-colors"
            >
              Milestones
            </button>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900">{milestone.id} {milestone.name}</span>
          </div>
          <h1 className="text-2xl text-gray-900">{milestone.id} {milestone.name}</h1>
        </div>
      </header>

      <main className="w-[1440px] mx-auto px-6 py-6 space-y-6">
        {/* Milestone Summary Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-3 py-1.5 bg-${statusColor}-100 text-${statusColor}-700 rounded`}>
                  {milestone.status === 'on-track' ? 'On Track' : milestone.status === 'at-risk' ? 'At Risk' : 'Off Track'}
                </span>
                {milestone.openRisks > 0 && (
                  <div className="flex items-center gap-2 text-orange-600">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm">{milestone.openRisks} open risks</span>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-600">
                {milestone.description}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 mb-1">Confidence Score</div>
              <div className={`text-3xl text-${statusColor}-600`}>{milestone.confidenceScore}%</div>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-4 gap-6">
            <div>
              <div className="text-sm text-gray-500 mb-1">Progress</div>
              <div className="flex items-end gap-2">
                <div className="text-2xl text-gray-900">{milestone.percentComplete}%</div>
                <div className="text-sm text-gray-500 mb-0.5">complete</div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${milestone.percentComplete}%` }} />
              </div>
            </div>
            
            <div>
              <div className="text-sm text-gray-500 mb-1">Target Date</div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <div className="text-lg text-gray-900">{milestone.targetDate}</div>
              </div>
              <div className="text-sm text-gray-500 mt-1">3 weeks</div>
            </div>

            <div>
              <div className="text-sm text-gray-500 mb-1">Forecast Date</div>
              <div className="flex items-center gap-2">
                <Calendar className={`w-4 h-4 ${milestone.forecastDelta === 'On schedule' ? 'text-green-500' : 'text-orange-500'}`} />
                <div className={`text-lg ${milestone.forecastDelta === 'On schedule' ? 'text-green-600' : 'text-orange-600'}`}>
                  {milestone.forecastDate}
                </div>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <span className={`text-sm ${milestone.forecastDelta === 'On schedule' ? 'text-green-600' : 'text-orange-600'}`}>
                  {milestone.forecastDelta}
                </span>
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-500 mb-1">Forecast Drivers</div>
              {milestone.status !== 'on-track' ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <div className="w-1 h-4 bg-red-500 rounded" />
                    <span>Security scan approval</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <div className="w-1 h-4 bg-orange-500 rounded" />
                    <span>Documentation review</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>All tasks on track</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - 2/3 width */}
          <div className="col-span-2 space-y-6">
            {/* Progress by Workstream */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-gray-900 mb-4">Progress by Workstream</h2>
              <div className="space-y-4">
                <WorkstreamProgress
                  name="Application Development"
                  progress={72}
                  total={18}
                  completed={13}
                  inProgress={3}
                  blocked={2}
                  color="bg-blue-600"
                />
                <WorkstreamProgress
                  name="Quality Assurance"
                  progress={65}
                  total={15}
                  completed={10}
                  inProgress={2}
                  blocked={3}
                  color="bg-green-600"
                />
                <WorkstreamProgress
                  name="Security & Compliance"
                  progress={58}
                  total={12}
                  completed={7}
                  inProgress={3}
                  blocked={2}
                  color="bg-orange-600"
                />
                <WorkstreamProgress
                  name="Infrastructure"
                  progress={80}
                  total={8}
                  completed={6}
                  inProgress={2}
                  blocked={0}
                  color="bg-teal-600"
                />
                <WorkstreamProgress
                  name="Vendor Coordination"
                  progress={45}
                  total={9}
                  completed={4}
                  inProgress={2}
                  blocked={3}
                  color="bg-purple-600"
                />
              </div>
            </div>

            {/* Dependency Summary */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-gray-900 mb-4">Dependencies</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <ArrowDownRight className="w-4 h-4 text-blue-600" />
                    <h3 className="text-sm text-gray-700">Upstream (We depend on)</h3>
                  </div>
                  <div className="space-y-2">
                    <DependencyItem
                      title="M1 Auth Release"
                      status="completed"
                      date="Mar 15"
                    />
                    <DependencyItem
                      title="Security scan tools setup"
                      status="completed"
                      date="Feb 28"
                    />
                    <DependencyItem
                      title="CISO office availability"
                      status="at-risk"
                      date="Mar 18"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <ArrowUpRight className="w-4 h-4 text-purple-600" />
                    <h3 className="text-sm text-gray-700">Downstream (Depends on us)</h3>
                  </div>
                  <div className="space-y-2">
                    <DependencyItem
                      title="M3 Cutover"
                      status="on-track"
                      date="Apr 5"
                    />
                    <DependencyItem
                      title="Production Release"
                      status="on-track"
                      date="Apr 19"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Changes */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-gray-900 mb-4">Recent Changes (Since Last Report)</h2>
              <div className="space-y-3">
                <ChangeItem
                  id="ch1"
                  date="Mar 1, 2:45 PM"
                  type="risk"
                  title="Forecast slip increased from +1 day to +3 days"
                  details="Security scan approval delay and additional documentation requirements identified during ISSO review."
                  isExpanded={expandedChanges.includes('ch1')}
                  onToggle={() => toggleChange('ch1')}
                />
                <ChangeItem
                  id="ch2"
                  date="Feb 29, 4:20 PM"
                  type="progress"
                  title="Progress increased from 58% to 64%"
                  details="Completed 6 security control documentation items. Evidence collection for access controls and audit logging finalized."
                  isExpanded={expandedChanges.includes('ch2')}
                  onToggle={() => toggleChange('ch2')}
                />
                <ChangeItem
                  id="ch3"
                  date="Feb 28, 11:30 AM"
                  type="blocker"
                  title="New blocker: Test data masking tool license expired"
                  details="QA team unable to generate compliant test datasets for security testing. Procurement working on renewal."
                  isExpanded={expandedChanges.includes('ch3')}
                  onToggle={() => toggleChange('ch3')}
                />
              </div>
            </div>

            {/* Decisions / Escalations Needed */}
            <div className="bg-white border border-red-200 rounded-lg p-6 bg-red-50/30">
              <div className="flex items-center gap-2 mb-4">
                <Bell className="w-5 h-5 text-red-600" />
                <h2 className="text-gray-900">Decisions / Escalations Needed</h2>
              </div>
              <div className="space-y-3">
                <EscalationItem
                  priority="high"
                  title="CISO approval needed for security scan results"
                  description="Submitted Feb 17, awaiting review. 12 days elapsed. Meeting requested with program sponsor."
                  dueDate="Mar 3"
                  owner="J. Martinez"
                />
                <EscalationItem
                  priority="medium"
                  title="Additional security documentation scope"
                  description="ISSO requested 8 additional control narratives not in original scope. Need approval to adjust timeline or descope."
                  dueDate="Mar 5"
                  owner="Security Lead"
                />
              </div>
            </div>
          </div>

          {/* Right Column - Top Blockers */}
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-gray-900">Top Blockers</h2>
                <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded">4</span>
              </div>
              <div className="space-y-3">
                <BlockerCard
                  id="b1"
                  title="CISO security scan approval pending"
                  owner="J. Martinez"
                  age={12}
                  severity="high"
                  nextAction="Escalate to program sponsor"
                  onSelect={setSelectedBlocker}
                />
                <BlockerCard
                  id="b2"
                  title="Test data masking tool license expired"
                  owner="QA Lead"
                  age={3}
                  severity="medium"
                  nextAction="Procurement in progress"
                  onSelect={setSelectedBlocker}
                />
                <BlockerCard
                  id="b3"
                  title="Documentation review backlog at ISSO"
                  owner="S. Chen"
                  age={7}
                  severity="medium"
                  nextAction="Schedule review meeting"
                  onSelect={setSelectedBlocker}
                />
                <BlockerCard
                  id="b4"
                  title="Pen test scheduling conflict"
                  owner="Security Team"
                  age={4}
                  severity="low"
                  nextAction="Coordinate with vendor"
                  onSelect={setSelectedBlocker}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Last updated: Mar 1, 2026 at 2:45 PM
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-sm">Add PM Note</span>
                </div>
              </button>
              <button className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm">Escalate Blocker</span>
                </div>
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm">Generate Milestone Summary</span>
                </div>
              </button>
              <button className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Export
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Blocker Detail Drawer */}
      {selectedBlocker && (
        <BlockerDetailDrawer
          blockerId={selectedBlocker}
          onClose={() => setSelectedBlocker(null)}
        />
      )}
    </div>
  );
}

// Workstream Progress Component
function WorkstreamProgress({
  name,
  progress,
  total,
  completed,
  inProgress,
  blocked,
  color,
}: {
  name: string;
  progress: number;
  total: number;
  completed: number;
  inProgress: number;
  blocked: number;
  color: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-1 h-10 rounded ${color}`} />
          <div>
            <h3 className="text-sm text-gray-900">{name}</h3>
            <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
              <span>{completed}/{total} complete</span>
              <span className="text-blue-600">{inProgress} in progress</span>
              {blocked > 0 && (
                <span className="text-red-600 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  {blocked} blocked
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="text-sm text-gray-900">{progress}%</div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className={`${color} h-2 rounded-full`} style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

// Dependency Item Component
function DependencyItem({
  title,
  status,
  date,
}: {
  title: string;
  status: 'completed' | 'on-track' | 'at-risk';
}) {
  const statusConfig = {
    completed: { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100' },
    'on-track': { icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-100' },
    'at-risk': { icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-100' },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className="flex items-center gap-2 p-2 border border-gray-200 rounded bg-white">
      <div className={`p-1 rounded ${config.bg}`}>
        <Icon className={`w-3 h-3 ${config.color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm text-gray-900 truncate">{title}</div>
        <div className="text-xs text-gray-500">{date}</div>
      </div>
    </div>
  );
}

// Change Item Component
function ChangeItem({
  id,
  date,
  type,
  title,
  details,
  isExpanded,
  onToggle,
}: {
  id: string;
  date: string;
  type: 'risk' | 'progress' | 'blocker';
  title: string;
  details: string;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const typeConfig = {
    risk: { icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50', rotate: 'rotate-180' },
    progress: { icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50', rotate: '' },
    blocker: { icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50', rotate: '' },
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div className="border border-gray-200 rounded-lg p-3 hover:border-blue-400 transition-colors">
      <button onClick={onToggle} className="w-full text-left">
        <div className="flex items-start gap-3">
          <div className={`p-1.5 rounded ${config.bg} flex-shrink-0`}>
            <Icon className={`w-3.5 h-3.5 ${config.color} ${config.rotate}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <p className="text-sm text-gray-900">{title}</p>
              <span className="text-xs text-gray-500 whitespace-nowrap">{date}</span>
            </div>
            {isExpanded && (
              <p className="text-sm text-gray-600 leading-relaxed mt-2">{details}</p>
            )}
          </div>
        </div>
      </button>
      {!isExpanded && (
        <button onClick={onToggle} className="text-xs text-blue-600 mt-2 ml-11 hover:text-blue-700">
          Show details
        </button>
      )}
    </div>
  );
}

// Escalation Item Component
function EscalationItem({
  priority,
  title,
  description,
  dueDate,
  owner,
}: {
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  dueDate: string;
  owner: string;
}) {
  const priorityConfig = {
    high: { bg: 'bg-red-100', text: 'text-red-700' },
    medium: { bg: 'bg-orange-100', text: 'text-orange-700' },
    low: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  };

  const config = priorityConfig[priority];

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4">
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="text-sm text-gray-900 flex-1">{title}</h3>
        <span className={`px-2 py-0.5 rounded text-xs flex-shrink-0 ${config.bg} ${config.text}`}>
          {priority.toUpperCase()}
        </span>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed mb-3">{description}</p>
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-500">Owner: {owner}</span>
        <span className="text-gray-500">Due: {dueDate}</span>
      </div>
    </div>
  );
}

// Blocker Card Component
function BlockerCard({
  id,
  title,
  owner,
  age,
  severity,
  nextAction,
  onSelect,
}: {
  id: string;
  title: string;
  owner: string;
  age: number;
  severity: 'high' | 'medium' | 'low';
  nextAction: string;
  onSelect: (id: string) => void;
}) {
  const severityConfig = {
    high: { bg: 'bg-red-100', text: 'text-red-700' },
    medium: { bg: 'bg-orange-100', text: 'text-orange-700' },
    low: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  };

  const config = severityConfig[severity];

  return (
    <button
      onClick={() => onSelect(id)}
      className="w-full border border-gray-200 rounded-lg p-3 hover:border-blue-400 hover:bg-blue-50/30 transition-all text-left"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-sm text-gray-900 leading-snug flex-1">{title}</p>
        <span className={`px-2 py-0.5 rounded text-xs flex-shrink-0 ${config.bg} ${config.text}`}>
          {severity}
        </span>
      </div>
      <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
        <span>{owner}</span>
        <span>•</span>
        <span>{age} days</span>
      </div>
      <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
        Next: {nextAction}
      </div>
    </button>
  );
}