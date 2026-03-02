import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronDown, AlertTriangle, Clock, User, Calendar, Bell, TrendingUp, MessageSquare, Edit, CheckCircle2, XCircle, ArrowUpCircle } from 'lucide-react';

interface RiskItem {
  id: string;
  title: string;
  type: 'risk' | 'issue' | 'blocker';
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'in-progress' | 'escalated' | 'resolved' | 'closed';
  owner: string;
  dueDate: string;
  age: number;
  milestones: string[];
  isEscalated: boolean;
  description: string;
  impact: string;
  mitigationPlan: string;
  nextAction: string;
  created: string;
  lastUpdated: string;
  escalationHistory: EscalationEvent[];
  pmNotes: PMNote[];
}

interface EscalationEvent {
  id: string;
  date: string;
  timestamp: string;
  type: 'escalated' | 'reassigned' | 'status-change' | 'due-date-change' | 'note-added' | 'resolved';
  actor: string;
  description: string;
  details?: string;
}

interface PMNote {
  id: string;
  date: string;
  author: string;
  note: string;
}

const risks: RiskItem[] = [
  {
    id: 'RSK-001',
    title: 'CISO security scan approval delayed beyond baseline',
    type: 'blocker',
    priority: 'critical',
    status: 'escalated',
    owner: 'J. Martinez',
    dueDate: 'Mar 3, 2026',
    age: 12,
    milestones: ['M2 ATO Package', 'M3 Cutover'],
    isEscalated: true,
    description: 'CISO office has not completed security control assessment review despite multiple follow-ups. Review was originally scheduled for Feb 18 but has been postponed twice due to CISO office backlog. Blocking ATO package submission.',
    impact: 'Critical path blocker for M2 ATO Package. Without approval, cannot submit ATO package to AO. Estimated 3-5 day slip to M2, cascading to M3 and M4. Potential contract penalty exposure if M4 slips beyond Apr 30.',
    mitigationPlan: '1) Escalated to Program Sponsor on Feb 28. 2) Sponsor engaging with CISO leadership. 3) Prepared interim approval request for conditional ATO submission. 4) Daily status checks with CISO office.',
    nextAction: 'Program Sponsor meeting with CISO scheduled Mar 2. If no commitment by EOD Mar 2, escalate to Contract Officer.',
    created: 'Feb 17, 2026',
    lastUpdated: 'Mar 1, 2026 - 11:30 AM',
    escalationHistory: [
      {
        id: 'ESC-001',
        date: 'Mar 1, 2026',
        timestamp: '11:30 AM',
        type: 'note-added',
        actor: 'Program PM',
        description: 'Added PM note: CISO office confirmed review scheduled for Mar 3',
        details: 'Received confirmation from CISO deputy. Review meeting set for Mar 3 at 2pm. Preparing brief materials.',
      },
      {
        id: 'ESC-002',
        date: 'Feb 28, 2026',
        timestamp: '3:45 PM',
        type: 'escalated',
        actor: 'J. Martinez',
        description: 'Escalated to Program Sponsor',
        details: 'No response after 10 days. Risk to contract milestone. Sponsor agreed to engage CISO leadership directly.',
      },
      {
        id: 'ESC-003',
        date: 'Feb 25, 2026',
        timestamp: '2:00 PM',
        type: 'due-date-change',
        actor: 'J. Martinez',
        description: 'Due date changed from Feb 25 to Mar 3',
        details: 'Extended deadline based on CISO office feedback. Second postponement.',
      },
      {
        id: 'ESC-004',
        date: 'Feb 22, 2026',
        timestamp: '10:15 AM',
        type: 'reassigned',
        actor: 'Program PM',
        description: 'Reassigned from Security Lead to J. Martinez',
        details: 'Reassigned to SSO/CSO for executive-level engagement',
      },
      {
        id: 'ESC-005',
        date: 'Feb 18, 2026',
        timestamp: '1:30 PM',
        type: 'status-change',
        actor: 'Security Lead',
        description: 'Status changed from Open to In Progress',
        details: 'Initial review scheduled, began preparing materials',
      },
      {
        id: 'ESC-006',
        date: 'Feb 17, 2026',
        timestamp: '9:00 AM',
        type: 'escalated',
        actor: 'Security Lead',
        description: 'Risk created and opened',
        details: 'CISO review required for ATO package. Initial due date set to Feb 25.',
      },
    ],
    pmNotes: [
      {
        id: 'NOTE-001',
        date: 'Mar 1, 2026',
        author: 'Program PM',
        note: 'CISO office confirmed review scheduled for Mar 3 at 2pm. Preparing brief with J. Martinez. Sponsor engaged and committed to attending if needed.',
      },
      {
        id: 'NOTE-002',
        date: 'Feb 28, 2026',
        author: 'Program PM',
        note: 'Escalated to Program Sponsor after no response for 10+ days. Contract milestone at risk. Sponsor will engage CISO leadership directly.',
      },
      {
        id: 'NOTE-003',
        date: 'Feb 25, 2026',
        author: 'J. Martinez',
        note: 'Second postponement. CISO office citing resource constraints. Extended due date to Mar 3 but flagging as high risk.',
      },
    ],
  },
  {
    id: 'RSK-002',
    title: 'Production environment provisioning approval stuck in CAB',
    type: 'blocker',
    priority: 'critical',
    status: 'escalated',
    owner: 'DevOps Team',
    dueDate: 'Mar 5, 2026',
    age: 8,
    milestones: ['M3 Cutover', 'M4 Production Release'],
    isEscalated: true,
    description: 'Cloud environment provisioning request submitted to Change Advisory Board (CAB) on Feb 21. Standard approval timeline is 3-5 days but request has been pending for 8 days with no scheduled review date.',
    impact: 'Blocking all production cutover preparation activities. Cannot complete infrastructure testing, load balancer config, or DR setup. 8-day delay already incurred. If not approved by Mar 5, M3 will slip by 5+ days.',
    mitigationPlan: 'Engaging CAB leadership to expedite review. Prepared technical justification package. Exploring emergency change process if not approved by Mar 3.',
    nextAction: 'CAB emergency session requested for Mar 4. If denied, escalate to CIO office.',
    created: 'Feb 21, 2026',
    lastUpdated: 'Mar 1, 2026 - 9:15 AM',
    escalationHistory: [
      {
        id: 'ESC-007',
        date: 'Mar 1, 2026',
        timestamp: '9:15 AM',
        type: 'escalated',
        actor: 'DevOps Lead',
        description: 'Escalated to CAB leadership',
        details: 'Requested emergency CAB session for Mar 4. Emphasized contract milestone risk.',
      },
      {
        id: 'ESC-008',
        date: 'Feb 27, 2026',
        timestamp: '11:00 AM',
        type: 'note-added',
        actor: 'Program PM',
        description: 'Added PM note: Following up with CAB daily',
        details: 'No movement. CAB citing backlog from security incident response.',
      },
      {
        id: 'ESC-009',
        date: 'Feb 21, 2026',
        timestamp: '2:00 PM',
        type: 'escalated',
        actor: 'DevOps Team',
        description: 'Blocker created and submitted to CAB',
        details: 'Production environment change request CR-2026-0445 submitted',
      },
    ],
    pmNotes: [
      {
        id: 'NOTE-004',
        date: 'Mar 1, 2026',
        author: 'Program PM',
        note: 'Emergency CAB session requested for Mar 4. If not approved, will escalate to CIO office on Mar 5. Contract milestone at risk.',
      },
      {
        id: 'NOTE-005',
        date: 'Feb 27, 2026',
        author: 'Program PM',
        note: 'CAB citing backlog from security incident response. Daily follow-ups ongoing but no scheduled review date yet.',
      },
    ],
  },
  {
    id: 'RSK-003',
    title: 'SSO vendor API stability concerns',
    type: 'risk',
    priority: 'high',
    status: 'in-progress',
    owner: 'S. Patel',
    dueDate: 'Mar 8, 2026',
    age: 14,
    milestones: ['M1 Auth Release'],
    isEscalated: false,
    description: 'SSO vendor API experienced two unplanned outages in past 10 days (Feb 19, Feb 24). Vendor has not provided root cause analysis or preventive measures. Integration testing blocked during outages.',
    impact: 'Medium impact on M1 Auth Release timeline. Each outage cost 4-6 hours of testing time. If pattern continues, could delay M1 by 2-3 days. User authentication dependent on vendor API availability.',
    mitigationPlan: 'Implementing circuit breaker pattern and fallback auth mechanism. Requested vendor SLA commitment and RCA for recent outages. Considering backup vendor evaluation if issues persist.',
    nextAction: 'Vendor escalation call scheduled Mar 4. Request SLA guarantee and incident post-mortem. Review fallback implementation timeline.',
    created: 'Feb 15, 2026',
    lastUpdated: 'Feb 29, 2026 - 4:30 PM',
    escalationHistory: [
      {
        id: 'ESC-010',
        date: 'Feb 29, 2026',
        timestamp: '4:30 PM',
        type: 'status-change',
        actor: 'S. Patel',
        description: 'Status changed from Open to In Progress',
        details: 'Vendor responded. Escalation call scheduled for Mar 4.',
      },
      {
        id: 'ESC-011',
        date: 'Feb 24, 2026',
        timestamp: '2:15 PM',
        type: 'note-added',
        actor: 'S. Patel',
        description: 'Added note: Second outage occurred',
        details: 'Second API outage in 5 days. 6 hours of testing lost. Escalating to vendor account manager.',
      },
      {
        id: 'ESC-012',
        date: 'Feb 15, 2026',
        timestamp: '10:00 AM',
        type: 'escalated',
        actor: 'S. Patel',
        description: 'Risk created after first vendor outage',
        details: 'First API outage on Feb 19. Monitoring for pattern.',
      },
    ],
    pmNotes: [
      {
        id: 'NOTE-006',
        date: 'Feb 29, 2026',
        author: 'S. Patel',
        note: 'Vendor escalation call scheduled for Mar 4. Will request SLA commitment and root cause analysis for both outages.',
      },
    ],
  },
  {
    id: 'RSK-004',
    title: 'FedRAMP compliance documentation gap',
    type: 'issue',
    priority: 'high',
    status: 'in-progress',
    owner: 'Compliance Lead',
    dueDate: 'Mar 10, 2026',
    age: 5,
    milestones: ['M2 ATO Package'],
    isEscalated: false,
    description: 'Agency requested additional FedRAMP Moderate control evidence for AC-2(1), AC-2(3), and AC-2(5) during pre-submission review. Original ATO package did not include these enhanced controls.',
    impact: 'Medium-high impact. Additional documentation required before ATO submission. Estimated 5-7 day effort to compile evidence and update SSP. Could delay M2 submission by up to 1 week if not completed by Mar 10.',
    mitigationPlan: 'Compliance team compiling additional evidence. Engaging security architect to document technical controls. Template from previous FedRAMP Moderate package being adapted.',
    nextAction: 'Complete AC-2 family control evidence by Mar 7. ISSO review scheduled Mar 9. Target submission Mar 11.',
    created: 'Feb 25, 2026',
    lastUpdated: 'Mar 1, 2026 - 8:00 AM',
    escalationHistory: [
      {
        id: 'ESC-013',
        date: 'Mar 1, 2026',
        timestamp: '8:00 AM',
        type: 'note-added',
        actor: 'Compliance Lead',
        description: 'Added update: AC-2(1) and AC-2(3) evidence complete',
        details: 'Two of three controls documented. AC-2(5) in progress, on track for Mar 7.',
      },
      {
        id: 'ESC-014',
        date: 'Feb 25, 2026',
        timestamp: '3:30 PM',
        type: 'escalated',
        actor: 'Compliance Lead',
        description: 'Issue created after agency feedback',
        details: 'Agency pre-submission review identified control gaps. Additional evidence required.',
      },
    ],
    pmNotes: [
      {
        id: 'NOTE-007',
        date: 'Mar 1, 2026',
        author: 'Program PM',
        note: 'Progress on track. AC-2(1) and AC-2(3) complete. AC-2(5) expected Mar 7. ISSO review Mar 9.',
      },
    ],
  },
  {
    id: 'RSK-005',
    title: 'Database migration script compatibility issue',
    type: 'issue',
    priority: 'high',
    status: 'open',
    owner: 'K. Liu',
    dueDate: 'Mar 6, 2026',
    age: 2,
    milestones: ['M3 Cutover'],
    isEscalated: false,
    description: 'Database migration scripts failing on staging environment due to PostgreSQL version mismatch. Production uses v14.2, staging has v13.8. Migration scripts use v14-specific syntax.',
    impact: 'Medium impact. Blocking cutover rehearsal. Need to resolve before production migration. Estimated 3-4 day fix (rewrite scripts for v13 compatibility or upgrade staging).',
    mitigationPlan: 'Two options: (1) Upgrade staging to v14.2 (requires CAB approval, 2-3 day timeline), or (2) Rewrite migration scripts for v13 compatibility. Team recommends option 1 for production parity.',
    nextAction: 'Decision meeting Mar 3 with DevOps and DBA team. Submit CAB request if option 1 selected.',
    created: 'Feb 27, 2026',
    lastUpdated: 'Feb 29, 2026 - 2:00 PM',
    escalationHistory: [
      {
        id: 'ESC-015',
        date: 'Feb 29, 2026',
        timestamp: '2:00 PM',
        type: 'note-added',
        actor: 'K. Liu',
        description: 'Added note: Root cause identified',
        details: 'PostgreSQL version mismatch confirmed. Evaluating upgrade vs rewrite options.',
      },
      {
        id: 'ESC-016',
        date: 'Feb 27, 2026',
        timestamp: '4:00 PM',
        type: 'escalated',
        actor: 'K. Liu',
        description: 'Issue created after migration failure',
        details: 'Migration scripts failing on staging. Investigation in progress.',
      },
    ],
    pmNotes: [
      {
        id: 'NOTE-008',
        date: 'Feb 29, 2026',
        author: 'K. Liu',
        note: 'Root cause identified - PostgreSQL version mismatch. Decision meeting scheduled Mar 3 to choose between staging upgrade or script rewrite.',
      },
    ],
  },
  {
    id: 'RSK-006',
    title: 'Key personnel clearance renewal delay',
    type: 'risk',
    priority: 'medium',
    status: 'open',
    owner: 'Program PM',
    dueDate: 'Mar 15, 2026',
    age: 10,
    milestones: ['M2 ATO Package', 'M3 Cutover'],
    isEscalated: false,
    description: 'Lead security architect clearance renewal submitted to security office on Feb 1. Standard processing time is 30-45 days but current renewal expires Mar 20. If not renewed by Mar 20, individual cannot access classified ATO materials.',
    impact: 'Medium risk. Could impact ATO documentation finalization if clearance expires before renewal. Backup security engineer has clearance but less experience with FedRAMP requirements.',
    mitigationPlan: 'Cross-training backup engineer on ATO package requirements. Weekly status checks with security office. Prepared continuity plan if clearance expires before renewal.',
    nextAction: 'Follow up with security office Mar 4. If no update, engage HR and Facility Security Officer.',
    created: 'Feb 19, 2026',
    lastUpdated: 'Feb 26, 2026 - 3:00 PM',
    escalationHistory: [
      {
        id: 'ESC-017',
        date: 'Feb 26, 2026',
        timestamp: '3:00 PM',
        type: 'note-added',
        actor: 'Program PM',
        description: 'Added note: No update from security office',
        details: 'Checked with security office - still in processing. Estimated 2-3 more weeks.',
      },
      {
        id: 'ESC-018',
        date: 'Feb 19, 2026',
        timestamp: '11:00 AM',
        type: 'escalated',
        actor: 'Program PM',
        description: 'Risk created due to clearance timeline',
        details: 'Clearance renewal timeline tight. Monitoring closely.',
      },
    ],
    pmNotes: [
      {
        id: 'NOTE-009',
        date: 'Feb 26, 2026',
        author: 'Program PM',
        note: 'Security office estimates 2-3 more weeks. Cross-training backup engineer as contingency.',
      },
    ],
  },
  {
    id: 'RSK-007',
    title: 'Load testing environment access delay',
    type: 'blocker',
    priority: 'medium',
    status: 'in-progress',
    owner: 'QA Lead',
    dueDate: 'Mar 7, 2026',
    age: 6,
    milestones: ['M1 Auth Release'],
    isEscalated: false,
    description: 'QA team awaiting VPN access to load testing environment. Access request submitted Feb 23 but network security team has not processed request. Load testing cannot start without environment access.',
    impact: 'Low-medium impact. Delaying performance validation for M1. Can work around with local testing but production-scale validation requires environment access. 6 days of delay already incurred.',
    mitigationPlan: 'Daily follow-ups with network security. Completed security training requirements. Prepared alternative testing approach using scaled-down local environment.',
    nextAction: 'Network security committed to provisioning access by Mar 7. If not delivered, escalate to CISO office.',
    created: 'Feb 23, 2026',
    lastUpdated: 'Mar 1, 2026 - 10:00 AM',
    escalationHistory: [
      {
        id: 'ESC-019',
        date: 'Mar 1, 2026',
        timestamp: '10:00 AM',
        type: 'note-added',
        actor: 'QA Lead',
        description: 'Added note: Network security committed to Mar 7 delivery',
        details: 'Received commitment from network security manager. Access provisioning in progress.',
      },
      {
        id: 'ESC-020',
        date: 'Feb 27, 2026',
        timestamp: '9:30 AM',
        type: 'status-change',
        actor: 'QA Lead',
        description: 'Status changed from Open to In Progress',
        details: 'Network security acknowledged request. Processing access.',
      },
      {
        id: 'ESC-021',
        date: 'Feb 23, 2026',
        timestamp: '1:00 PM',
        type: 'escalated',
        actor: 'QA Lead',
        description: 'Blocker created - VPN access required',
        details: 'Access request submitted to network security.',
      },
    ],
    pmNotes: [
      {
        id: 'NOTE-010',
        date: 'Mar 1, 2026',
        author: 'QA Lead',
        note: 'Network security committed to access delivery by Mar 7. Will escalate to CISO if not met.',
      },
    ],
  },
];

export function RiskEscalationScreen() {
  const navigate = useNavigate();
  const [selectedRisk, setSelectedRisk] = useState<RiskItem>(risks[0]); // Default to first critical risk
  const [filters, setFilters] = useState({
    status: 'all',
    owner: 'all',
    priority: 'all',
    milestone: 'all',
    escalated: 'all',
  });

  const typeConfig = {
    risk: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Risk' },
    issue: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Issue' },
    blocker: { bg: 'bg-red-100', text: 'text-red-700', label: 'Blocker' },
  };

  const priorityConfig = {
    critical: { bg: 'bg-red-100', text: 'text-red-700', label: 'Critical' },
    high: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'High' },
    medium: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Medium' },
    low: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Low' },
  };

  const statusConfig = {
    open: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Open' },
    'in-progress': { bg: 'bg-blue-100', text: 'text-blue-700', label: 'In Progress' },
    escalated: { bg: 'bg-red-100', text: 'text-red-700', label: 'Escalated' },
    resolved: { bg: 'bg-green-100', text: 'text-green-700', label: 'Resolved' },
    closed: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Closed' },
  };

  const eventTypeConfig = {
    escalated: { icon: ArrowUpCircle, color: 'text-red-600', bg: 'bg-red-50', label: 'Escalated' },
    reassigned: { icon: User, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Reassigned' },
    'status-change': { icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50', label: 'Status Changed' },
    'due-date-change': { icon: Calendar, color: 'text-orange-600', bg: 'bg-orange-50', label: 'Due Date Changed' },
    'note-added': { icon: MessageSquare, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Note Added' },
    resolved: { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', label: 'Resolved' },
  };

  // Calculate summary stats
  const criticalCount = risks.filter(r => r.priority === 'critical').length;
  const escalatedCount = risks.filter(r => r.isEscalated).length;
  const overdueCount = risks.filter(r => new Date(r.dueDate) < new Date() && r.status !== 'resolved' && r.status !== 'closed').length;

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="w-[1440px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl text-gray-900">Risk & Escalation Log</h1>
              <div className="text-sm text-gray-600 mt-1">Risk tracking, accountability, and decision history</div>
            </div>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>

          {/* Summary Stats */}
          <div className="flex items-center gap-6 mb-4 pb-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-600 rounded-full" />
              <span className="text-sm text-gray-900">{criticalCount} Critical</span>
            </div>
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-red-600" />
              <span className="text-sm text-gray-900">{escalatedCount} Escalated</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-600" />
              <span className="text-sm text-gray-900">{overdueCount} Overdue</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">{risks.length} Total Risks/Issues</span>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-5 gap-3">
            <FilterDropdown label="Status" value={filters.status} onChange={(v) => setFilters({...filters, status: v})} />
            <FilterDropdown label="Owner" value={filters.owner} onChange={(v) => setFilters({...filters, owner: v})} />
            <FilterDropdown label="Priority" value={filters.priority} onChange={(v) => setFilters({...filters, priority: v})} />
            <FilterDropdown label="Milestone" value={filters.milestone} onChange={(v) => setFilters({...filters, milestone: v})} />
            <FilterDropdown label="Escalation" value={filters.escalated} onChange={(v) => setFilters({...filters, escalated: v})} />
          </div>
        </div>
      </header>

      <main className="w-[1440px] mx-auto px-6 py-4 flex gap-4">
        {/* Main Table */}
        <div className="flex-1 bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left text-xs font-medium text-gray-600 px-3 py-2 w-20">ID</th>
                  <th className="text-left text-xs font-medium text-gray-600 px-3 py-2">Title</th>
                  <th className="text-left text-xs font-medium text-gray-600 px-3 py-2 w-20">Type</th>
                  <th className="text-left text-xs font-medium text-gray-600 px-3 py-2 w-20">Priority</th>
                  <th className="text-left text-xs font-medium text-gray-600 px-3 py-2 w-24">Owner</th>
                  <th className="text-left text-xs font-medium text-gray-600 px-3 py-2 w-24">Due Date</th>
                  <th className="text-left text-xs font-medium text-gray-600 px-3 py-2 w-16">Age</th>
                  <th className="text-left text-xs font-medium text-gray-600 px-3 py-2 w-28">Milestone(s)</th>
                  <th className="text-left text-xs font-medium text-gray-600 px-3 py-2 w-24">Status</th>
                </tr>
              </thead>
              <tbody>
                {risks.map((risk) => {
                  const isSelected = selectedRisk.id === risk.id;
                  const isOverdue = new Date(risk.dueDate) < new Date() && risk.status !== 'resolved' && risk.status !== 'closed';
                  const isHighPriority = risk.priority === 'critical' || risk.priority === 'high';

                  return (
                    <tr
                      key={risk.id}
                      onClick={() => setSelectedRisk(risk)}
                      className={`border-b border-gray-100 cursor-pointer transition-colors ${
                        isSelected ? 'bg-blue-50' : 
                        isOverdue ? 'bg-red-50 hover:bg-red-100' :
                        isHighPriority && risk.isEscalated ? 'bg-orange-50 hover:bg-orange-100' :
                        'hover:bg-gray-50'
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-900 font-mono">{risk.id}</span>
                          {risk.isEscalated && (
                            <Bell className="w-3 h-3 text-red-600" />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-900 line-clamp-2">{risk.title}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-xs ${typeConfig[risk.type].bg} ${typeConfig[risk.type].text}`}>
                          {typeConfig[risk.type].label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-xs ${priorityConfig[risk.priority].bg} ${priorityConfig[risk.priority].text}`}>
                          {priorityConfig[risk.priority].label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-700">{risk.owner}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-700">{risk.dueDate}</div>
                        {isOverdue && (
                          <div className="text-xs text-red-600">Overdue</div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-sm ${risk.age > 10 ? 'text-orange-600' : 'text-gray-700'}`}>
                          {risk.age}d
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="space-y-1">
                          {risk.milestones.slice(0, 2).map((milestone, idx) => (
                            <div key={idx} className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded">
                              {milestone}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-xs ${statusConfig[risk.status].bg} ${statusConfig[risk.status].text}`}>
                          {statusConfig[risk.status].label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Detail Panel */}
        <div className="w-[480px] bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col max-h-[calc(100vh-180px)]">
          {/* Panel Header */}
          <div className="p-6 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-gray-900 font-mono">{selectedRisk.id}</span>
                  <span className={`px-2 py-0.5 rounded text-xs ${typeConfig[selectedRisk.type].bg} ${typeConfig[selectedRisk.type].text}`}>
                    {typeConfig[selectedRisk.type].label}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-xs ${priorityConfig[selectedRisk.priority].bg} ${priorityConfig[selectedRisk.priority].text}`}>
                    {priorityConfig[selectedRisk.priority].label}
                  </span>
                  {selectedRisk.isEscalated && (
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs">
                      <Bell className="w-3 h-3" />
                      Escalated
                    </span>
                  )}
                </div>
                <h2 className="text-sm text-gray-900 leading-snug">{selectedRisk.title}</h2>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <User className="w-3 h-3" />
                <span>{selectedRisk.owner}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{selectedRisk.dueDate}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{selectedRisk.age} days old</span>
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-xs text-gray-500 font-medium mb-2">DESCRIPTION</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{selectedRisk.description}</p>
            </div>

            {/* Impact */}
            <div>
              <h3 className="text-xs text-gray-500 font-medium mb-2">IMPACT</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{selectedRisk.impact}</p>
            </div>

            {/* Mitigation Plan */}
            <div>
              <h3 className="text-xs text-gray-500 font-medium mb-2">MITIGATION PLAN</h3>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{selectedRisk.mitigationPlan}</p>
            </div>

            {/* Next Action */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-xs text-gray-500 font-medium mb-2">NEXT ACTION</h3>
              <p className="text-sm text-blue-900">{selectedRisk.nextAction}</p>
            </div>

            {/* Impacted Milestones */}
            <div>
              <h3 className="text-xs text-gray-500 font-medium mb-2">IMPACTED MILESTONES</h3>
              <div className="space-y-2">
                {selectedRisk.milestones.map((milestone, idx) => (
                  <div key={idx} className="px-3 py-2 bg-purple-100 text-purple-700 text-sm rounded">
                    {milestone}
                  </div>
                ))}
              </div>
            </div>

            {/* Escalation History Timeline */}
            <div>
              <h3 className="text-xs text-gray-500 font-medium mb-3">ESCALATION HISTORY</h3>
              <div className="relative space-y-4">
                {/* Timeline Line */}
                <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-200" />
                
                {selectedRisk.escalationHistory.map((event, idx) => {
                  const config = eventTypeConfig[event.type];
                  const Icon = config.icon;
                  
                  return (
                    <div key={event.id} className="relative pl-8">
                      {/* Timeline Dot */}
                      <div className={`absolute left-0 w-6 h-6 rounded-full flex items-center justify-center ${config.bg}`}>
                        <Icon className={`w-3.5 h-3.5 ${config.color}`} />
                      </div>
                      
                      {/* Event Content */}
                      <div className="pb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 text-xs rounded ${config.bg} ${config.color}`}>
                            {config.label}
                          </span>
                          <span className="text-xs text-gray-500">{event.date} • {event.timestamp}</span>
                        </div>
                        <div className="text-sm text-gray-900 mb-1">{event.description}</div>
                        {event.details && (
                          <div className="text-sm text-gray-600 leading-relaxed">{event.details}</div>
                        )}
                        <div className="text-xs text-gray-500 mt-1">By {event.actor}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* PM Notes */}
            <div>
              <h3 className="text-xs text-gray-500 font-medium mb-3">PM NOTES</h3>
              <div className="space-y-3">
                {selectedRisk.pmNotes.map((note) => (
                  <div key={note.id} className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-gray-900 font-medium">{note.author}</span>
                      <span className="text-xs text-gray-500">• {note.date}</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{note.note}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Metadata */}
            <div className="pt-4 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="text-gray-500 mb-1">Created</div>
                  <div className="text-gray-900">{selectedRisk.created}</div>
                </div>
                <div>
                  <div className="text-gray-500 mb-1">Last Updated</div>
                  <div className="text-gray-900">{selectedRisk.lastUpdated}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons - Fixed at bottom */}
          <div className="p-6 border-t border-gray-200 space-y-2 flex-shrink-0 bg-white">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              <ArrowUpCircle className="w-4 h-4" />
              <span className="text-sm">Escalate</span>
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <User className="w-4 h-4" />
                <span className="text-sm">Reassign</span>
              </button>
              <button className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Set Due Date</span>
              </button>
            </div>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <MessageSquare className="w-4 h-4" />
              <span className="text-sm">Add PM Note</span>
            </button>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-sm">Mark Resolved</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

// Helper Components
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