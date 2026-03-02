import { X, AlertTriangle, Clock, User, Link, MessageSquare, AlertOctagon, Eye, CheckCircle2, Calendar } from 'lucide-react';

interface BlockerDetailDrawerProps {
  blockerId: string;
  onClose: () => void;
}

const blockerData: Record<string, any> = {
  b1: {
    title: 'CISO security scan approval pending',
    type: 'external',
    owner: 'J. Martinez',
    ownerEmail: 'j.martinez@contractor.gov',
    age: 12,
    severity: 'high',
    created: 'Feb 17, 2026',
    nextAction: 'Escalate to program sponsor',
    description: 'Security vulnerability scan results were submitted to the CISO office for review and approval on February 17. The ATO package cannot be finalized without this approval. Multiple follow-up emails and meeting requests have been sent with no response. This is now the critical path blocker for the milestone.',
    impact: 'Blocks 6 tasks in Security & Compliance workstream and delays ATO package submission by 3+ days',
    milestone: 'M2 ATO Package',
    workstreams: ['Security & Compliance'],
    linkedItems: [
      { id: 'ATO-1234', title: 'Complete security control assessment', status: 'blocked', workstream: 'Security' },
      { id: 'ATO-1235', title: 'Finalize ATO package documentation', status: 'blocked', workstream: 'Security' },
      { id: 'ATO-1236', title: 'Prepare CISO brief', status: 'blocked', workstream: 'Security' },
      { id: 'SEC-456', title: 'Remediate critical vulnerabilities', status: 'completed', workstream: 'Security' },
    ],
    dependencies: [
      { item: 'CISO approval signature', blocking: 'ATO package submission' },
      { item: 'Security scan certification', blocking: 'M3 Cutover milestone' },
    ],
    timeline: [
      { date: 'Mar 1, 9:00 AM', author: 'J. Martinez', action: 'escalation', text: 'Escalated to program sponsor. Meeting scheduled with CISO for Mar 3 at 2:00 PM.' },
      { date: 'Feb 28, 2:30 PM', author: 'J. Martinez', action: 'follow-up', text: 'Sent third follow-up email to CISO office. CC\'d program sponsor and client POC.' },
      { date: 'Feb 26, 11:15 AM', author: 'J. Martinez', action: 'meeting', text: 'Met with CISO deputy. Confirmed scan results received but review backlogged due to staffing.' },
      { date: 'Feb 23, 3:45 PM', author: 'Security Lead', action: 'follow-up', text: 'Second follow-up email sent. No response.' },
      { date: 'Feb 20, 10:00 AM', author: 'J. Martinez', action: 'follow-up', text: 'Initial follow-up email sent requesting status update.' },
      { date: 'Feb 17, 2:15 PM', author: 'Security Lead', action: 'submission', text: 'Security scan results and remediation evidence submitted to CISO office via secure portal.' },
    ],
    proposedActions: [
      { action: 'Schedule executive-level review meeting', owner: 'Program Sponsor', dueDate: 'Mar 3' },
      { action: 'Prepare backup plan for conditional ATO', owner: 'Security Lead', dueDate: 'Mar 5' },
      { action: 'Daily status check with CISO office', owner: 'J. Martinez', dueDate: 'Ongoing' },
    ],
  },
  b2: {
    title: 'Test data masking tool license expired',
    type: 'internal',
    owner: 'QA Lead',
    ownerEmail: 'qa-lead@contractor.gov',
    age: 3,
    severity: 'medium',
    created: 'Feb 26, 2026',
    nextAction: 'Procurement in progress',
    description: 'The data masking tool used to generate compliant test datasets for security testing has an expired license. QA team cannot proceed with final security validation tests until renewed.',
    impact: 'Blocks 3 QA tasks and delays security validation testing',
    milestone: 'M2 ATO Package',
    workstreams: ['Quality Assurance', 'Security & Compliance'],
    linkedItems: [
      { id: 'QA-567', title: 'Generate masked test data', status: 'blocked', workstream: 'QA' },
      { id: 'QA-568', title: 'Execute security validation tests', status: 'blocked', workstream: 'QA' },
      { id: 'QA-569', title: 'Document test evidence', status: 'waiting', workstream: 'QA' },
    ],
    dependencies: [
      { item: 'License renewal approval', blocking: 'QA validation tasks' },
    ],
    timeline: [
      { date: 'Mar 1, 11:20 AM', author: 'Procurement', action: 'update', text: 'Purchase order approved. License renewal expected by Mar 3.' },
      { date: 'Feb 28, 9:45 AM', author: 'QA Lead', action: 'escalation', text: 'Escalated to procurement team for expedited processing.' },
      { date: 'Feb 26, 2:00 PM', author: 'QA Engineer', action: 'discovery', text: 'License expiration discovered during test setup. Vendor notified.' },
    ],
    proposedActions: [
      { action: 'Confirm license activation', owner: 'QA Lead', dueDate: 'Mar 3' },
      { action: 'Resume test data generation', owner: 'QA Team', dueDate: 'Mar 4' },
    ],
  },
};

export function BlockerDetailDrawer({ blockerId, onClose }: BlockerDetailDrawerProps) {
  const blocker = blockerData[blockerId];

  if (!blocker) return null;

  const severityConfig = {
    high: { bg: 'bg-red-100', text: 'text-red-700', label: 'High Severity' },
    medium: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Medium Severity' },
    low: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Low Severity' },
  };

  const statusConfig = {
    blocked: { bg: 'bg-red-100', text: 'text-red-700' },
    waiting: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
    'in-progress': { bg: 'bg-blue-100', text: 'text-blue-700' },
    completed: { bg: 'bg-green-100', text: 'text-green-700' },
  };

  const actionTypeConfig = {
    escalation: { icon: AlertOctagon, color: 'text-red-600', bg: 'bg-red-50' },
    'follow-up': { icon: MessageSquare, color: 'text-blue-600', bg: 'bg-blue-50' },
    meeting: { icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
    submission: { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
    discovery: { icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-50' },
    update: { icon: MessageSquare, color: 'text-blue-600', bg: 'bg-blue-50' },
  };

  const severity = severityConfig[blocker.severity as keyof typeof severityConfig];

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-[600px] bg-white shadow-2xl z-50 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-orange-600" />
                <span className="text-xs text-gray-500 uppercase">
                  {blocker.type} Blocker
                </span>
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
            <span className={`px-3 py-1.5 rounded text-sm ${severity.bg} ${severity.text}`}>
              {severity.label}
            </span>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded">
              <Clock className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-700">{blocker.age} days old</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded">
              <Calendar className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-700">Created {blocker.created}</span>
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

          {/* Impact */}
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <h3 className="text-sm text-gray-900 mb-2">Impact</h3>
            <p className="text-sm text-gray-700 leading-relaxed">{blocker.impact}</p>
          </div>

          {/* Owner */}
          <div>
            <h3 className="text-sm text-gray-900 mb-2">Owner</h3>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
                {blocker.owner.split(' ').map((n: string) => n[0]).join('')}
              </div>
              <div>
                <div className="text-sm text-gray-900">{blocker.owner}</div>
                <div className="text-xs text-gray-500">{blocker.ownerEmail}</div>
              </div>
            </div>
          </div>

          {/* Next Action */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-sm text-gray-900 mb-2">Next Action</h3>
            <p className="text-sm text-blue-700">{blocker.nextAction}</p>
          </div>

          {/* Milestone & Workstreams */}
          <div>
            <h3 className="text-sm text-gray-900 mb-3">Impacted Milestone</h3>
            <div className="px-3 py-2 bg-purple-100 text-purple-700 text-sm rounded inline-block">
              {blocker.milestone}
            </div>
          </div>

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
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Link className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="text-sm text-gray-900 truncate">{item.title}</div>
                        <div className="text-xs text-gray-500">{item.id} • {item.workstream}</div>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs flex-shrink-0 ml-2 ${statusStyle.bg} ${statusStyle.text}`}>
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

          {/* Proposed Actions */}
          <div>
            <h3 className="text-sm text-gray-900 mb-3">Proposed Actions</h3>
            <div className="space-y-2">
              {blocker.proposedActions.map((action: any, index: number) => (
                <div
                  key={index}
                  className="p-3 border border-gray-200 rounded-lg bg-white"
                >
                  <div className="text-sm text-gray-900 mb-2">{action.action}</div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">
                      <User className="w-3 h-3 inline mr-1" />
                      {action.owner}
                    </span>
                    <span className="text-gray-600">
                      <Calendar className="w-3 h-3 inline mr-1" />
                      Due: {action.dueDate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h3 className="text-sm text-gray-900 mb-3">Activity Timeline</h3>
            <div className="space-y-3">
              {blocker.timeline.map((event: any, index: number) => {
                const actionConfig = actionTypeConfig[event.action as keyof typeof actionTypeConfig];
                const Icon = actionConfig.icon;
                
                return (
                  <div key={index} className="flex gap-3">
                    {/* Timeline marker */}
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full ${actionConfig.bg} flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-4 h-4 ${actionConfig.color}`} />
                      </div>
                      {index < blocker.timeline.length - 1 && (
                        <div className="w-px h-full bg-gray-200 mt-2" />
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 pb-4">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className="text-xs text-gray-500">{event.date}</span>
                        <span className="text-xs text-gray-500">{event.author}</span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{event.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-gray-200 sticky bottom-0 bg-white">
            <h3 className="text-sm text-gray-900 mb-3">Quick Actions</h3>
            <div className="grid grid-cols-3 gap-3">
              <button className="flex flex-col items-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                <AlertOctagon className="w-5 h-5" />
                <span className="text-xs">Escalate</span>
              </button>
              <button className="flex flex-col items-center gap-2 px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
                <Eye className="w-5 h-5" />
                <span className="text-xs">Watch</span>
              </button>
              <button className="flex flex-col items-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-xs">Resolve</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
