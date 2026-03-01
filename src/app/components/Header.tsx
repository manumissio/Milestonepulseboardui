import { ChevronDown, RefreshCw, CheckCircle2 } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="w-[1440px] mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            {/* Program Selector */}
            <div className="flex items-center gap-2">
              <h1 className="text-lg text-gray-900">Enterprise Modernization Program</h1>
              <button className="p-1 hover:bg-gray-100 rounded">
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* Week/Date Range */}
            <div className="text-sm text-gray-600">
              Week of Feb 24 – Mar 2, 2026
            </div>
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
