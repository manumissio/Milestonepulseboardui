import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronDown, Filter, CheckCircle2, AlertTriangle, TrendingUp, TrendingDown, Calendar, Clock, ArrowRight, Plus, Minus, Copy, Download, FileText, Sparkles } from 'lucide-react';

interface TimelineEntry {
  id: string;
  timestamp: string;
  date: string;
  type: 'completed' | 'new-blocker' | 'resolved-blocker' | 'forecast-change' | 'risk-change' | 'milestone-update' | 'dependency-added';
  title: string;
  details: string;
  technicalDetails?: string;
  milestone: string;
  workstream: string;
  owner: string;
  impact: 'positive' | 'negative' | 'neutral';
  diffType?: 'added' | 'removed' | 'changed';
  oldValue?: string;
  newValue?: string;
}

const timelineData: TimelineEntry[] = [
  // Today - Mar 1, 2026
  {
    id: 'CHG-001',
    timestamp: '11:45 AM',
    date: 'Mar 1, 2026',
    type: 'completed',
    title: 'OAuth callback implementation completed',
    details: 'Core authentication flow now complete and tested',
    technicalDetails: 'APP-237: OAuth callback handlers implemented with token refresh and error handling',
    milestone: 'M1 Auth Release',
    workstream: 'Application Development',
    owner: 'K. Liu',
    impact: 'positive',
    diffType: 'added',
  },
  {
    id: 'CHG-002',
    timestamp: '10:30 AM',
    date: 'Mar 1, 2026',
    type: 'new-blocker',
    title: 'Production database migration failing on staging',
    details: 'Migration scripts encountering data type conflicts, blocking cutover prep',
    technicalDetails: 'INFRA-892: PostgreSQL migration script v2.3 failing on TIMESTAMP conversion',
    milestone: 'M3 Cutover',
    workstream: 'Infrastructure & Deploy',
    owner: 'K. Liu',
    impact: 'negative',
    diffType: 'added',
  },
  {
    id: 'CHG-003',
    timestamp: '9:15 AM',
    date: 'Mar 1, 2026',
    type: 'forecast-change',
    title: 'M2 ATO Package forecast slipped +3 days',
    details: 'Security scan approval delays pushing milestone delivery to Mar 25',
    milestone: 'M2 ATO Package',
    workstream: 'Security & ATO',
    owner: 'J. Martinez',
    impact: 'negative',
    diffType: 'changed',
    oldValue: 'Mar 22, 2026',
    newValue: 'Mar 25, 2026',
  },
  
  // Yesterday - Feb 29, 2026
  {
    id: 'CHG-004',
    timestamp: '4:20 PM',
    date: 'Feb 29, 2026',
    type: 'resolved-blocker',
    title: 'SSO vendor API restored',
    details: 'Vendor completed maintenance, API integration testing resumed',
    technicalDetails: 'BLK-003: Vendor resolved DNS routing issue affecting API gateway',
    milestone: 'M1 Auth Release',
    workstream: 'API Integration',
    owner: 'S. Patel',
    impact: 'positive',
    diffType: 'removed',
  },
  {
    id: 'CHG-005',
    timestamp: '2:45 PM',
    date: 'Feb 29, 2026',
    type: 'completed',
    title: 'Security penetration testing completed',
    details: 'All critical and high findings remediated, final report submitted',
    technicalDetails: 'QA-446: Completed OWASP Top 10 testing with zero critical findings',
    milestone: 'M2 ATO Package',
    workstream: 'QA & Testing',
    owner: 'J. Wilson',
    impact: 'positive',
    diffType: 'added',
  },
  {
    id: 'CHG-006',
    timestamp: '11:00 AM',
    date: 'Feb 29, 2026',
    type: 'risk-change',
    title: 'M1 Auth Release risk reduced to LOW',
    details: 'Major integration work completed, only minor bugs remaining',
    milestone: 'M1 Auth Release',
    workstream: 'Application Development',
    owner: 'K. Liu',
    impact: 'positive',
    diffType: 'changed',
    oldValue: 'MEDIUM',
    newValue: 'LOW',
  },

  // Feb 28, 2026
  {
    id: 'CHG-007',
    timestamp: '3:30 PM',
    date: 'Feb 28, 2026',
    type: 'new-blocker',
    title: 'CISO security scan approval delayed',
    details: 'CISO office backlog delaying ATO package review by 3+ days',
    technicalDetails: 'BLK-001: Security control assessment SC-7, SC-8, SC-13 pending CISO signature',
    milestone: 'M2 ATO Package',
    workstream: 'Security & ATO',
    owner: 'J. Martinez',
    impact: 'negative',
    diffType: 'added',
  },
  {
    id: 'CHG-008',
    timestamp: '1:15 PM',
    date: 'Feb 28, 2026',
    type: 'completed',
    title: 'Load balancer configuration approved by CAB',
    details: 'Change Advisory Board approved production network changes',
    technicalDetails: 'BLK-005: CAB-2026-0234 approved with implementation window Mar 4-5',
    milestone: 'M3 Cutover',
    workstream: 'Infrastructure & Deploy',
    owner: 'Network Team',
    impact: 'positive',
    diffType: 'added',
  },
  {
    id: 'CHG-009',
    timestamp: '10:00 AM',
    date: 'Feb 28, 2026',
    type: 'dependency-added',
    title: 'New dependency: FedRAMP compliance gap analysis',
    details: 'Agency requested additional FedRAMP Moderate controls documentation',
    technicalDetails: 'COMP-346: Controls AC-2(1), AC-2(3), AC-2(5) require additional evidence',
    milestone: 'M2 ATO Package',
    workstream: 'Security & ATO',
    owner: 'Compliance Lead',
    impact: 'negative',
    diffType: 'added',
  },

  // Feb 27, 2026
  {
    id: 'CHG-010',
    timestamp: '5:00 PM',
    date: 'Feb 27, 2026',
    type: 'completed',
    title: 'Role-based access control implementation finished',
    details: 'User permission matrix implemented and unit tested',
    technicalDetails: 'APP-236: RBAC middleware with 5 role types and 23 permission granularities',
    milestone: 'M1 Auth Release',
    workstream: 'Application Development',
    owner: 'M. Chen',
    impact: 'positive',
    diffType: 'added',
  },
  {
    id: 'CHG-011',
    timestamp: '2:30 PM',
    date: 'Feb 27, 2026',
    type: 'resolved-blocker',
    title: 'Test data masking tool license renewed',
    details: 'Procurement completed, QA team can resume security testing',
    technicalDetails: 'BLK-004: License procurement PO-2026-1156 completed',
    milestone: 'M2 ATO Package',
    workstream: 'Quality Assurance',
    owner: 'QA Lead',
    impact: 'positive',
    diffType: 'removed',
  },
  {
    id: 'CHG-012',
    timestamp: '11:30 AM',
    date: 'Feb 27, 2026',
    type: 'forecast-change',
    title: 'M1 Auth Release forecast improved to on-schedule',
    details: 'Critical path work accelerated, milestone back on track',
    milestone: 'M1 Auth Release',
    workstream: 'Application Development',
    owner: 'K. Liu',
    impact: 'positive',
    diffType: 'changed',
    oldValue: 'Mar 17, 2026 (+2 days)',
    newValue: 'Mar 15, 2026 (on schedule)',
  },
];

const changeTypeCounts = {
  completed: timelineData.filter(e => e.type === 'completed').length,
  newBlockers: timelineData.filter(e => e.type === 'new-blocker').length,
  resolvedBlockers: timelineData.filter(e => e.type === 'resolved-blocker').length,
  forecastChanges: timelineData.filter(e => e.type === 'forecast-change').length,
  riskChanges: timelineData.filter(e => e.type === 'risk-change').length,
};

export function ChangeTimelineScreen() {
  const navigate = useNavigate();
  const [selectedView, setSelectedView] = useState('since-last-pmr');
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const [selectedEntries, setSelectedEntries] = useState<string[]>(['CHG-001', 'CHG-004', 'CHG-005', 'CHG-007']);
  const [filters, setFilters] = useState({
    milestone: 'all',
    workstream: 'all',
    owner: 'all',
    changeType: 'all',
  });

  const toggleEntry = (id: string) => {
    setSelectedEntries(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const groupedTimeline = timelineData.reduce((acc, entry) => {
    if (!acc[entry.date]) {
      acc[entry.date] = [];
    }
    acc[entry.date].push(entry);
    return acc;
  }, {} as Record<string, TimelineEntry[]>);

  const selectedEntriesData = timelineData.filter(e => selectedEntries.includes(e.id));

  const typeConfig = {
    completed: { icon: CheckCircle2, bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', label: 'Completed' },
    'new-blocker': { icon: AlertTriangle, bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', label: 'New Blocker' },
    'resolved-blocker': { icon: CheckCircle2, bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', label: 'Resolved' },
    'forecast-change': { icon: TrendingDown, bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', label: 'Forecast Change' },
    'risk-change': { icon: AlertTriangle, bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', label: 'Risk Change' },
    'milestone-update': { icon: Calendar, bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', label: 'Milestone Update' },
    'dependency-added': { icon: Plus, bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', label: 'New Dependency' },
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="w-[1440px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl text-gray-900">Change Timeline</h1>
              <div className="text-sm text-gray-600 mt-1">What changed since last report</div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>

          {/* Saved View Selector */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm text-gray-600">View:</span>
            <ViewSelector
              options={[
                { value: 'since-last-pmr', label: 'Since Last PMR (Feb 26)' },
                { value: 'last-7-days', label: 'Last 7 Days' },
                { value: 'since-milestone', label: 'Since Milestone Review' },
                { value: 'custom', label: 'Custom Range' },
              ]}
              value={selectedView}
              onChange={setSelectedView}
            />
            <button className="ml-auto flex items-center gap-2 px-3 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
              <Filter className="w-4 h-4" />
              Save Current View
            </button>
          </div>

          {/* Filter Bar */}
          <div className="grid grid-cols-4 gap-3">
            <FilterDropdown label="Milestone" value={filters.milestone} onChange={(v) => setFilters({...filters, milestone: v})} />
            <FilterDropdown label="Workstream" value={filters.workstream} onChange={(v) => setFilters({...filters, workstream: v})} />
            <FilterDropdown label="Owner" value={filters.owner} onChange={(v) => setFilters({...filters, owner: v})} />
            <FilterDropdown label="Change Type" value={filters.changeType} onChange={(v) => setFilters({...filters, changeType: v})} />
          </div>
        </div>
      </header>

      <main className="w-[1440px] mx-auto px-6 py-4">
        {/* Summary Strip */}
        <div className="grid grid-cols-5 gap-3 mb-4">
          <ChangeCountCard
            label="Completed Work"
            count={changeTypeCounts.completed}
            icon={CheckCircle2}
            color="green"
          />
          <ChangeCountCard
            label="New Blockers"
            count={changeTypeCounts.newBlockers}
            icon={AlertTriangle}
            color="red"
            highlight={changeTypeCounts.newBlockers > 0}
          />
          <ChangeCountCard
            label="Resolved Blockers"
            count={changeTypeCounts.resolvedBlockers}
            icon={CheckCircle2}
            color="blue"
          />
          <ChangeCountCard
            label="Forecast Changes"
            count={changeTypeCounts.forecastChanges}
            icon={TrendingDown}
            color="orange"
            highlight={changeTypeCounts.forecastChanges > 0}
          />
          <ChangeCountCard
            label="Risk Level Changes"
            count={changeTypeCounts.riskChanges}
            icon={AlertTriangle}
            color="yellow"
          />
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Main Timeline Feed */}
          <div className="col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-gray-900">Timeline</h2>
              <button
                onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  showTechnicalDetails
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {showTechnicalDetails ? 'Hide' : 'Show'} Technical Details
              </button>
            </div>

            {/* Grouped Timeline */}
            {Object.entries(groupedTimeline).map(([date, entries]) => (
              <div key={date} className="space-y-3">
                {/* Date Header */}
                <div className="flex items-center gap-3">
                  <div className="text-sm text-gray-900 font-medium">{date}</div>
                  <div className="flex-1 h-px bg-gray-200" />
                  <div className="text-xs text-gray-500">{entries.length} changes</div>
                </div>

                {/* Timeline Entries */}
                <div className="space-y-2">
                  {entries.map((entry) => {
                    const config = typeConfig[entry.type];
                    const Icon = config.icon;
                    const isSelected = selectedEntries.includes(entry.id);

                    return (
                      <button
                        key={entry.id}
                        onClick={() => toggleEntry(entry.id)}
                        className={`w-full text-left p-4 border-2 rounded-lg transition-all ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50 shadow-sm'
                            : `${config.border} ${config.bg} hover:shadow-sm`
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {/* Checkbox */}
                          <div className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center ${
                            isSelected
                              ? 'bg-blue-600 border-blue-600'
                              : 'bg-white border-gray-300'
                          }`}>
                            {isSelected && (
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>

                          {/* Icon */}
                          <div className={`mt-0.5 p-2 rounded-lg ${config.bg}`}>
                            <Icon className={`w-4 h-4 ${config.text}`} />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className={`px-2 py-0.5 text-xs rounded ${config.bg} ${config.text}`}>
                                    {config.label}
                                  </span>
                                  {entry.diffType && (
                                    <DiffBadge type={entry.diffType} />
                                  )}
                                </div>
                                <h3 className="text-sm text-gray-900 font-medium mb-1">{entry.title}</h3>
                                <p className="text-sm text-gray-700">{entry.details}</p>
                                
                                {showTechnicalDetails && entry.technicalDetails && (
                                  <p className="text-xs text-gray-600 mt-2 font-mono bg-white px-2 py-1 rounded border border-gray-200">
                                    {entry.technicalDetails}
                                  </p>
                                )}

                                {/* Diff Values */}
                                {entry.oldValue && entry.newValue && (
                                  <div className="mt-2 flex items-center gap-2 text-sm">
                                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded line-through">
                                      {entry.oldValue}
                                    </span>
                                    <ArrowRight className="w-4 h-4 text-gray-400" />
                                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded font-medium">
                                      {entry.newValue}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="text-xs text-gray-500 whitespace-nowrap">
                                {entry.timestamp}
                              </div>
                            </div>

                            {/* Metadata */}
                            <div className="flex items-center gap-3 text-xs text-gray-600">
                              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded">
                                {entry.milestone}
                              </span>
                              <span>{entry.workstream}</span>
                              <span>•</span>
                              <span>{entry.owner}</span>
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Right Panel - Summary Draft */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 h-fit sticky top-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-gray-900">Change Summary Draft</h2>
              <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                <Sparkles className="w-3 h-3" />
                <span>{selectedEntries.length} selected</span>
              </div>
            </div>

            {selectedEntries.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">
                <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p>Select timeline entries to add them to your summary</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Progress & Wins */}
                {selectedEntriesData.some(e => e.type === 'completed' || e.impact === 'positive') && (
                  <div>
                    <h3 className="text-sm text-gray-900 font-medium mb-2">Progress & Wins</h3>
                    <ul className="space-y-2">
                      {selectedEntriesData
                        .filter(e => e.type === 'completed' || (e.type === 'resolved-blocker'))
                        .map(entry => (
                          <li key={entry.id} className="flex items-start gap-2 text-sm text-gray-700">
                            <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>
                              <strong>{entry.milestone}:</strong> {entry.details}
                            </span>
                          </li>
                        ))}
                    </ul>
                  </div>
                )}

                {/* Issues & Blockers */}
                {selectedEntriesData.some(e => e.type === 'new-blocker' || e.impact === 'negative') && (
                  <div>
                    <h3 className="text-sm text-gray-900 font-medium mb-2">Issues & Blockers</h3>
                    <ul className="space-y-2">
                      {selectedEntriesData
                        .filter(e => e.type === 'new-blocker' || (e.type === 'forecast-change' && e.impact === 'negative'))
                        .map(entry => (
                          <li key={entry.id} className="flex items-start gap-2 text-sm text-gray-700">
                            <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                            <span>
                              <strong>{entry.milestone}:</strong> {entry.details}
                            </span>
                          </li>
                        ))}
                    </ul>
                  </div>
                )}

                {/* Forecast Changes */}
                {selectedEntriesData.some(e => e.type === 'forecast-change') && (
                  <div>
                    <h3 className="text-sm text-gray-900 font-medium mb-2">Schedule Changes</h3>
                    <ul className="space-y-2">
                      {selectedEntriesData
                        .filter(e => e.type === 'forecast-change')
                        .map(entry => (
                          <li key={entry.id} className="flex items-start gap-2 text-sm text-gray-700">
                            <TrendingDown className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                            <span>
                              <strong>{entry.milestone}:</strong> {entry.details}
                            </span>
                          </li>
                        ))}
                    </ul>
                  </div>
                )}

                {/* Risk Changes */}
                {selectedEntriesData.some(e => e.type === 'risk-change') && (
                  <div>
                    <h3 className="text-sm text-gray-900 font-medium mb-2">Risk Level Changes</h3>
                    <ul className="space-y-2">
                      {selectedEntriesData
                        .filter(e => e.type === 'risk-change')
                        .map(entry => (
                          <li key={entry.id} className="flex items-start gap-2 text-sm text-gray-700">
                            {entry.impact === 'positive' ? (
                              <TrendingUp className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            ) : (
                              <TrendingDown className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                            )}
                            <span>
                              <strong>{entry.milestone}:</strong> {entry.details}
                            </span>
                          </li>
                        ))}
                    </ul>
                  </div>
                )}

                {/* Actions */}
                <div className="pt-4 border-t border-gray-200 space-y-2">
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm">Generate PM Summary</span>
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    <FileText className="w-4 h-4" />
                    <span className="text-sm">Generate Client Summary</span>
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      <Copy className="w-4 h-4" />
                      <span className="text-sm">Copy</span>
                    </button>
                    <button className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      <Download className="w-4 h-4" />
                      <span className="text-sm">Export</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// Helper Components
function ViewSelector({ options, value, onChange }: { options: { value: string; label: string }[]; value: string; onChange: (v: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const selected = options.find(o => o.value === value);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <span>{selected?.label}</span>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[200px]">
          {options.map(option => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                option.value === value ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterDropdown({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-xs text-gray-500 block mb-1">{label}</label>
      <button className="w-full px-3 py-2 border border-gray-300 bg-white rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-between">
        <span>{value === 'all' ? 'All' : value}</span>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>
    </div>
  );
}

function ChangeCountCard({ 
  label, 
  count, 
  icon: Icon, 
  color, 
  highlight 
}: { 
  label: string; 
  count: number; 
  icon: any; 
  color: string; 
  highlight?: boolean;
}) {
  const colorClasses = {
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
    blue: 'bg-blue-50 text-blue-600',
    orange: 'bg-orange-50 text-orange-600',
    yellow: 'bg-yellow-50 text-yellow-600',
  };

  return (
    <div className={`bg-white border-2 rounded-lg p-4 ${
      highlight ? 'border-red-300 bg-red-50' : 'border-gray-200'
    }`}>
      <div className={`p-2 rounded-lg w-fit mb-3 ${colorClasses[color as keyof typeof colorClasses]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="text-3xl text-gray-900 mb-1">{count}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
}

function DiffBadge({ type }: { type: 'added' | 'removed' | 'changed' }) {
  const config = {
    added: { icon: Plus, bg: 'bg-green-100', text: 'text-green-700', label: 'Added' },
    removed: { icon: Minus, bg: 'bg-red-100', text: 'text-red-700', label: 'Removed' },
    changed: { icon: ArrowRight, bg: 'bg-orange-100', text: 'text-orange-700', label: 'Changed' },
  };

  const c = config[type];
  const Icon = c.icon;

  return (
    <span className={`flex items-center gap-1 px-2 py-0.5 text-xs rounded ${c.bg} ${c.text}`}>
      <Icon className="w-3 h-3" />
      {c.label}
    </span>
  );
}