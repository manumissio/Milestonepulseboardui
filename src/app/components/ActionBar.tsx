import { FileText, Mail, Download } from 'lucide-react';

export function ActionBar() {
  return (
    <footer className="bg-white border-t border-gray-200 sticky bottom-0">
      <div className="w-[1440px] mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Last updated: Mar 1, 2026 at 11:45 AM
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <FileText className="w-4 h-4" />
              <span className="text-sm">Generate PM Summary</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              <Mail className="w-4 h-4" />
              <span className="text-sm">Generate Client Brief</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              <span className="text-sm">Export PPT/PDF</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
