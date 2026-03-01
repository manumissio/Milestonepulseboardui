import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface Workstream {
  id: string;
  name: string;
  progress: number;
  total: number;
  completed: number;
  blocked: number;
  color: string;
}

const workstreams: Workstream[] = [
  {
    id: 'app-dev',
    name: 'Application Development',
    progress: 76,
    total: 45,
    completed: 34,
    blocked: 2,
    color: 'bg-blue-600',
  },
  {
    id: 'api',
    name: 'API Integration',
    progress: 82,
    total: 28,
    completed: 23,
    blocked: 1,
    color: 'bg-purple-600',
  },
  {
    id: 'qa',
    name: 'Quality Assurance',
    progress: 68,
    total: 34,
    completed: 23,
    blocked: 3,
    color: 'bg-green-600',
  },
  {
    id: 'security',
    name: 'Security & Compliance',
    progress: 58,
    total: 19,
    completed: 11,
    blocked: 2,
    color: 'bg-orange-600',
  },
  {
    id: 'infra',
    name: 'Infrastructure',
    progress: 71,
    total: 22,
    completed: 16,
    blocked: 1,
    color: 'bg-teal-600',
  },
];

interface WorkstreamPanelProps {
  selectedMilestone: string | null;
  filters: any;
}

export function WorkstreamPanel({ selectedMilestone, filters }: WorkstreamPanelProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-gray-900">Workstream Progress</h2>
        {selectedMilestone && (
          <span className="text-sm text-gray-500 bg-blue-50 px-3 py-1 rounded">
            Filtered by milestone
          </span>
        )}
      </div>

      <div className="space-y-5">
        {workstreams.map((workstream) => (
          <div key={workstream.id} className="space-y-2">
            {/* Workstream Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-1 h-12 rounded ${workstream.color}`} />
                <div>
                  <h3 className="text-sm text-gray-900">{workstream.name}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-500">
                      {workstream.completed}/{workstream.total} items
                    </span>
                    {workstream.blocked > 0 && (
                      <div className="flex items-center gap-1 text-red-600">
                        <AlertCircle className="w-3 h-3" />
                        <span className="text-xs">{workstream.blocked} blocked</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-900">{workstream.progress}%</div>
                <div className="text-xs text-gray-500">complete</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-100 rounded-full h-3">
              <div
                className={`${workstream.color} h-3 rounded-full transition-all`}
                style={{ width: `${workstream.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl text-gray-900">148</div>
            <div className="text-xs text-gray-500">Total Items</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span className="text-2xl text-gray-900">107</span>
            </div>
            <div className="text-xs text-gray-500">Completed</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-2xl text-gray-900">9</span>
            </div>
            <div className="text-xs text-gray-500">Blocked</div>
          </div>
        </div>
      </div>
    </div>
  );
}
