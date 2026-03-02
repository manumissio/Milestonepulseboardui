import { useState } from 'react';
import { Header } from './Header';
import { MilestoneCards } from './MilestoneCards';
import { WorkstreamPanel } from './WorkstreamPanel';
import { BlockersPanel } from './BlockersPanel';
import { ChangesSummary } from './ChangesSummary';
import { ActionBar } from './ActionBar';
import { BlockerDetailPanel } from './BlockerDetailPanel';

export function Dashboard() {
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
      
      <main className="w-[1440px] mx-auto px-6 py-6 space-y-6">
        {/* Milestone Cards - Horizontal Row */}
        <MilestoneCards 
          selectedMilestone={selectedMilestone}
          onSelectMilestone={setSelectedMilestone}
        />

        {/* Two Column Layout */}
        <div className="grid grid-cols-2 gap-6">
          {/* Left Column - Workstream Progress */}
          <WorkstreamPanel 
            selectedMilestone={selectedMilestone}
            filters={filters}
          />

          {/* Right Column - Blockers & Dependencies */}
          <BlockersPanel 
            selectedMilestone={selectedMilestone}
            filters={filters}
            onSelectBlocker={setSelectedBlocker}
            onFiltersChange={setFilters}
          />
        </div>

        {/* Changes Summary - Full Width */}
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