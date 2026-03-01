import { Calendar, AlertTriangle } from 'lucide-react';

interface Milestone {
  id: string;
  name: string;
  status: 'on-track' | 'at-risk' | 'off-track';
  percentComplete: number;
  openRisks: number;
  forecastDelta: string;
  targetDate: string;
}

const milestones: Milestone[] = [
  {
    id: 'auth',
    name: 'Auth Release',
    status: 'on-track',
    percentComplete: 87,
    openRisks: 1,
    forecastDelta: 'On schedule',
    targetDate: 'Mar 15',
  },
  {
    id: 'ato',
    name: 'ATO Package',
    status: 'at-risk',
    percentComplete: 64,
    openRisks: 4,
    forecastDelta: '+3 days',
    targetDate: 'Mar 22',
  },
  {
    id: 'cutover',
    name: 'Cutover',
    status: 'at-risk',
    percentComplete: 42,
    openRisks: 6,
    forecastDelta: '+5 days',
    targetDate: 'Apr 5',
  },
  {
    id: 'prod',
    name: 'Production Release',
    status: 'on-track',
    percentComplete: 28,
    openRisks: 2,
    forecastDelta: 'On schedule',
    targetDate: 'Apr 19',
  },
];

const statusConfig = {
  'on-track': {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-700',
    badgeBg: 'bg-green-100',
    badgeText: 'text-green-700',
    label: 'On Track',
  },
  'at-risk': {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-700',
    badgeBg: 'bg-yellow-100',
    badgeText: 'text-yellow-700',
    label: 'At Risk',
  },
  'off-track': {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-700',
    badgeBg: 'bg-red-100',
    badgeText: 'text-red-700',
    label: 'Off Track',
  },
};

interface MilestoneCardsProps {
  selectedMilestone: string | null;
  onSelectMilestone: (id: string | null) => void;
}

export function MilestoneCards({ selectedMilestone, onSelectMilestone }: MilestoneCardsProps) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {milestones.map((milestone) => {
        const config = statusConfig[milestone.status];
        const isSelected = selectedMilestone === milestone.id;
        
        return (
          <button
            key={milestone.id}
            onClick={() => onSelectMilestone(isSelected ? null : milestone.id)}
            className={`bg-white border-2 rounded-lg p-4 text-left transition-all hover:shadow-md ${
              isSelected ? 'border-blue-500 shadow-md' : 'border-gray-200'
            }`}
          >
            {/* Status Badge */}
            <div className="flex items-center justify-between mb-3">
              <span className={`px-2 py-1 rounded text-xs ${config.badgeBg} ${config.badgeText}`}>
                {config.label}
              </span>
              {milestone.openRisks > 0 && (
                <div className="flex items-center gap-1 text-orange-600">
                  <AlertTriangle className="w-3 h-3" />
                  <span className="text-xs">{milestone.openRisks}</span>
                </div>
              )}
            </div>

            {/* Milestone Name */}
            <h3 className="text-gray-900 mb-3">{milestone.name}</h3>

            {/* Progress Bar */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500">Progress</span>
                <span className="text-xs text-gray-700">{milestone.percentComplete}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${milestone.percentComplete}%` }}
                />
              </div>
            </div>

            {/* Forecast */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-gray-500">
                <Calendar className="w-3 h-3" />
                <span>{milestone.targetDate}</span>
              </div>
              <span className={milestone.forecastDelta === 'On schedule' ? 'text-green-600' : 'text-orange-600'}>
                {milestone.forecastDelta}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
