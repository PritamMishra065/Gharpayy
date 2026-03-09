import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import AddLeadModal from './AddLeadModal';
import ScheduleVisitModal from './ScheduleVisitModal';

export default function Layout() {
  const [showAddLead, setShowAddLead] = useState(false);
  const [showScheduleVisit, setShowScheduleVisit] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-wrapper">
        <TopBar
          onAddLead={() => setShowAddLead(true)}
          onScheduleVisit={() => setShowScheduleVisit(true)}
        />
        <div className="page-content">
          <Outlet context={{ openAddLead: () => setShowAddLead(true), openScheduleVisit: () => setShowScheduleVisit(true) }} />
        </div>
      </div>

      {showAddLead && <AddLeadModal onClose={() => setShowAddLead(false)} />}
      {showScheduleVisit && <ScheduleVisitModal onClose={() => setShowScheduleVisit(false)} />}
    </div>
  );
}
