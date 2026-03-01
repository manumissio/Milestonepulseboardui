import { useState } from 'react';
import { Header } from './components/Header';
import { MilestoneCards } from './components/MilestoneCards';
import { WorkstreamPanel } from './components/WorkstreamPanel';
import { BlockersPanel } from './components/BlockersPanel';
import { ChangesSummary } from './components/ChangesSummary';
import { ActionBar } from './components/ActionBar';
import { BlockerDetailPanel } from './components/BlockerDetailPanel';

export default function App() {
  const [selectedMilestone, setSelectedMilestone] = useState<string | null>(null);
  const [selectedBlocker, setSelectedBlocker] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    owner: 'all',
    workstream: 'all',
    blockerType: 'all',
    severity: 'all',
  });

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      <Header />
      
      <main className="flex-1 w-[1440px] mx-auto px-6 py-6 space-y-6">
        {/* Milestone Cards */}
        <MilestoneCards 
          selectedMilestone={selectedMilestone}
          onSelectMilestone={setSelectedMilestone}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-2 gap-6">
          <WorkstreamPanel 
            selectedMilestone={selectedMilestone}
            filters={filters}
          />
          <BlockersPanel 
            selectedMilestone={selectedMilestone}
            filters={filters}
            onSelectBlocker={setSelectedBlocker}
            onFiltersChange={setFilters}
          />
        </div>

        {/* Changes Summary */}
        <ChangesSummary selectedMilestone={selectedMilestone} />
      </main>

      {/* Footer Action Bar */}
      <ActionBar />

      {/* Blocker Detail Side Panel */}
      {selectedBlocker && (
        <BlockerDetailPanel 
          blockerId={selectedBlocker}
          onClose={() => setSelectedBlocker(null)}
        />
      )}
    </div>
  );
}
