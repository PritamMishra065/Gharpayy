import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Kanban,
  CalendarCheck,
  Trophy,
  Building2,
} from 'lucide-react';

const DEMAND_LINKS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/leads', label: 'Leads', icon: Users, badge: null },
  { to: '/pipeline', label: 'Pipeline', icon: Kanban },
  { to: '/visits', label: 'Visits', icon: CalendarCheck },
  { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
];

const SUPPLY_LINKS = [
  { to: '/properties', label: 'Properties', icon: Building2 },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src="/logo.png" alt="Gharpayy" />
        <span>GHARPAYY</span>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-title">Demand</div>
        <nav className="sidebar-nav">
          {DEMAND_LINKS.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              end={link.to === '/'}
            >
              <link.icon />
              {link.label}
              {link.badge && <span className="sidebar-badge">{link.badge}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-title">Supply</div>
        <nav className="sidebar-nav">
          {SUPPLY_LINKS.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <link.icon />
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">AD</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">Admin User</div>
            <div className="sidebar-user-role">Super Admin</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
