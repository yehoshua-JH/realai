// RealAI 2.0 — Main Dashboard Page
// Design: Dark fintech command center, RTL Hebrew, Heebo font
// Assembles Sidebar + Topbar + all 8 views
import { useState } from "react";
import Sidebar, { ViewId } from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import DashboardView from "@/components/views/DashboardView";
import LeadsView from "@/components/views/LeadsView";
import FollowUpView from "@/components/views/FollowUpView";
import PropertiesView from "@/components/views/PropertiesView";
import WhatsAppView from "@/components/views/WhatsAppView";
import PipelineView from "@/components/views/PipelineView";
import RemindersView from "@/components/views/RemindersView";
import MissedCallsView from "@/components/views/MissedCallsView";
import ManagerView from "@/components/views/ManagerView";

export default function Dashboard() {
  const [activeView, setActiveView] = useState<ViewId>('dashboard');
  const [missedCount, setMissedCount] = useState(5);

  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <DashboardView />;
      case 'leads': return <LeadsView />;
      case 'followup': return <FollowUpView />;
      case 'properties': return <PropertiesView />;
      case 'whatsapp': return <WhatsAppView />;
      case 'pipeline': return <PipelineView />;
      case 'reminders': return <RemindersView />;
      case 'missed': return <MissedCallsView onMissedCountChange={setMissedCount} />;
      case 'manager': return <ManagerView />;
      default: return <DashboardView />;
    }
  };

  return (
    <div style={{ fontFamily: "'Heebo', sans-serif", direction: 'rtl' }}>
      <Sidebar activeView={activeView} onNavigate={setActiveView} missedCount={missedCount} />
      <main style={{ marginRight: 220, minHeight: '100vh' }}>
        <Topbar activeView={activeView} />
        <div style={{ padding: '22px 24px' }}>
          {renderView()}
        </div>
      </main>
    </div>
  );
}
