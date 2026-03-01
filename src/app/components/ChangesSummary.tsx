import { ChevronDown, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

interface Change {
  id: string;
  date: string;
  type: 'progress' | 'risk' | 'blocker' | 'completed';
  title: string;
  details?: string;
}

const changes: Change[] = [
  {
    id: 'c1',
    date: 'Mar 1, 11:30 AM',
    type: 'completed',
    title: 'Auth Release - OAuth2 integration tests passed',
    details: 'All 48 integration test cases completed successfully. Ready for security review.',
  },
  {
    id: 'c2',
    date: 'Mar 1, 9:15 AM',
    type: 'blocker',
    title: 'New blocker: Database migration script failing on staging',
    details: 'Issue identified in data migration logic. Team investigating root cause.',
  },
  {
    id: 'c3',
    date: 'Feb 29, 4:20 PM',
    type: 'progress',
    title: 'ATO Package progress increased from 58% to 64%',
    details: '6 security controls documented and evidence collected this week.',
  },
  {
    id: 'c4',
    date: 'Feb 29, 2:45 PM',
    type: 'risk',
    title: 'Cutover forecast delta changed from +3 days to +5 days',
    details: 'Infrastructure provisioning delays impacting downstream tasks.',
  },
  {
    id: 'c5',
    date: 'Feb 28, 3:10 PM',
    type: 'completed',
    title: 'API Integration - 12 endpoints deployed to staging',
    details: 'Customer profile, authentication, and notification APIs now available for testing.',
  },
];

const typeConfig = {
  progress: {
    icon: TrendingUp,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  risk: {
    icon: TrendingDown,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
  },
  blocker: {
    icon: AlertTriangle,
    color: 'text-red-600',
    bg: 'bg-red-50',
  },
  completed: {
    icon: CheckCircle2,
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
};

interface ChangesSummaryProps {
  selectedMilestone: string | null;
}

export function ChangesSummary({ selectedMilestone }: ChangesSummaryProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-gray-900">What Changed Since Last Report</h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <span className="text-sm text-gray-700">{isExpanded ? 'Collapse' : 'Expand'}</span>
          <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <div className="space-y-3">
        {(isExpanded ? changes : changes.slice(0, 3)).map((change, index) => {
          const config = typeConfig[change.type];
          const Icon = config.icon;

          return (
            <div
              key={change.id}
              className="flex gap-4 pb-3 border-b border-gray-100 last:border-0"
            >
              {/* Timeline Marker */}
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full ${config.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-4 h-4 ${config.color}`} />
                </div>
                {index < (isExpanded ? changes.length - 1 : Math.min(3, changes.length) - 1) && (
                  <div className="w-px h-full bg-gray-200 mt-2" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pt-0.5">
                <div className="flex items-start justify-between gap-3 mb-1">
                  <p className="text-sm text-gray-900">{change.title}</p>
                  <span className="text-xs text-gray-500 whitespace-nowrap">{change.date}</span>
                </div>
                {change.details && (
                  <p className="text-sm text-gray-600 leading-relaxed">{change.details}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {!isExpanded && changes.length > 3 && (
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full mt-3 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
        >
          Show {changes.length - 3} more changes
        </button>
      )}
    </div>
  );
}
