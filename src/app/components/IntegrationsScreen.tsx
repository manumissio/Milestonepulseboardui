import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronDown, RefreshCw, CheckCircle2, AlertTriangle, XCircle, Settings, Link2, Link2Off, Plus, Save, Eye, Clock, User, Shield, Edit3, Check, X, ChevronRight, AlertCircle } from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  type: 'jira' | 'azure-devops' | 'smartsheet';
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: string;
  syncHealth: 'healthy' | 'warning' | 'error' | 'never-synced';
  errorMessage?: string;
  recordCount?: number;
  nextSync?: string;
}

interface FieldMapping {
  productField: string;
  label: string;
  sourceField: string;
  required: boolean;
  type: 'text' | 'select' | 'date' | 'user' | 'tag';
  validation?: string;
}

interface Rule {
  id: string;
  name: string;
  category: 'blocker' | 'alert' | 'escalation' | 'report';
  enabled: boolean;
  config: string;
}

interface SyncLogEntry {
  id: string;
  timestamp: string;
  integration: string;
  status: 'success' | 'warning' | 'error';
  message: string;
  recordsProcessed?: number;
  errors?: number;
}

const integrations: Integration[] = [
  {
    id: 'INT-001',
    name: 'Jira - Program Board',
    type: 'jira',
    status: 'error',
    lastSync: '2 hours ago',
    syncHealth: 'error',
    errorMessage: 'Authentication failed: API token expired. Please reconnect.',
    recordCount: 247,
    nextSync: 'Paused due to error',
  },
  {
    id: 'INT-002',
    name: 'Azure DevOps - Delivery Pipeline',
    type: 'azure-devops',
    status: 'connected',
    lastSync: '15 minutes ago',
    syncHealth: 'healthy',
    recordCount: 189,
    nextSync: 'In 45 minutes',
  },
  {
    id: 'INT-003',
    name: 'Smartsheet - Executive Dashboard',
    type: 'smartsheet',
    status: 'disconnected',
    syncHealth: 'never-synced',
    nextSync: 'Not configured',
  },
];

const jiraFieldMappings: FieldMapping[] = [
  {
    productField: 'status',
    label: 'Work Item Status',
    sourceField: 'status.name',
    required: true,
    type: 'select',
    validation: 'Valid values: To Do, In Progress, Done, Blocked',
  },
  {
    productField: 'owner',
    label: 'Owner / Assignee',
    sourceField: 'assignee.displayName',
    required: true,
    type: 'user',
  },
  {
    productField: 'milestone',
    label: 'Milestone / Epic',
    sourceField: 'customfield_10014',
    required: false,
    type: 'select',
    validation: 'Maps to Epic Link custom field',
  },
  {
    productField: 'blockerTag',
    label: 'Blocker Tag',
    sourceField: 'labels',
    required: false,
    type: 'tag',
    validation: 'Looks for "blocked" or "blocker" in labels',
  },
  {
    productField: 'dueDate',
    label: 'Due Date',
    sourceField: 'duedate',
    required: false,
    type: 'date',
  },
  {
    productField: 'priority',
    label: 'Priority',
    sourceField: 'priority.name',
    required: false,
    type: 'select',
  },
  {
    productField: 'workstream',
    label: 'Workstream / Component',
    sourceField: 'components[0].name',
    required: false,
    type: 'select',
  },
];

const rules: Rule[] = [
  {
    id: 'RULE-001',
    name: 'Auto-detect blockers from status',
    category: 'blocker',
    enabled: true,
    config: 'When status = "Blocked" for > 2 days',
  },
  {
    id: 'RULE-002',
    name: 'Flag overdue items as at-risk',
    category: 'alert',
    enabled: true,
    config: 'When due date is past and status ≠ Done',
  },
  {
    id: 'RULE-003',
    name: 'Escalate critical blockers',
    category: 'escalation',
    enabled: true,
    config: 'When priority = Critical and blocked > 5 days',
  },
  {
    id: 'RULE-004',
    name: 'Auto-generate weekly status report',
    category: 'report',
    enabled: false,
    config: 'Every Friday at 3pm',
  },
  {
    id: 'RULE-005',
    name: 'Notify on forecast slip',
    category: 'alert',
    enabled: true,
    config: 'When milestone forecast changes > 2 days',
  },
];

const syncLogs: SyncLogEntry[] = [
  {
    id: 'LOG-001',
    timestamp: 'Mar 2, 2026 2:30 PM',
    integration: 'Jira - Program Board',
    status: 'error',
    message: 'Sync failed: API token expired. Authentication required.',
    recordsProcessed: 0,
    errors: 1,
  },
  {
    id: 'LOG-002',
    timestamp: 'Mar 2, 2026 2:15 PM',
    integration: 'Azure DevOps - Delivery Pipeline',
    status: 'success',
    message: 'Sync completed successfully',
    recordsProcessed: 189,
    errors: 0,
  },
  {
    id: 'LOG-003',
    timestamp: 'Mar 2, 2026 1:00 PM',
    integration: 'Azure DevOps - Delivery Pipeline',
    status: 'success',
    message: 'Sync completed successfully',
    recordsProcessed: 187,
    errors: 0,
  },
  {
    id: 'LOG-004',
    timestamp: 'Mar 2, 2026 12:30 PM',
    integration: 'Jira - Program Board',
    status: 'warning',
    message: 'Sync completed with warnings: 3 records had missing milestone mappings',
    recordsProcessed: 247,
    errors: 3,
  },
  {
    id: 'LOG-005',
    timestamp: 'Mar 2, 2026 11:15 AM',
    integration: 'Azure DevOps - Delivery Pipeline',
    status: 'success',
    message: 'Sync completed successfully',
    recordsProcessed: 185,
    errors: 0,
  },
];

export function IntegrationsScreen() {
  const navigate = useNavigate();
  const [selectedEnvironment, setSelectedEnvironment] = useState('production');
  const [expandedMapping, setExpandedMapping] = useState<string | null>('INT-001'); // Jira expanded by default
  const [editingField, setEditingField] = useState<string | null>(null);

  const integrationTypeConfig = {
    jira: {
      logo: '🔷',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
    },
    'azure-devops': {
      logo: '🔵',
      color: 'text-blue-700',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
    },
    smartsheet: {
      logo: '📊',
      color: 'text-green-600',
      bg: 'bg-green-50',
      border: 'border-green-200',
    },
  };

  const syncHealthConfig = {
    healthy: { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', label: 'Healthy' },
    warning: { icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-50', label: 'Warning' },
    error: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', label: 'Error' },
    'never-synced': { icon: Clock, color: 'text-gray-400', bg: 'bg-gray-50', label: 'Not Configured' },
  };

  const ruleCategoryConfig = {
    blocker: { icon: XCircle, color: 'text-red-600', label: 'Blocker Detection' },
    alert: { icon: AlertTriangle, color: 'text-orange-600', label: 'Alert Rules' },
    escalation: { icon: AlertCircle, color: 'text-purple-600', label: 'Escalation Rules' },
    report: { icon: Clock, color: 'text-blue-600', label: 'Report Automation' },
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="w-[1440px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl text-gray-900">Integrations & Rules</h1>
              <div className="text-sm text-gray-600 mt-1">Configure data sources, field mappings, and automation rules</div>
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

          {/* Environment Selector */}
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-600">Environment:</label>
            <EnvironmentSelector
              options={[
                { value: 'production', label: 'Production', icon: '🟢' },
                { value: 'staging', label: 'Staging', icon: '🟡' },
                { value: 'development', label: 'Development', icon: '🔵' },
              ]}
              value={selectedEnvironment}
              onChange={setSelectedEnvironment}
            />
            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs text-gray-500">Last updated: 2:30 PM</span>
              <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                <Save className="w-4 h-4" />
                Save Configuration
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="w-[1440px] mx-auto px-6 py-6 space-y-6">
        {/* Integration Cards */}
        <section>
          <h2 className="text-gray-900 mb-4">Connected Integrations</h2>
          <div className="grid grid-cols-3 gap-4">
            {integrations.map((integration) => {
              const typeConfig = integrationTypeConfig[integration.type];
              const healthConfig = syncHealthConfig[integration.syncHealth];
              const HealthIcon = healthConfig.icon;
              const isExpanded = expandedMapping === integration.id;

              return (
                <div
                  key={integration.id}
                  className={`bg-white border-2 rounded-lg overflow-hidden ${
                    integration.syncHealth === 'error'
                      ? 'border-red-300'
                      : integration.status === 'connected'
                      ? 'border-green-200'
                      : 'border-gray-200'
                  }`}
                >
                  {/* Card Header */}
                  <div className={`p-4 border-b border-gray-200 ${integration.syncHealth === 'error' ? 'bg-red-50' : ''}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`text-3xl`}>{typeConfig.logo}</div>
                        <div>
                          <h3 className="text-sm text-gray-900 font-medium">{integration.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            {integration.status === 'connected' ? (
                              <span className="flex items-center gap-1 text-xs text-green-700">
                                <Link2 className="w-3 h-3" />
                                Connected
                              </span>
                            ) : integration.status === 'error' ? (
                              <span className="flex items-center gap-1 text-xs text-red-700">
                                <Link2Off className="w-3 h-3" />
                                Connection Error
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-xs text-gray-500">
                                <Link2Off className="w-3 h-3" />
                                Not Connected
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                        <Settings className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>

                    {/* Sync Health */}
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${healthConfig.bg}`}>
                      <HealthIcon className={`w-4 h-4 ${healthConfig.color}`} />
                      <span className={`text-sm ${healthConfig.color}`}>{healthConfig.label}</span>
                    </div>

                    {/* Error Message */}
                    {integration.errorMessage && (
                      <div className="mt-2 p-3 bg-red-100 border border-red-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <div className="text-xs text-red-900">{integration.errorMessage}</div>
                            <button className="mt-2 text-xs text-red-700 underline hover:text-red-800">
                              Reconnect Integration
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-4 space-y-3">
                    {integration.lastSync && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Last Sync</span>
                        <span className="text-gray-900">{integration.lastSync}</span>
                      </div>
                    )}
                    {integration.recordCount !== undefined && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Records Synced</span>
                        <span className="text-gray-900">{integration.recordCount}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Next Sync</span>
                      <span className="text-gray-900">{integration.nextSync}</span>
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-gray-200 flex gap-2">
                      {integration.status === 'connected' && (
                        <button 
                          disabled={integration.syncHealth === 'error'}
                          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                            integration.syncHealth === 'error'
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                          }`}
                        >
                          <RefreshCw className="w-4 h-4" />
                          Sync Now
                        </button>
                      )}
                      <button
                        onClick={() => setExpandedMapping(isExpanded ? null : integration.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                      >
                        <Settings className="w-4 h-4" />
                        {isExpanded ? 'Close' : 'Configure'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Expanded Field Mapping Panel - Jira */}
        {expandedMapping === 'INT-001' && (
          <section className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-gray-900">Field Mapping - Jira Program Board</h2>
                <div className="text-sm text-gray-600 mt-1">Map Jira fields to Milestone Pulse Board data structure</div>
              </div>
              <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                <Eye className="w-4 h-4" />
                Test Mapping
              </button>
            </div>

            {/* Field Mapping Table */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left text-xs text-gray-600 px-4 py-3 w-48">Product Field</th>
                    <th className="text-left text-xs text-gray-600 px-4 py-3 w-24">Required</th>
                    <th className="text-left text-xs text-gray-600 px-4 py-3">Jira Source Field</th>
                    <th className="text-left text-xs text-gray-600 px-4 py-3">Validation</th>
                    <th className="text-left text-xs text-gray-600 px-4 py-3 w-24">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jiraFieldMappings.map((mapping, idx) => {
                    const isEditing = editingField === mapping.productField;

                    return (
                      <tr key={mapping.productField} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-900 font-medium">{mapping.label}</span>
                            {mapping.required && (
                              <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs">Required</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {mapping.required ? (
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          ) : (
                            <span className="text-xs text-gray-400">Optional</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {isEditing ? (
                            <input
                              type="text"
                              defaultValue={mapping.sourceField}
                              className="w-full px-3 py-1.5 border border-blue-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter Jira field path"
                            />
                          ) : (
                            <code className="text-sm text-gray-700 bg-gray-100 px-2 py-1 rounded">{mapping.sourceField}</code>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {mapping.validation ? (
                            <span className="text-xs text-gray-600">{mapping.validation}</span>
                          ) : (
                            <span className="text-xs text-gray-400">No validation</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {isEditing ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => setEditingField(null)}
                                className="p-1 hover:bg-green-100 rounded transition-colors"
                              >
                                <Check className="w-4 h-4 text-green-600" />
                              </button>
                              <button
                                onClick={() => setEditingField(null)}
                                className="p-1 hover:bg-red-100 rounded transition-colors"
                              >
                                <X className="w-4 h-4 text-red-600" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setEditingField(mapping.productField)}
                              className="p-1 hover:bg-gray-100 rounded transition-colors"
                            >
                              <Edit3 className="w-4 h-4 text-gray-600" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Help Text */}
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="text-sm text-blue-900 font-medium mb-1">Field Mapping Tips</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Use dot notation for nested fields (e.g., <code className="bg-blue-100 px-1">status.name</code>)</li>
                    <li>• Use array notation for multi-value fields (e.g., <code className="bg-blue-100 px-1">components[0].name</code>)</li>
                    <li>• Custom fields in Jira use IDs like <code className="bg-blue-100 px-1">customfield_10014</code></li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Automation Rules */}
        <section className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-gray-900">Automation Rules</h2>
              <div className="text-sm text-gray-600 mt-1">Configure blocker detection, alerts, escalations, and report generation</div>
            </div>
            <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
              <Plus className="w-4 h-4" />
              New Rule
            </button>
          </div>

          {/* Rules List */}
          <div className="space-y-2">
            {rules.map((rule) => {
              const categoryConfig = ruleCategoryConfig[rule.category];
              const Icon = categoryConfig.icon;

              return (
                <div
                  key={rule.id}
                  className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className={`p-2 rounded-lg bg-gray-50`}>
                    <Icon className={`w-5 h-5 ${categoryConfig.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm text-gray-900 font-medium">{rule.name}</h3>
                      <span className={`px-2 py-0.5 text-xs rounded ${
                        rule.enabled
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {rule.enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">{rule.config}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors">
                      Test
                    </button>
                    <button className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors">
                      Edit
                    </button>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={rule.enabled} className="sr-only peer" readOnly />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <div className="grid grid-cols-2 gap-6">
          {/* Permissions & Roles */}
          <section className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-gray-900">Permissions & Roles</h2>
                <div className="text-sm text-gray-600 mt-1">Control who can view and edit configurations</div>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { role: 'Program Manager', users: 'J. Martinez, K. Liu', permissions: 'Full Access', color: 'text-purple-700', bg: 'bg-purple-100' },
                { role: 'Team Lead', users: 'S. Patel, M. Chen', permissions: 'Edit Rules & Mappings', color: 'text-blue-700', bg: 'bg-blue-100' },
                { role: 'Viewer', users: '12 team members', permissions: 'View Only', color: 'text-gray-700', bg: 'bg-gray-100' },
              ].map((perm, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${perm.bg}`}>
                      <Shield className={`w-4 h-4 ${perm.color}`} />
                    </div>
                    <div>
                      <div className="text-sm text-gray-900 font-medium">{perm.role}</div>
                      <div className="text-xs text-gray-600">{perm.users}</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600">{perm.permissions}</div>
                </div>
              ))}
            </div>

            <button className="mt-4 w-full flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
              <User className="w-4 h-4" />
              Manage Permissions
            </button>
          </section>

          {/* Quick Stats */}
          <section className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-gray-900 mb-4">Integration Health Summary</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-900">Healthy Integrations</span>
                </div>
                <span className="text-2xl text-green-600">1</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <span className="text-sm text-gray-900">Connection Errors</span>
                </div>
                <span className="text-2xl text-red-600">1</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-900">Not Configured</span>
                </div>
                <span className="text-2xl text-gray-600">1</span>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Total Records Synced</span>
                  <span className="text-gray-900 font-medium">436</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Last Successful Sync</span>
                  <span className="text-gray-900">15 minutes ago</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Sync Logs / Audit History */}
        <section className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-gray-900">Sync Logs & Audit History</h2>
              <div className="text-sm text-gray-600 mt-1">Recent sync activity and configuration changes</div>
            </div>
            <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left text-xs text-gray-600 px-6 py-3 w-40">Timestamp</th>
                  <th className="text-left text-xs text-gray-600 px-6 py-3">Integration</th>
                  <th className="text-left text-xs text-gray-600 px-6 py-3 w-24">Status</th>
                  <th className="text-left text-xs text-gray-600 px-6 py-3">Message</th>
                  <th className="text-left text-xs text-gray-600 px-6 py-3 w-32">Records</th>
                  <th className="text-left text-xs text-gray-600 px-6 py-3 w-24">Errors</th>
                </tr>
              </thead>
              <tbody>
                {syncLogs.map((log) => {
                  const statusConfig = {
                    success: { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100' },
                    warning: { icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-100' },
                    error: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' },
                  };
                  const config = statusConfig[log.status];
                  const Icon = config.icon;

                  return (
                    <tr key={log.id} className={`border-b border-gray-100 ${log.status === 'error' ? 'bg-red-50' : ''}`}>
                      <td className="px-6 py-3 text-sm text-gray-700">{log.timestamp}</td>
                      <td className="px-6 py-3 text-sm text-gray-900">{log.integration}</td>
                      <td className="px-6 py-3">
                        <span className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs ${config.bg} ${config.color}`}>
                          <Icon className="w-3 h-3" />
                          {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-700">{log.message}</td>
                      <td className="px-6 py-3 text-sm text-gray-700">
                        {log.recordsProcessed !== undefined ? `${log.recordsProcessed}` : '-'}
                      </td>
                      <td className="px-6 py-3">
                        {log.errors !== undefined && log.errors > 0 ? (
                          <span className="text-sm text-red-600 font-medium">{log.errors}</span>
                        ) : (
                          <span className="text-sm text-gray-400">0</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

// Helper Components
function EnvironmentSelector({ 
  options, 
  value, 
  onChange 
}: { 
  options: { value: string; label: string; icon: string }[]; 
  value: string; 
  onChange: (v: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selected = options.find(o => o.value === value);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <span>{selected?.icon}</span>
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
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 ${
                option.value === value ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
              }`}
            >
              <span>{option.icon}</span>
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
