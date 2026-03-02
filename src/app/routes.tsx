import { createBrowserRouter } from "react-router";
import { Dashboard } from "./components/Dashboard";
import { MilestoneDetailScreen } from "./components/MilestoneDetailScreen";
import { BlockersTriageScreen } from "./components/BlockersTriageScreen";
import { WorkstreamExecutionScreen } from "./components/WorkstreamExecutionScreen";
import { ChangeTimelineScreen } from "./components/ChangeTimelineScreen";
import { RiskEscalationScreen } from "./components/RiskEscalationScreen";
import { StatusReportBuilderScreen } from "./components/StatusReportBuilderScreen";
import { IntegrationsScreen } from "./components/IntegrationsScreen";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Dashboard,
  },
  {
    path: "/milestone/:milestoneId",
    Component: MilestoneDetailScreen,
  },
  {
    path: "/blockers",
    Component: BlockersTriageScreen,
  },
  {
    path: "/workstreams",
    Component: WorkstreamExecutionScreen,
  },
  {
    path: "/changes",
    Component: ChangeTimelineScreen,
  },
  {
    path: "/risks",
    Component: RiskEscalationScreen,
  },
  {
    path: "/report",
    Component: StatusReportBuilderScreen,
  },
  {
    path: "/integrations",
    Component: IntegrationsScreen,
  },
], {
  basename: import.meta.env.BASE_URL,
});
