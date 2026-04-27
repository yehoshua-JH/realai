// RealAI 2.0 — Main Dashboard Page
// Design: Dark fintech command center, RTL Hebrew, Heebo font
// Assembles Sidebar + Topbar + all 8 views
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
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
import LoginScreen from "@/components/LoginScreen";
import { useAuthStore } from "@/lib/store";

export default function Dashboard() {
  const [activeView, setActiveView] = useState<ViewId>('dashboard');
  const [missedCount, setMissedCount] = useState(5);
  const { user, login, logout } = useAuthStore();
  const seedMutation = trpc.seed.run.useMutation();

  useEffect(() => {
    // Seed initial demo data if DB is empty
    seedMutation.mutate();
  }, []);

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

  // Auth gate
  if (!user) {
    return <LoginScreen onLogin={(name, password) => {
      const ok = login(name, password);
      if (!ok) return false;
      return true;
    }} />;
  }

  return (
    <div style={{ fontFamily: "'Heebo', sans-serif", direction: 'rtl' }}>
      <Sidebar activeView={activeView} onNavigate={setActiveView} missedCount={missedCount} />
      <main style={{ marginRight: 220, minHeight: '100vh' }}>
        <Topbar activeView={activeView} onLogout={logout} userName={user.name} userAvatar={user.avatar} />
        <div style={{ padding: '22px 24px' }}>
          {renderView()}
        </div>
      </main>
    </div>
  );
}
