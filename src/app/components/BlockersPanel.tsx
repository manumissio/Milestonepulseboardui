import { AlertTriangle, ExternalLink, Clock, Filter, Eye, AlertOctagon } from 'lucide-react';

interface Blocker {
  id: string;
  title: string;
  owner: string;
  age: number;
  impact: 'high' | 'medium' | 'low';
  type: 'external' | 'internal';
  milestones: string[];
  workstreams: string[];
  status: 'watch' | 'escalate' | 'active';
}

const blockers: Blocker[] = [
  {
    id: 'b1',
    title: 'ATO security scan approval pending from CISO office',
    owner: 'J. Martinez',
    age: 12,
    impact: 'high',
    type: 'external',
    milestones: ['ATO Package', 'Cutover'],
    workstreams: ['Security & Compliance'],
    status: 'escalate',
  },
  {
    id: 'b2',
    title: 'Production environment provisioning delayed',
    owner: 'DevOps Team',
    age: 8,
    impact: 'high',
    type: 'external',
    milestones: ['Cutover', 'Production Release'],
    workstreams: ['Infrastructure'],
    status: 'escalate',
  },
  {
    id: 'b3',
    title: 'SSO integration vendor API not responding',
    owner: 'S. Patel',
    age: 5,
    impact: 'medium',
    type: 'external',
    milestones: ['Auth Release'],
    workstreams: ['Application Development', 'API Integration'],
    status: 'watch',
  },
  {
    id: 'b4',
    title: 'Test data masking tool license expired',
    owner: 'QA Lead',
    age: 3,
    impact: 'medium',
    type: 'internal',
    milestones: ['ATO Package'],
    workstreams: ['Quality Assurance'],
    status: 'active',
  },
  {
    id: 'b5',
    title: 'Load balancer config approval stuck in CAB queue',
    owner: 'Network Team',
    age: 6,
    impact: 'medium',
    type: 'external',
    milestones: ['Cutover'],
    workstreams: ['Infrastructure'],
    status: 'watch',
  },
  {
    id: 'b6',
    title: 'Database migration script failing on staging',
    owner: 'K. Liu',
    age: 2,
    impact: 'high',
    type: 'internal',
    milestones: ['Auth Release'],
    workstreams: ['Application Development'],
    status: 'active',
  },
];

const impactConfig = {
  high: { bg: 'bg-red-100', text: 'text-red-700', label: 'High' },
  medium: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Medium' },
  low: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Low' },
};

interface BlockersPanelProps {
  selectedMilestone: string | null;
  filters: any;
  onSelectBlocker: (id: string) => void;
  onFiltersChange: (filters: any) => void;
}

export function BlockersPanel({ selectedMilestone, filters, onSelectBlocker, onFiltersChange }: BlockersPanelProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <h2 className="text-gray-900">Blockers & Dependencies</h2>
          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded">{blockers.length}</span>
        </div>
        <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <Filter className="w-4 h-4 text-gray-600" />
          <span className="text-sm text-gray-700">Filter</span>
        </button>
      </div>

      <div className="space-y-3 max-h-[500px] overflow-y-auto">
        {blockers.map((blocker) => {
          const impactStyle = impactConfig[blocker.impact];
          
          return (
            <button
              key={blocker.id}
              onClick={() => onSelectBlocker(blocker.id)}
              className="w-full border border-gray-200 rounded-lg p-4 hover:border-blue-400 hover:bg-blue-50/30 transition-all text-left"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {blocker.type === 'external' ? (
                      <ExternalLink className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5 text-orange-600 flex-shrink-0" />
                    )}
                    <span className="text-xs text-gray-500 uppercase">{blocker.type}</span>
                  </div>
                  <p className="text-sm text-gray-900 leading-snug">{blocker.title}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs flex-shrink-0 ${impactStyle.bg} ${impactStyle.text}`}>
                  {impactStyle.label}
                </span>
              </div>

              {/* Owner and Age */}
              <div className="flex items-center gap-4 mb-3">
                <span className="text-xs text-gray-600">{blocker.owner}</span>
                <div className="flex items-center gap-1 text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span className="text-xs">{blocker.age} days</span>
                </div>
              </div>

              {/* Milestones */}
              <div className="flex items-center gap-2 flex-wrap mb-3">
                {blocker.milestones.map((milestone) => (
                  <span
                    key={milestone}
                    className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded"
                  >
                    {milestone}
                  </span>
                ))}
              </div>

              {/* Action Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {blocker.status === 'escalate' && (
                    <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs rounded">
                      <AlertOctagon className="w-3 h-3" />
                      Escalate
                    </span>
                  )}
                  {blocker.status === 'watch' && (
                    <span className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded">
                      <Eye className="w-3 h-3" />
                      Watch
                    </span>
                  )}
                </div>
                <span className="text-xs text-blue-600">View details →</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
