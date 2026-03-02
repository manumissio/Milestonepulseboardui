import { ChevronDown, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="w-[1440px] mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            {/* Program Selector */}
            <div className="flex items-center gap-2">
              <button onClick={() => navigate('/')}>
                <h1 className="text-lg text-gray-900 hover:text-blue-600 transition-colors">
                  Enterprise Modernization Program
                </h1>
              </button>
              <button className="p-1 hover:bg-gray-100 rounded">
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* Week/Date Range */}
            <div className="text-sm text-gray-600">
              Week of Feb 24 – Mar 2, 2026
            </div>

            {/* Navigation */}
            <nav className="flex items-center gap-1">
              <button
                onClick={() => navigate('/')}
                className={`px-3 py-1.5 rounded text-sm transition-colors ${
                  location.pathname === '/' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate('/blockers')}
                className={`px-3 py-1.5 rounded text-sm transition-colors ${
                  location.pathname === '/blockers' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Blockers
              </button>
              <button
                onClick={() => navigate('/workstreams')}
                className={`px-3 py-1.5 rounded text-sm transition-colors ${
                  location.pathname === '/workstreams' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Workstreams
              </button>
              <button
                onClick={() => navigate('/risks')}
                className={`px-3 py-1.5 rounded text-sm transition-colors ${
                  location.pathname === '/risks' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Risks
              </button>
              <button
                onClick={() => navigate('/changes')}
                className={`px-3 py-1.5 rounded text-sm transition-colors ${
                  location.pathname === '/changes' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Changes
              </button>
              <button
                onClick={() => navigate('/report')}
                className={`px-3 py-1.5 rounded text-sm transition-colors ${
                  location.pathname === '/report' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Report
              </button>
              <button
                onClick={() => navigate('/integrations')}
                className={`px-3 py-1.5 rounded text-sm transition-colors ${
                  location.pathname === '/integrations' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Settings
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-6">
            {/* Sync Status */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-600">Jira</span>
                <span className="text-xs text-gray-400">2m ago</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-600">Azure DevOps</span>
                <span className="text-xs text-gray-400">5m ago</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-600">Smartsheet</span>
                <span className="text-xs text-gray-400">1m ago</span>
              </div>
            </div>

            {/* Refresh Button */}
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
              <RefreshCw className="w-4 h-4" />
              <span className="text-sm">Refresh</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}