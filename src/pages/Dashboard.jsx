import { useLeads } from '../context/LeadContext';
import { PIPELINE_STAGES, LEAD_SOURCES, AGENTS } from '../data/data';
import {
  Users, Clock, CalendarCheck, TrendingUp, Target, AlertTriangle, CheckCircle, BarChart3,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

export default function Dashboard() {
  const { stats, leads, getFollowUpLeads } = useLeads();
  const followUps = getFollowUpLeads();

  const statCards = [
    { label: 'Total Leads', value: stats.totalLeads, icon: Users, color: 'orange', change: '+12%', positive: true },
    { label: 'New Today', value: leads.filter(l => { const d = new Date(l.createdAt); const t = new Date(); return d.toDateString() === t.toDateString(); }).length, icon: TrendingUp, color: 'blue', change: '+3', positive: true },
    { label: 'Visits Scheduled', value: stats.upcomingVisits, icon: CalendarCheck, color: 'green', change: null },
    { label: 'Bookings', value: stats.bookings, icon: CheckCircle, color: 'green', change: '+1', positive: true },
    { label: 'Avg Lead Score', value: stats.avgScore, icon: Target, color: 'purple', change: null },
    { label: 'Follow-ups Due', value: stats.followUps, icon: AlertTriangle, color: stats.followUps > 0 ? 'red' : 'teal', change: null },
    { label: 'Conversion Rate', value: `${stats.totalLeads ? Math.round((stats.bookings / stats.totalLeads) * 100) : 0}%`, icon: BarChart3, color: 'teal', change: null },
    { label: 'Avg Response', value: '2.4h', icon: Clock, color: 'blue', change: '-18%', positive: true },
  ];

  // Pipeline chart data
  const pipelineData = PIPELINE_STAGES.map(stage => ({
    name: stage.label.length > 12 ? stage.label.substring(0, 12) + '…' : stage.label,
    count: stats.byStage[stage.id] || 0,
    fill: stage.color,
  }));

  // Source pie data
  const sourceData = LEAD_SOURCES.map(src => ({
    name: src.label,
    value: stats.bySource[src.id] || 0,
    color: src.color,
  })).filter(d => d.value > 0);

  return (
    <div>
      {followUps.length > 0 && (
        <div className="followup-banner">
          <AlertTriangle size={20} />
          <div className="followup-banner-text">
            <div className="followup-banner-title">
              {followUps.length} lead{followUps.length > 1 ? 's' : ''} need follow-up
            </div>
            <div className="followup-banner-desc">
              These leads have been inactive for over 24 hours: {followUps.slice(0, 3).map(l => l.name).join(', ')}
              {followUps.length > 3 && ` and ${followUps.length - 3} more`}
            </div>
          </div>
          <button className="btn-primary" style={{ flexShrink: 0 }}>View All</button>
        </div>
      )}

      <div className="stats-grid">
        {statCards.map((card, i) => (
          <div className="stat-card" key={i}>
            <div className={`stat-icon ${card.color}`}>
              <card.icon size={20} />
            </div>
            <div className="stat-info">
              <div className="stat-label">{card.label}</div>
              <div className="stat-value">{card.value}</div>
              {card.change && (
                <div className={`stat-change ${card.positive ? 'positive' : 'negative'}`}>
                  {card.change} vs last week
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="charts-grid">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Pipeline Distribution</h3>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={pipelineData} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} angle={-20} textAnchor="end" height={50} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '13px',
                    boxShadow: 'var(--shadow-md)',
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {pipelineData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Lead Sources</h3>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                  style={{ fontSize: '11px' }}
                >
                  {sourceData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '13px',
                    boxShadow: 'var(--shadow-md)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity / Agent Performance */}
      <div className="charts-grid">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Leads</h3>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Source</th>
                    <th>Stage</th>
                    <th>Agent</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.slice(0, 5).map(lead => {
                    const agent = AGENTS.find(a => a.id === lead.agent);
                    return (
                      <tr key={lead.id}>
                        <td>
                          <div className="lead-name">{lead.name}</div>
                        </td>
                        <td><span className={`badge badge-${lead.source}`}>{LEAD_SOURCES.find(s => s.id === lead.source)?.label}</span></td>
                        <td><span className={`badge badge-${lead.stage}`}>{PIPELINE_STAGES.find(s => s.id === lead.stage)?.label}</span></td>
                        <td>
                          <div className="agent-cell">
                            <span className={`agent-avatar ${lead.agent}`}>{agent?.avatar}</span>
                            {agent?.name?.split(' ')[0]}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Agent Workload</h3>
          </div>
          <div className="card-body">
            {AGENTS.map(agent => {
              const agentLeads = leads.filter(l => l.agent === agent.id);
              const active = agentLeads.filter(l => !['booked', 'lost'].includes(l.stage)).length;
              const booked = agentLeads.filter(l => l.stage === 'booked').length;
              return (
                <div key={agent.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <span className={`agent-avatar ${agent.id}`}>{agent.avatar}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>{agent.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ flex: 1, height: '6px', background: 'var(--border)', borderRadius: '10px', overflow: 'hidden' }}>
                        <div style={{ width: `${Math.min((active / 6) * 100, 100)}%`, height: '100%', background: 'var(--primary)', borderRadius: '10px', transition: 'width 0.5s' }} />
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', minWidth: '65px' }}>
                        {active} active
                      </span>
                    </div>
                  </div>
                  <span className="badge badge-booked" style={{ fontSize: '11px' }}>{booked} booked</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
