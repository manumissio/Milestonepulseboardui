import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronDown, ArrowUpDown, ExternalLink, AlertTriangle, Clock, User, Edit, Bell, MessageSquare, FileText, ArrowRight, CheckCircle2 } from 'lucide-react';

interface Blocker {
  id: string;
  title: string;
  owner: string;
  age: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: 'internal' | 'external' | 'security' | 'vendor' | 'gov-action';
  milestones: string[];
  workstream: string;
  nextAction: string;
  status: 'escalated' | 'watch' | 'active' | 'pending';
  created: string;
  dueDate?: string;
  impactedTasks: number;
  dependencies: string[];
}

const blockers: Blocker[] = [
  {
    id: 'BLK-001',
    title: 'CISO security scan approval pending',
    owner: 'J. Martinez',
    age: 12,
    severity: 'critical',
    type: 'gov-action',
    milestones: ['M2 ATO Package', 'M3 Cutover'],
    workstream: 'Security & Compliance',
    nextAction: 'Escalate to program sponsor',
    status: 'escalated',
    created: 'Feb 17, 2026',
    dueDate: 'Mar 3, 2026',
    impactedTasks: 6,
    dependencies: ['ATO-1234', 'ATO-1235', 'ATO-1236'],
  },
  {
    id: 'BLK-002',
    title: 'Production environment provisioning delayed',
    owner: 'DevOps Team',
    age: 8,
    severity: 'critical',
    type: 'external',
    milestones: ['M3 Cutover', 'M4 Production Release'],
    workstream: 'Infrastructure',
    nextAction: 'Coordinate with cloud team',
    status: 'escalated',
    created: 'Feb 21, 2026',
    dueDate: 'Mar 5, 2026',
    impactedTasks: 8,
    dependencies: ['INFRA-789', 'INFRA-790', 'INFRA-791'],
  },
  {
    id: 'BLK-003',
    title: 'SSO integration vendor API not responding',
    owner: 'S. Patel',
    age: 5,
    severity: 'high',
    type: 'vendor',
    milestones: ['M1 Auth Release'],
    workstream: 'API Integration',
    nextAction: 'Vendor support escalation',
    status: 'watch',
    created: 'Feb 24, 2026',
    impactedTasks: 3,
    dependencies: ['AUTH-234', 'AUTH-235'],
  },
  {
    id: 'BLK-004',
    title: 'Test data masking tool license expired',
    owner: 'QA Lead',
    age: 3,
    severity: 'medium',
    type: 'internal',
    milestones: ['M2 ATO Package'],
    workstream: 'Quality Assurance',
    nextAction: 'Procurement in progress',
    status: 'active',
    created: 'Feb 26, 2026',
    dueDate: 'Mar 3, 2026',
    impactedTasks: 4,
    dependencies: ['QA-567', 'QA-568', 'QA-569'],
  },
  {
    id: 'BLK-005',
    title: 'Load balancer config approval stuck in CAB',
    owner: 'Network Team',
    age: 6,
    severity: 'high',
    type: 'gov-action',
    milestones: ['M3 Cutover'],
    workstream: 'Infrastructure',
    nextAction: 'Schedule CAB review',
    status: 'watch',
    created: 'Feb 23, 2026',
    impactedTasks: 2,
    dependencies: ['NET-445', 'NET-446'],
  },
  {
    id: 'BLK-006',
    title: 'Database migration script failing on staging',
    owner: 'K. Liu',
    age: 2,
    severity: 'high',
    type: 'internal',
    milestones: ['M1 Auth Release'],
    workstream: 'Application Development',
    nextAction: 'Root cause analysis',
    status: 'active',
    created: 'Feb 27, 2026',
    impactedTasks: 5,
    dependencies: ['APP-123', 'APP-124', 'APP-125'],
  },
  {
    id: 'BLK-007',
    title: 'Security documentation review backlog',
    owner: 'S. Chen',
    age: 7,
    severity: 'medium',
    type: 'security',
    milestones: ['M2 ATO Package'],
    workstream: 'Security & Compliance',
    nextAction: 'Schedule ISSO review meeting',
    status: 'watch',
    created: 'Feb 22, 2026',
    impactedTasks: 3,
    dependencies: ['SEC-789', 'SEC-790'],
  },
  {
    id: 'BLK-008',
    title: 'FedRAMP compliance gap analysis incomplete',
    owner: 'Compliance Lead',
    age: 4,
    severity: 'medium',
    type: 'security',
    milestones: ['M2 ATO Package'],
    workstream: 'Security & Compliance',
    nextAction: 'Complete control mapping',
    status: 'active',
    created: 'Feb 25, 2026',
    impactedTasks: 2,
    dependencies: ['COMP-345', 'COMP-346'],
  },
];

export function BlockersTriageScreen() {
  const navigate = useNavigate();
  const [selectedBlocker, setSelectedBlocker] = useState<Blocker>(blockers[0]);
  const [sortBy, setSortBy] = useState<'severity' | 'age' | 'milestone'>('severity');
  const [filters, setFilters] = useState({
    milestone: 'all',
    workstream: 'all',
    owner: 'all',
    blockerType: 'all',
    severity: 'all',
    age: 'all',
  });

  const severityConfig = {
    critical: { bg: 'bg-red-100', text: 'text-red-700', order: 0 },
    high: { bg: 'bg-orange-100', text: 'text-orange-700', order: 1 },
    medium: { bg: 'bg-yellow-100', text: 'text-yellow-700', order: 2 },
    low: { bg: 'bg-blue-100', text: 'text-blue-700', order: 3 },
  };

  const statusConfig = {
    escalated: { bg: 'bg-red-100', text: 'text-red-700', icon: Bell, label: 'Escalated' },
    watch: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock, label: 'Watch' },
    active: { bg: 'bg-blue-100', text: 'text-blue-700', icon: ArrowRight, label: 'Active' },
    pending: { bg: 'bg-gray-100', text: 'text-gray-700', icon: Clock, label: 'Pending' },
  };

  const typeConfig = {
    'gov-action': { label: 'Gov Action', icon: ExternalLink },
    external: { label: 'External', icon: ExternalLink },
    vendor: { label: 'Vendor', icon: ExternalLink },
    security: { label: 'Security', icon: AlertTriangle },
    internal: { label: 'Internal', icon: User },
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="w-[1440px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl text-gray-900">Blockers & Dependencies Triage</h1>
              <div className="text-sm text-gray-600 mt-1">Week of Feb 24 – Mar 2, 2026</div>
            </div>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      <main className="w-[1440px] mx-auto px-6 py-6 space-y-6">
        {/* Filter Bar */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="grid grid-cols-6 gap-3">
            <FilterDropdown label="Milestone" value={filters.milestone} onChange={(v) => setFilters({...filters, milestone: v})} />
            <FilterDropdown label="Workstream" value={filters.workstream} onChange={(v) => setFilters({...filters, workstream: v})} />
            <FilterDropdown label="Owner" value={filters.owner} onChange={(v) => setFilters({...filters, owner: v})} />
            <FilterDropdown label="Blocker Type" value={filters.blockerType} onChange={(v) => setFilters({...filters, blockerType: v})} />
            <FilterDropdown label="Severity" value={filters.severity} onChange={(v) => setFilters({...filters, severity: v})} />
            <FilterDropdown label="Age" value={filters.age} onChange={(v) => setFilters({...filters, age: v})} />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-3 gap-6">
          {/* Left Panel - Blockers Table */}
          <div className="col-span-2 bg-white border border-gray-200 rounded-lg">
            {/* Table Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-gray-900">Active Blockers</h2>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">{blockers.length} total</span>
                  <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                    <ArrowUpDown className="w-3.5 h-3.5" />
                    Sort: {sortBy}
                  </button>
                </div>
              </div>
            </div>

            {/* Table Body */}
            <div className="overflow-y-auto max-h-[600px]">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0 border-b border-gray-200">
                  <tr>
                    <th className="text-left text-xs text-gray-600 px-4 py-3 w-24">ID</th>
                    <th className="text-left text-xs text-gray-600 px-4 py-3">Title</th>
                    <th className="text-left text-xs text-gray-600 px-4 py-3 w-32">Owner</th>
                    <th className="text-left text-xs text-gray-600 px-4 py-3 w-16">Age</th>
                    <th className="text-left text-xs text-gray-600 px-4 py-3 w-24">Severity</th>
                    <th className="text-left text-xs text-gray-600 px-4 py-3 w-28">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {blockers.map((blocker) => {
                    const isSelected = selectedBlocker.id === blocker.id;
                    const severity = severityConfig[blocker.severity];
                    const status = statusConfig[blocker.status];
                    const StatusIcon = status.icon;

                    return (
                      <tr
                        key={blocker.id}
                        onClick={() => setSelectedBlocker(blocker)}
                        className={`border-b border-gray-100 cursor-pointer transition-colors ${
                          isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
                        }`}
                      >
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-900 font-mono">{blocker.id}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-gray-900 leading-snug mb-1">{blocker.title}</div>
                          <div className="flex items-center gap-2">
                            {blocker.milestones.slice(0, 2).map((milestone, idx) => (
                              <span key={idx} className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded">
                                {milestone.replace('M1 ', '').replace('M2 ', '').replace('M3 ', '').replace('M4 ', '')}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-700">{blocker.owner}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-700">{blocker.age}d</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs ${severity.bg} ${severity.text}`}>
                            {blocker.severity}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${status.bg} ${status.text} w-fit`}>
                            <StatusIcon className="w-3 h-3" />
                            {status.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Panel - Blocker Detail Card */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 h-fit sticky top-6">
            <h2 className="text-gray-900 mb-4">Blocker Detail</h2>
            
            {selectedBlocker && (
              <div className="space-y-4">
                {/* ID and Type */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-gray-900 font-mono">{selectedBlocker.id}</span>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">
                      {typeConfig[selectedBlocker.type].label}
                    </span>
                  </div>
                  <h3 className="text-sm text-gray-900">{selectedBlocker.title}</h3>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 rounded">
                    <div className="text-xs text-gray-500 mb-1">Age</div>
                    <div className="text-lg text-gray-900">{selectedBlocker.age} days</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <div className="text-xs text-gray-500 mb-1">Tasks Blocked</div>
                    <div className="text-lg text-gray-900">{selectedBlocker.impactedTasks}</div>
                  </div>
                </div>

                {/* Severity */}
                <div>
                  <div className="text-xs text-gray-500 mb-2">Severity</div>
                  <span className={`px-3 py-1.5 rounded text-sm ${severityConfig[selectedBlocker.severity].bg} ${severityConfig[selectedBlocker.severity].text}`}>
                    {selectedBlocker.severity.toUpperCase()}
                  </span>
                </div>

                {/* Owner */}
                <div>
                  <div className="text-xs text-gray-500 mb-2">Owner</div>
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm">
                      {selectedBlocker.owner.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="text-sm text-gray-900">{selectedBlocker.owner}</span>
                  </div>
                </div>

                {/* Due Date */}
                {selectedBlocker.dueDate && (
                  <div>
                    <div className="text-xs text-gray-500 mb-2">Due Date</div>
                    <div className="text-sm text-gray-900">{selectedBlocker.dueDate}</div>
                  </div>
                )}

                {/* Next Action */}
                <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                  <div className="text-xs text-gray-500 mb-1">Next Action</div>
                  <div className="text-sm text-blue-700">{selectedBlocker.nextAction}</div>
                </div>

                {/* Impacted Milestones */}
                <div>
                  <div className="text-xs text-gray-500 mb-2">Impacted Milestones</div>
                  <div className="space-y-1">
                    {selectedBlocker.milestones.map((milestone) => (
                      <div key={milestone} className="px-3 py-2 bg-purple-100 text-purple-700 text-sm rounded">
                        {milestone}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Workstream */}
                <div>
                  <div className="text-xs text-gray-500 mb-2">Workstream</div>
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded">
                    <div className="w-1 h-6 bg-blue-600 rounded" />
                    <span className="text-sm text-gray-700">{selectedBlocker.workstream}</span>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="text-xs text-gray-500 mb-2">Quick Actions</div>
                  <div className="space-y-2">
                    <button className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
                      <Edit className="w-4 h-4" />
                      Assign Owner
                    </button>
                    <button className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Set Due Date
                    </button>
                    <button className="w-full px-3 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors flex items-center gap-2">
                      <Bell className="w-4 h-4" />
                      Escalate
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Dependency Chain Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-gray-900 mb-4">Dependency Chain for {selectedBlocker.id}</h2>
          
          <div className="flex items-center gap-4 overflow-x-auto pb-4">
            {/* Blocker Card */}
            <div className="flex-shrink-0 w-64 p-4 bg-red-50 border-2 border-red-300 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="text-xs text-red-700 font-medium">BLOCKER</span>
              </div>
              <div className="text-sm text-gray-900 font-medium mb-1">{selectedBlocker.id}</div>
              <div className="text-xs text-gray-700 leading-snug">{selectedBlocker.title}</div>
              <div className="mt-2 pt-2 border-t border-red-200">
                <div className="text-xs text-gray-600">Owner: {selectedBlocker.owner}</div>
                <div className="text-xs text-gray-600">Age: {selectedBlocker.age} days</div>
              </div>
            </div>

            {/* Arrow */}
            <ArrowRight className="flex-shrink-0 w-6 h-6 text-gray-400" />

            {/* Blocked Tasks */}
            <div className="flex items-center gap-4">
              {selectedBlocker.dependencies.slice(0, 3).map((depId, index) => (
                <div key={depId}>
                  <div className="flex-shrink-0 w-56 p-4 bg-gray-50 border border-gray-300 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full" />
                      <span className="text-xs text-gray-500 font-medium">BLOCKED TASK</span>
                    </div>
                    <div className="text-sm text-gray-900 font-medium mb-1">{depId}</div>
                    <div className="text-xs text-gray-700 leading-snug">
                      {index === 0 ? 'Complete security control assessment' : 
                       index === 1 ? 'Finalize ATO package documentation' :
                       'Prepare CISO brief'}
                    </div>
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <div className="text-xs text-gray-600">Workstream: {selectedBlocker.workstream}</div>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded">Blocked</span>
                      </div>
                    </div>
                  </div>
                  {index < 2 && <ArrowRight className="flex-shrink-0 w-6 h-6 text-gray-400 mx-4" />}
                </div>
              ))}
            </div>

            {/* Arrow */}
            {selectedBlocker.dependencies.length > 0 && (
              <>
                <ArrowRight className="flex-shrink-0 w-6 h-6 text-gray-400" />

                {/* Impacted Milestone */}
                <div className="flex-shrink-0 w-64 p-4 bg-purple-50 border-2 border-purple-300 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-purple-600" />
                    <span className="text-xs text-purple-700 font-medium">IMPACTED MILESTONE</span>
                  </div>
                  <div className="text-sm text-gray-900 font-medium mb-1">{selectedBlocker.milestones[0]}</div>
                  <div className="text-xs text-gray-700 leading-snug">
                    {selectedBlocker.impactedTasks} tasks blocked
                  </div>
                  <div className="mt-2 pt-2 border-t border-purple-200">
                    <div className="flex items-center gap-1">
                      <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded">At Risk</span>
                      <span className="text-xs text-gray-600">+3 days slip</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Summary */}
          <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="text-sm text-gray-900 mb-1">Impact Summary</div>
            <div className="text-sm text-gray-700">
              This blocker is blocking <strong>{selectedBlocker.impactedTasks} tasks</strong> across{' '}
              <strong>{selectedBlocker.milestones.length} milestone{selectedBlocker.milestones.length > 1 ? 's' : ''}</strong>.{' '}
              {selectedBlocker.status === 'escalated' ? 'Escalated to leadership.' : 'Requires immediate attention.'}
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Last updated: Mar 1, 2026 at 11:45 AM
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-sm">Add PM Note</span>
                </div>
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm">Create Report Snippet</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Filter Dropdown Component
function FilterDropdown({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-xs text-gray-500 block mb-1">{label}</label>
      <button className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-between">
        <span>{value === 'all' ? 'All' : value}</span>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>
    </div>
  );
}
