import { X, ExternalLink, Clock, AlertOctagon, Eye, CheckCircle2, Link, MessageSquare, User } from 'lucide-react';

interface BlockerDetailPanelProps {
  blockerId: string;
  onClose: () => void;
}

const blockerData: Record<string, any> = {
  b1: {
    title: 'ATO security scan approval pending from CISO office',
    type: 'external',
    owner: 'J. Martinez',
    age: 12,
    impact: 'high',
    status: 'escalate',
    description: 'Security vulnerability scan results submitted to CISO office for review on Feb 17. Still awaiting approval to proceed with ATO package finalization. Multiple follow-ups sent.',
    milestones: ['ATO Package', 'Cutover'],
    workstreams: ['Security & Compliance'],
    linkedItems: [
      { id: 'ATO-1234', title: 'Complete security control assessment', status: 'blocked' },
      { id: 'ATO-1235', title: 'Finalize ATO package documentation', status: 'blocked' },
      { id: 'SEC-456', title: 'Remediate critical vulnerabilities', status: 'completed' },
    ],
    dependencies: [
      { item: 'Environment security certification', blocking: 'ATO Package milestone' },
      { item: 'CISO approval signature', blocking: '3 downstream tasks' },
    ],
    notes: [
      { date: 'Mar 1, 9:00 AM', author: 'J. Martinez', text: 'Escalated to program sponsor. Meeting scheduled with CISO for Mar 3.' },
      { date: 'Feb 28, 2:30 PM', author: 'Security Lead', text: 'Sent third follow-up email. No response yet.' },
      { date: 'Feb 26, 11:15 AM', author: 'J. Martinez', text: 'Met with CISO deputy. Waiting for final review.' },
    ],
  },
  b2: {
    title: 'Production environment provisioning delayed',
    type: 'external',
    owner: 'DevOps Team',
    age: 8,
    impact: 'high',
    status: 'escalate',
    description: 'Cloud infrastructure team has not completed production environment setup. Required compute and storage resources are stuck in procurement approval chain.',
    milestones: ['Cutover', 'Production Release'],
    workstreams: ['Infrastructure'],
    linkedItems: [
      { id: 'INFRA-789', title: 'Provision production Kubernetes cluster', status: 'blocked' },
      { id: 'INFRA-790', title: 'Configure load balancers', status: 'blocked' },
      { id: 'INFRA-791', title: 'Set up monitoring stack', status: 'waiting' },
    ],
    dependencies: [
      { item: 'Cloud resource procurement', blocking: 'Infrastructure workstream' },
      { item: 'Network configuration approval', blocking: 'Cutover milestone' },
    ],
    notes: [
      { date: 'Mar 1, 10:30 AM', author: 'DevOps Lead', text: 'Procurement approved! Resources should be available by Mar 5.' },
      { date: 'Feb 27, 3:45 PM', author: 'K. Chen', text: 'Following up with finance on budget approval.' },
    ],
  },
  b3: {
    title: 'SSO integration vendor API not responding',
    type: 'external',
    owner: 'S. Patel',
    age: 5,
    impact: 'medium',
    status: 'watch',
    description: 'Third-party SSO provider API experiencing intermittent outages. Impacting authentication integration testing.',
    milestones: ['Auth Release'],
    workstreams: ['Application Development', 'API Integration'],
    linkedItems: [
      { id: 'AUTH-234', title: 'Complete SSO integration testing', status: 'blocked' },
      { id: 'AUTH-235', title: 'Document SSO flow', status: 'in-progress' },
    ],
    dependencies: [
      { item: 'Vendor API stability', blocking: 'Auth Release milestone' },
    ],
    notes: [
      { date: 'Mar 1, 8:15 AM', author: 'S. Patel', text: 'Vendor reports issue resolved. Will monitor for 24 hours.' },
      { date: 'Feb 28, 1:20 PM', author: 'S. Patel', text: 'Opened support ticket with vendor. Priority escalated.' },
    ],
  },
};

export function BlockerDetailPanel({ blockerId, onClose }: BlockerDetailPanelProps) {
  const blocker = blockerData[blockerId];
  
  if (!blocker) return null;

  const impactConfig = {
    high: { bg: 'bg-red-100', text: 'text-red-700', label: 'High Impact' },
    medium: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Medium Impact' },
    low: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Low Impact' },
  };

  const statusConfig = {
    blocked: { bg: 'bg-red-100', text: 'text-red-700' },
    waiting: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
    'in-progress': { bg: 'bg-blue-100', text: 'text-blue-700' },
    completed: { bg: 'bg-green-100', text: 'text-green-700' },
  };

  const impact = impactConfig[blocker.impact as keyof typeof impactConfig];

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
      />

      {/* Side Panel */}
      <div className="fixed top-0 right-0 h-full w-[600px] bg-white shadow-2xl z-50 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {blocker.type === 'external' ? (
                  <ExternalLink className="w-4 h-4 text-blue-600" />
                ) : (
                  <AlertOctagon className="w-4 h-4 text-orange-600" />
                )}
                <span className="text-xs text-gray-500 uppercase">{blocker.type} Blocker</span>
              </div>
              <h2 className="text-lg text-gray-900">{blocker.title}</h2>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Key Metrics */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className={`px-3 py-1.5 rounded text-sm ${impact.bg} ${impact.text}`}>
              {impact.label}
            </span>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded">
              <Clock className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-700">{blocker.age} days old</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded">
              <User className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-700">{blocker.owner}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-sm text-gray-900 mb-2">Description</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{blocker.description}</p>
          </div>

          {/* Impacted Milestones */}
          <div>
            <h3 className="text-sm text-gray-900 mb-3">Impacted Milestones</h3>
            <div className="flex gap-2 flex-wrap">
              {blocker.milestones.map((milestone: string) => (
                <span
                  key={milestone}
                  className="px-3 py-1.5 bg-purple-100 text-purple-700 text-sm rounded"
                >
                  {milestone}
                </span>
              ))}
            </div>
          </div>

          {/* Workstreams */}
          <div>
            <h3 className="text-sm text-gray-900 mb-3">Affected Workstreams</h3>
            <div className="space-y-2">
              {blocker.workstreams.map((workstream: string) => (
                <div
                  key={workstream}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded"
                >
                  <div className="w-1 h-6 bg-blue-600 rounded" />
                  <span className="text-sm text-gray-700">{workstream}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Linked Work Items */}
          <div>
            <h3 className="text-sm text-gray-900 mb-3">Linked Work Items</h3>
            <div className="space-y-2">
              {blocker.linkedItems.map((item: any) => {
                const statusStyle = statusConfig[item.status as keyof typeof statusConfig];
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-blue-400 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Link className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-900">{item.title}</div>
                        <div className="text-xs text-gray-500">{item.id}</div>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${statusStyle.bg} ${statusStyle.text}`}>
                      {item.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dependencies */}
          <div>
            <h3 className="text-sm text-gray-900 mb-3">Dependencies</h3>
            <div className="space-y-2">
              {blocker.dependencies.map((dep: any, index: number) => (
                <div
                  key={index}
                  className="p-3 bg-orange-50 border border-orange-200 rounded-lg"
                >
                  <div className="text-sm text-gray-900 mb-1">{dep.item}</div>
                  <div className="text-xs text-gray-600">→ Blocking: {dep.blocking}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Notes */}
          <div>
            <h3 className="text-sm text-gray-900 mb-3">Activity & Notes</h3>
            <div className="space-y-3">
              {blocker.notes.map((note: any, index: number) => (
                <div
                  key={index}
                  className="p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-xs text-gray-900">{note.author}</span>
                    </div>
                    <span className="text-xs text-gray-500">{note.date}</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{note.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-sm text-gray-900 mb-3">Actions</h3>
            <div className="flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                <AlertOctagon className="w-4 h-4" />
                <span className="text-sm">Escalate</span>
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
                <Eye className="w-4 h-4" />
                <span className="text-sm">Watch</span>
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm">Resolve</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
