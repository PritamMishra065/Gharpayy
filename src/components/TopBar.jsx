import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Bell, Plus } from 'lucide-react';
import { useLeads } from '../context/LeadContext';

const PAGE_TITLES = {
  '/': 'Dashboard',
  '/leads': 'Leads',
  '/pipeline': 'Pipeline',
  '/visits': 'Visits',
  '/properties': 'Properties',
  '/leaderboard': 'Leaderboard',
};

export default function TopBar({ onAddLead, onScheduleVisit }) {
  const location = useLocation();
  const { notifications, markNotificationRead } = useLeads();
  const [showNotif, setShowNotif] = useState(false);
  const notifRef = useRef(null);
  const unreadCount = notifications.filter(n => !n.read).length;

  const title = PAGE_TITLES[location.pathname] || 'Gharpayy CRM';

  useEffect(() => {
    function handleClick(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const getActionButton = () => {
    switch (location.pathname) {
      case '/leads':
        return (
          <button className="btn-primary" onClick={onAddLead}>
            <Plus size={16} /> Add Lead
          </button>
        );
      case '/visits':
        return (
          <button className="btn-primary" onClick={onScheduleVisit}>
            <Plus size={16} /> Schedule Visit
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="topbar">
      <h1 className="topbar-title">{title}</h1>

      <div className="topbar-search">
        <Search />
        <input type="text" placeholder="Search leads, properties... (⌘K)" />
      </div>

      <div className="topbar-actions">
        {getActionButton()}

        <div ref={notifRef} style={{ position: 'relative' }}>
          <button className="topbar-btn" onClick={() => setShowNotif(!showNotif)}>
            <Bell size={18} />
            {unreadCount > 0 && <span className="badge-dot"></span>}
          </button>

          {showNotif && (
            <div className="notif-dropdown">
              <div style={{ padding: '14px 16px', fontWeight: 700, fontSize: '14px', borderBottom: '1px solid var(--border-light)' }}>
                Notifications {unreadCount > 0 && `(${unreadCount})`}
              </div>
              {notifications.length === 0 ? (
                <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                  No notifications yet
                </div>
              ) : (
                notifications.slice(0, 10).map(n => (
                  <div
                    key={n.id}
                    className={`notif-item ${!n.read ? 'unread' : ''}`}
                    onClick={() => markNotificationRead(n.id)}
                  >
                    {n.message}
                    <div className="notif-time">
                      {new Date(n.time).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
