import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronDown, RefreshCw, CheckCircle2, AlertTriangle, TrendingUp, TrendingDown, Plus, Copy, Download, FileText, Sparkles, Eye, Edit3, Link, ArrowRight, Calendar, XCircle, X } from 'lucide-react';

interface ProjectSignal {
  id: string;
  type: 'milestone-status' | 'blocker' | 'forecast-change' | 'completion' | 'risk-change';
  category: 'on-track' | 'at-risk' | 'blocked' | 'decision-needed' | 'plan';
  title: string;
  details: string;
  suggestedBullet: {
    executive: string;
    operational: string;
  };
  source: string;
  confidence: 'high' | 'medium' | 'low';
  milestone?: string;
  inserted: boolean;
}

interface ReportSection {
  title: string;
  key: string;
  bullets: ReportBullet[];
}

interface ReportBullet {
  id: string;
  text: string;
  sourceSignalId?: string;
  isEdited: boolean;
  confidence: 'high' | 'medium' | 'low';
}

const projectSignals: ProjectSignal[] = [
  // On Track
  {
    id: 'SIG-001',
    type: 'milestone-status',
    category: 'on-track',
    title: 'M1 Auth Release on schedule for Mar 15',
    details: 'OAuth implementation complete, RBAC finished, risk level reduced to LOW',
    suggestedBullet: {
      executive: 'M1 Auth Release remains on schedule for Mar 15 delivery with risk reduced to LOW after completing core authentication components',
      operational: 'M1 Auth Release (Mar 15) on track: OAuth callback implementation complete (APP-237), RBAC implementation finished (APP-236), risk reduced from MEDIUM to LOW. Only minor bug fixes remaining.',
    },
    source: 'Milestone Dashboard',
    confidence: 'high',
    milestone: 'M1 Auth Release',
    inserted: true,
  },
  {
    id: 'SIG-002',
    type: 'completion',
    category: 'on-track',
    title: 'Security penetration testing completed with zero critical findings',
    details: 'QA-446: OWASP Top 10 testing complete, all critical/high findings remediated',
    suggestedBullet: {
      executive: 'Security penetration testing completed successfully with zero critical findings, final report submitted',
      operational: 'Completed security penetration testing (QA-446) with zero critical findings. All OWASP Top 10 vulnerabilities addressed. Final report submitted to ISSO for ATO package.',
    },
    source: 'Change Timeline - Feb 29',
    confidence: 'high',
    milestone: 'M2 ATO Package',
    inserted: true,
  },
  {
    id: 'SIG-003',
    type: 'completion',
    category: 'on-track',
    title: 'Load balancer CAB approval received',
    details: 'CAB-2026-0234 approved, implementation window Mar 4-5',
    suggestedBullet: {
      executive: 'Production load balancer configuration approved by Change Advisory Board with implementation scheduled Mar 4-5',
      operational: 'CAB approved production load balancer config (CAB-2026-0234) with implementation window Mar 4-5. Network team prepared for cutover.',
    },
    source: 'Change Timeline - Feb 28',
    confidence: 'high',
    milestone: 'M3 Cutover',
    inserted: true,
  },

  // At Risk
  {
    id: 'SIG-004',
    type: 'forecast-change',
    category: 'at-risk',
    title: 'M2 ATO Package forecast slipped +3 days to Mar 25',
    details: 'Security scan approval delays from CISO office',
    suggestedBullet: {
      executive: 'M2 ATO Package delivery forecast adjusted to Mar 25 (3-day slip) due to CISO security scan approval delays',
      operational: 'M2 ATO Package forecast moved from Mar 22 to Mar 25 (+3 days) due to CISO security control assessment delays. Mitigation in progress with Program Sponsor engagement.',
    },
    source: 'Milestone Dashboard',
    confidence: 'high',
    milestone: 'M2 ATO Package',
    inserted: true,
  },
  {
    id: 'SIG-005',
    type: 'risk-change',
    category: 'at-risk',
    title: 'SSO vendor API stability concerns',
    details: 'Two unplanned outages in 10 days, vendor escalation scheduled',
    suggestedBullet: {
      executive: 'Monitoring SSO vendor API reliability after two recent outages; vendor escalation meeting scheduled for Mar 4',
      operational: 'SSO vendor API experienced two outages (Feb 19, Feb 24) impacting integration testing. Vendor escalation call scheduled Mar 4 to request SLA commitment and root cause analysis.',
    },
    source: 'Risk Log - RSK-003',
    confidence: 'medium',
    milestone: 'M1 Auth Release',
    inserted: true,
  },

  // Blocked
  {
    id: 'SIG-006',
    type: 'blocker',
    category: 'blocked',
    title: 'CISO security scan approval delayed 12 days',
    details: 'CISO office backlog blocking ATO package submission',
    suggestedBullet: {
      executive: 'CISO security control assessment review delayed 12 days due to office backlog; escalated to Program Sponsor with review now scheduled Mar 3',
      operational: 'Critical: CISO security scan approval delayed 12 days (originally Feb 18, now Mar 3). Blocking ATO package submission. Escalated to Program Sponsor on Feb 28; Sponsor engaging CISO leadership.',
    },
    source: 'Risk Log - RSK-001',
    confidence: 'high',
    milestone: 'M2 ATO Package',
    inserted: true,
  },
  {
    id: 'SIG-007',
    type: 'blocker',
    category: 'blocked',
    title: 'Production environment provisioning stuck in CAB queue',
    details: '8 days pending, no review date scheduled',
    suggestedBullet: {
      executive: 'Production cloud environment provisioning request pending CAB approval for 8 days; emergency review session requested for Mar 4',
      operational: 'Production environment provisioning (CR-2026-0445) pending CAB approval for 8 days. No scheduled review date. Emergency CAB session requested Mar 4. Blocking all cutover prep activities.',
    },
    source: 'Risk Log - RSK-002',
    confidence: 'high',
    milestone: 'M3 Cutover',
    inserted: false,
  },

  // Decisions/Escalations Needed
  {
    id: 'SIG-008',
    type: 'blocker',
    category: 'decision-needed',
    title: 'Database migration approach decision required',
    details: 'Staging environment version mismatch blocking migration testing',
    suggestedBullet: {
      executive: 'Decision needed: Upgrade staging PostgreSQL environment vs. rewrite migration scripts to resolve version compatibility issue',
      operational: 'Decision meeting scheduled Mar 3: Choose between (1) upgrading staging to PostgreSQL v14.2 for production parity (requires CAB, 2-3 days), or (2) rewriting migration scripts for v13 compatibility. Blocking cutover rehearsal.',
    },
    source: 'Risk Log - RSK-005',
    confidence: 'high',
    milestone: 'M3 Cutover',
    inserted: true,
  },
  {
    id: 'SIG-009',
    type: 'blocker',
    category: 'decision-needed',
    title: 'FedRAMP compliance gap analysis required',
    details: 'Agency requested additional controls documentation',
    suggestedBullet: {
      executive: 'Agency requires additional FedRAMP Moderate control evidence (AC-2 family) before ATO submission; compliance team working to Mar 10 deadline',
      operational: 'Agency pre-submission review identified FedRAMP control gaps: AC-2(1), AC-2(3), AC-2(5) require additional evidence. Compliance team compiling documentation, targeting Mar 10 completion for Mar 11 submission.',
    },
    source: 'Risk Log - RSK-004',
    confidence: 'medium',
    milestone: 'M2 ATO Package',
    inserted: true,
  },

  // Next Week Plan (not inserted yet)
  {
    id: 'SIG-010',
    type: 'milestone-status',
    category: 'plan',
    title: 'CISO security review scheduled Mar 3',
    details: 'Review meeting confirmed for 2pm, preparing brief materials',
    suggestedBullet: {
      executive: 'Complete CISO security control assessment review (Mar 3) to unblock ATO package submission',
      operational: 'Week of Mar 3-7 priorities: (1) Complete CISO security review Mar 3 at 2pm, (2) Emergency CAB session Mar 4 for production environment, (3) Database migration decision meeting Mar 3, (4) Vendor escalation call Mar 4.',
    },
    source: 'Milestone Dashboard',
    confidence: 'medium',
    milestone: 'M2 ATO Package',
    inserted: false,
  },
  {
    id: 'SIG-011',
    type: 'milestone-status',
    category: 'plan',
    title: 'M1 Auth Release final testing week',
    details: 'Integration testing, performance validation, user acceptance',
    suggestedBullet: {
      executive: 'Complete M1 Auth Release final testing and validation for Mar 15 delivery',
      operational: 'M1 Auth Release final testing week: complete integration testing, performance validation in load test environment, user acceptance testing with pilot group. Target Mar 15 delivery.',
    },
    source: 'Workstream Execution',
    confidence: 'high',
    milestone: 'M1 Auth Release',
    inserted: false,
  },
];

// Previous report bullets for comparison
const previousReportBullets = {
  'on-track': [
    'M1 Auth Release on track for Mar 15 with MEDIUM risk',
    'Core authentication components in development',
  ],
  'at-risk': [
    'M2 ATO Package on track for Mar 22 delivery',
    'CISO security review scheduled for Feb 18',
  ],
  'blocked': [
    'SSO vendor API integration blocked by outage',
  ],
  'decision-needed': [
    'FedRAMP compliance documentation in progress',
  ],
};

export function StatusReportBuilderScreen() {
  const navigate = useNavigate();
  const [audience, setAudience] = useState<'client' | 'internal' | 'delivery'>('client');
  const [tone, setTone] = useState<'executive' | 'operational'>('executive');
  const [showComparison, setShowComparison] = useState(false);
  const [signals, setSignals] = useState(projectSignals);

  // Initialize report sections with pre-inserted bullets
  const [reportSections, setReportSections] = useState<ReportSection[]>([
    {
      title: 'Overall Status',
      key: 'overall',
      bullets: [
        {
          id: 'OVERALL-1',
          text: 'Program remains on track for Q1 delivery with 1 of 3 milestones complete and 2 in progress. M2 ATO Package adjusted +3 days due to CISO approval delays.',
          isEdited: false,
          confidence: 'high',
        },
      ],
    },
    {
      title: 'On Track',
      key: 'on-track',
      bullets: signals.filter(s => s.category === 'on-track' && s.inserted).map(s => ({
        id: `BULLET-${s.id}`,
        text: s.suggestedBullet[tone],
        sourceSignalId: s.id,
        isEdited: false,
        confidence: s.confidence,
      })),
    },
    {
      title: 'At Risk',
      key: 'at-risk',
      bullets: signals.filter(s => s.category === 'at-risk' && s.inserted).map(s => ({
        id: `BULLET-${s.id}`,
        text: s.suggestedBullet[tone],
        sourceSignalId: s.id,
        isEdited: false,
        confidence: s.confidence,
      })),
    },
    {
      title: 'Blocked',
      key: 'blocked',
      bullets: signals.filter(s => s.category === 'blocked' && s.inserted).map(s => ({
        id: `BULLET-${s.id}`,
        text: s.suggestedBullet[tone],
        sourceSignalId: s.id,
        isEdited: false,
        confidence: s.confidence,
      })),
    },
    {
      title: 'Decisions / Escalations Needed',
      key: 'decision-needed',
      bullets: signals.filter(s => s.category === 'decision-needed' && s.inserted).map(s => ({
        id: `BULLET-${s.id}`,
        text: s.suggestedBullet[tone],
        sourceSignalId: s.id,
        isEdited: false,
        confidence: s.confidence,
      })),
    },
    {
      title: 'Next Week Plan',
      key: 'plan',
      bullets: [],
    },
  ]);

  const insertSignal = (signal: ProjectSignal) => {
    // Mark signal as inserted
    setSignals(prev => prev.map(s => 
      s.id === signal.id ? { ...s, inserted: true } : s
    ));

    // Add to appropriate section
    setReportSections(prev => prev.map(section => {
      if (section.key === signal.category) {
        return {
          ...section,
          bullets: [
            ...section.bullets,
            {
              id: `BULLET-${signal.id}`,
              text: signal.suggestedBullet[tone],
              sourceSignalId: signal.id,
              isEdited: false,
              confidence: signal.confidence,
            },
          ],
        };
      }
      return section;
    }));
  };

  const removeBullet = (bullet: ReportBullet, sectionKey: string) => {
    // Remove from report section
    setReportSections(prev => prev.map(section => {
      if (section.key === sectionKey) {
        return {
          ...section,
          bullets: section.bullets.filter(b => b.id !== bullet.id),
        };
      }
      return section;
    }));

    // Mark source signal as not inserted (if it has a source)
    if (bullet.sourceSignalId) {
      setSignals(prev => prev.map(s => 
        s.id === bullet.sourceSignalId ? { ...s, inserted: false } : s
      ));
    }
  };

  const audienceConfig = {
    client: { label: 'Client Leadership', icon: '🏛️' },
    internal: { label: 'Internal Leadership', icon: '👔' },
    delivery: { label: 'Delivery Team', icon: '💻' },
  };

  const signalTypeConfig = {
    'milestone-status': { icon: CheckCircle2, color: 'text-blue-600' },
    'blocker': { icon: XCircle, color: 'text-red-600' },
    'forecast-change': { icon: TrendingDown, color: 'text-orange-600' },
    'completion': { icon: CheckCircle2, color: 'text-green-600' },
    'risk-change': { icon: AlertTriangle, color: 'text-yellow-600' },
  };

  const confidenceConfig = {
    high: { bg: 'bg-green-100', text: 'text-green-700', label: 'High Confidence' },
    medium: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Medium Confidence' },
    low: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Low Confidence' },
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="w-[1440px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl text-gray-900">Status Report Builder</h1>
              <div className="text-sm text-gray-600 mt-1">Turn live project signals into PM-editable reports</div>
            </div>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Audience Selector */}
              <div>
                <label className="text-xs text-gray-500 block mb-1">Audience</label>
                <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
                  {(['client', 'internal', 'delivery'] as const).map((aud) => (
                    <button
                      key={aud}
                      onClick={() => setAudience(aud)}
                      className={`px-3 py-1.5 rounded text-sm transition-colors ${
                        audience === aud
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <span className="mr-1.5">{audienceConfig[aud].icon}</span>
                      {audienceConfig[aud].label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reporting Period */}
              <div>
                <label className="text-xs text-gray-500 block mb-1">Reporting Period</label>
                <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 bg-white rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  <Calendar className="w-4 h-4" />
                  <span>Feb 24 - Mar 2, 2026</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              {/* Tone Toggle */}
              <div>
                <label className="text-xs text-gray-500 block mb-1">Detail Level</label>
                <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
                  <button
                    onClick={() => setTone('executive')}
                    className={`px-3 py-1.5 rounded text-sm transition-colors ${
                      tone === 'executive'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Executive
                  </button>
                  <button
                    onClick={() => setTone('operational')}
                    className={`px-3 py-1.5 rounded text-sm transition-colors ${
                      tone === 'operational'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Operational
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowComparison(!showComparison)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  showComparison
                    ? 'bg-purple-100 text-purple-700'
                    : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Eye className="w-4 h-4" />
                Compare
              </button>
              <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                <RefreshCw className="w-4 h-4" />
                Rebuild Draft
              </button>
              <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                <Copy className="w-4 h-4" />
                Copy Text
              </button>
              <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                <Download className="w-4 h-4" />
                Export
              </button>
              <button className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                <CheckCircle2 className="w-4 h-4" />
                Approve
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="w-[1440px] mx-auto px-6 py-6 flex gap-6">
        {/* Left Panel - Project Signals */}
        <div className="w-[420px] space-y-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-gray-900">Live Project Signals</h2>
            <span className="text-xs text-gray-500">{signals.filter(s => !s.inserted).length} available</span>
          </div>

          {/* Signal Categories */}
          <div className="space-y-3">
            {[
              { key: 'on-track', label: 'On Track', icon: CheckCircle2, color: 'text-green-600' },
              { key: 'at-risk', label: 'At Risk', icon: AlertTriangle, color: 'text-orange-600' },
              { key: 'blocked', label: 'Blocked', icon: XCircle, color: 'text-red-600' },
              { key: 'decision-needed', label: 'Decisions Needed', icon: AlertTriangle, color: 'text-purple-600' },
              { key: 'plan', label: 'Next Week', icon: ArrowRight, color: 'text-blue-600' },
            ].map(category => {
              const categorySignals = signals.filter(s => s.category === category.key);
              const Icon = category.icon;

              return (
                <div key={category.key} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${category.color}`} />
                    <span className="text-sm text-gray-900 font-medium">{category.label}</span>
                    <span className="ml-auto text-xs text-gray-500">{categorySignals.length}</span>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {categorySignals.map(signal => {
                      const typeConfig = signalTypeConfig[signal.type];
                      const TypeIcon = typeConfig.icon;
                      const confConfig = confidenceConfig[signal.confidence];

                      return (
                        <div
                          key={signal.id}
                          className={`p-3 transition-colors ${
                            signal.inserted
                              ? 'bg-blue-50 opacity-60'
                              : 'hover:bg-gray-50 cursor-pointer'
                          }`}
                          onClick={() => !signal.inserted && insertSignal(signal)}
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5">
                              <TypeIcon className={`w-4 h-4 ${typeConfig.color}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm text-gray-900 mb-1">{signal.title}</div>
                              <div className="text-xs text-gray-600 mb-2">{signal.details}</div>
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 text-xs rounded ${confConfig.bg} ${confConfig.text}`}>
                                  {confConfig.label}
                                </span>
                                <span className="text-xs text-gray-500">{signal.source}</span>
                              </div>
                              {signal.inserted && (
                                <div className="flex items-center gap-1 mt-2 text-xs text-blue-700">
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>Inserted in report</span>
                                </div>
                              )}
                            </div>
                            {!signal.inserted && (
                              <button className="flex-shrink-0 p-1.5 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors">
                                <Plus className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Panel - Report Draft / Comparison */}
        <div className="flex-1 bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col">
          {!showComparison ? (
            // Normal Report Draft View
            <>
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-600" />
                  <div>
                    <h2 className="text-gray-900">Report Draft</h2>
                    <div className="text-xs text-gray-500">Client Leadership • Week of Feb 24 - Mar 2, 2026</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Auto-saved 2m ago</span>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Edit3 className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {reportSections.map(section => (
                  <div key={section.key} className="space-y-3">
                    <h3 className="text-sm text-gray-900 font-medium border-b border-gray-200 pb-2">
                      {section.title}
                    </h3>
                    {section.bullets.length === 0 ? (
                      <div className="text-sm text-gray-500 italic py-2">
                        No items yet. Click signals from the left panel to add.
                      </div>
                    ) : (
                      <ul className="space-y-3">
                        {section.bullets.map((bullet, idx) => {
                          const sourceSignal = signals.find(s => s.id === bullet.sourceSignalId);
                          const confConfig = confidenceConfig[bullet.confidence];

                          return (
                            <li key={bullet.id} className="flex items-start gap-3 group">
                              <span className="text-sm text-gray-400 mt-1 select-none">•</span>
                              <div className="flex-1">
                                <div className="text-sm text-gray-700 leading-relaxed">
                                  {bullet.text}
                                </div>
                                {bullet.sourceSignalId && (
                                  <div className="flex items-center gap-2 mt-2">
                                    <span className={`px-2 py-0.5 text-xs rounded ${confConfig.bg} ${confConfig.text}`}>
                                      {confConfig.label}
                                    </span>
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                      <Link className="w-3 h-3" />
                                      <span>{sourceSignal?.source}</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                <button 
                                  onClick={() => removeBullet(bullet, section.key)}
                                  className="p-1.5 hover:bg-red-100 rounded transition-colors"
                                  title="Remove from report"
                                >
                                  <X className="w-3.5 h-3.5 text-red-600" />
                                </button>
                                <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                                  <Edit3 className="w-3.5 h-3.5 text-gray-600" />
                                </button>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                ))}
              </div>

              {/* Traceability Bar */}
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Link className="w-4 h-4" />
                  <span className="font-medium">Report Traceability:</span>
                  <span>{reportSections.flatMap(s => s.bullets).filter(b => b.sourceSignalId).length} bullets linked to source signals</span>
                  <span>•</span>
                  <span>{reportSections.flatMap(s => s.bullets).filter(b => b.confidence === 'high').length} high confidence</span>
                  <span>•</span>
                  <span>{reportSections.flatMap(s => s.bullets).filter(b => b.isEdited).length} manually edited</span>
                </div>
              </div>
            </>
          ) : (
            // Comparison View
            <>
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-purple-600" />
                  <div>
                    <h2 className="text-gray-900">Compare with Previous Report</h2>
                    <div className="text-xs text-gray-500">Current draft vs. Feb 17-23, 2026 report</div>
                  </div>
                </div>
                <button
                  onClick={() => setShowComparison(false)}
                  className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Close Comparison
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-2 h-full">
                  {/* Previous Report */}
                  <div className="border-r border-gray-200 p-6 space-y-6 bg-gray-50">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-sm text-gray-900 font-medium">Previous Report</span>
                      <span className="text-xs text-gray-500">Feb 17-23, 2026</span>
                    </div>

                    {[
                      { title: 'On Track', key: 'on-track' },
                      { title: 'At Risk', key: 'at-risk' },
                      { title: 'Blocked', key: 'blocked' },
                      { title: 'Decisions Needed', key: 'decision-needed' },
                    ].map(section => (
                      <div key={section.key} className="space-y-3">
                        <h3 className="text-sm text-gray-900 font-medium border-b border-gray-300 pb-2">
                          {section.title}
                        </h3>
                        <ul className="space-y-2">
                          {previousReportBullets[section.key as keyof typeof previousReportBullets]?.map((bullet, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-sm text-gray-400 mt-1">•</span>
                              <span className="text-sm text-gray-600 leading-relaxed">{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* Current Report with Diff Highlighting */}
                  <div className="p-6 space-y-6 bg-white">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-sm text-gray-900 font-medium">Current Draft</span>
                      <span className="text-xs text-gray-500">Feb 24 - Mar 2, 2026</span>
                    </div>

                    {/* On Track - Shows what moved from At Risk */}
                    <div className="space-y-3">
                      <h3 className="text-sm text-gray-900 font-medium border-b border-gray-200 pb-2">
                        On Track
                      </h3>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-2 bg-green-50 border-l-2 border-green-500 pl-3 py-2 rounded-r">
                          <span className="text-sm text-gray-400 mt-1">•</span>
                          <div className="flex-1">
                            <span className="text-sm text-gray-700 leading-relaxed">
                              M1 Auth Release remains on schedule for Mar 15 delivery with risk reduced to LOW after completing core authentication components
                            </span>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="px-2 py-0.5 bg-green-200 text-green-800 rounded text-xs">
                                Risk Improved
                              </span>
                            </div>
                          </div>
                        </li>
                        {reportSections[1].bullets.slice(1).map(bullet => (
                          <li key={bullet.id} className="flex items-start gap-2 bg-blue-50 border-l-2 border-blue-500 pl-3 py-2 rounded-r">
                            <span className="text-sm text-gray-400 mt-1">•</span>
                            <div className="flex-1">
                              <span className="text-sm text-gray-700 leading-relaxed">{bullet.text}</span>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="px-2 py-0.5 bg-blue-200 text-blue-800 rounded text-xs">
                                  New
                                </span>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* At Risk - Shows changes */}
                    <div className="space-y-3">
                      <h3 className="text-sm text-gray-900 font-medium border-b border-gray-200 pb-2">
                        At Risk
                      </h3>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-2 bg-red-50 border-l-2 border-red-500 pl-3 py-2 rounded-r">
                          <span className="text-sm text-gray-400 mt-1">•</span>
                          <div className="flex-1">
                            <div className="text-sm text-gray-500 line-through mb-1">
                              M2 ATO Package on track for Mar 22 delivery
                            </div>
                            <div className="text-sm text-gray-700 leading-relaxed">
                              M2 ATO Package delivery forecast adjusted to Mar 25 (3-day slip) due to CISO security scan approval delays
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="px-2 py-0.5 bg-orange-200 text-orange-800 rounded text-xs">
                                Forecast Slipped
                              </span>
                            </div>
                          </div>
                        </li>
                        {reportSections[2].bullets.slice(1).map(bullet => (
                          <li key={bullet.id} className="flex items-start gap-2 bg-blue-50 border-l-2 border-blue-500 pl-3 py-2 rounded-r">
                            <span className="text-sm text-gray-400 mt-1">•</span>
                            <div className="flex-1">
                              <span className="text-sm text-gray-700 leading-relaxed">{bullet.text}</span>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="px-2 py-0.5 bg-blue-200 text-blue-800 rounded text-xs">
                                  New
                                </span>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Blocked */}
                    <div className="space-y-3">
                      <h3 className="text-sm text-gray-900 font-medium border-b border-gray-200 pb-2">
                        Blocked
                      </h3>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-2 bg-red-50 border-l-2 border-red-500 pl-3 py-2 rounded-r">
                          <span className="text-sm text-gray-400 mt-1">•</span>
                          <div className="flex-1">
                            <span className="text-sm text-gray-700 leading-relaxed">
                              CISO security control assessment review delayed 12 days due to office backlog; escalated to Program Sponsor with review now scheduled Mar 3
                            </span>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="px-2 py-0.5 bg-red-200 text-red-800 rounded text-xs">
                                Escalated
                              </span>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>

                    {/* Decisions Needed */}
                    <div className="space-y-3">
                      <h3 className="text-sm text-gray-900 font-medium border-b border-gray-200 pb-2">
                        Decisions / Escalations Needed
                      </h3>
                      <ul className="space-y-3">
                        {reportSections[4].bullets.map(bullet => (
                          <li key={bullet.id} className="flex items-start gap-2">
                            <span className="text-sm text-gray-400 mt-1">•</span>
                            <span className="text-sm text-gray-700 leading-relaxed">{bullet.text}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comparison Summary Bar */}
              <div className="px-6 py-3 bg-purple-50 border-t border-purple-200">
                <div className="flex items-center gap-4 text-xs text-purple-900">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-blue-500 rounded" />
                    <span>2 New items</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-orange-500 rounded" />
                    <span>1 Changed</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-500 rounded" />
                    <span>1 Improved</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-500 rounded" />
                    <span>1 Escalated</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}