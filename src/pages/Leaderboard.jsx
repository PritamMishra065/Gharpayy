import { useLeads } from '../context/LeadContext';
import {
  Trophy, Medal, TrendingUp, Users, CalendarCheck, Target, MessageCircle, Phone,
  ArrowUpRight, ArrowDownRight, Minus,
} from 'lucide-react';

const RANK_STYLES = [
  { bg: 'linear-gradient(135deg, #FFD700, #FFA500)', icon: '🥇', border: 'rgba(255, 215, 0, 0.3)' },
  { bg: 'linear-gradient(135deg, #C0C0C0, #A0A0A0)', icon: '🥈', border: 'rgba(192, 192, 192, 0.3)' },
  { bg: 'linear-gradient(135deg, #CD7F32, #A0522D)', icon: '🥉', border: 'rgba(205, 127, 50, 0.3)' },
  { bg: 'linear-gradient(135deg, #6b7280, #4b5563)', icon: '4th', border: 'rgba(107, 114, 128, 0.3)' },
];

export default function Leaderboard() {
  const { agentPerformance } = useLeads();

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-header-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Trophy size={24} style={{ color: 'var(--primary)' }} />
            Agent Leaderboard
          </h2>
          <p className="page-header-subtitle">Performance rankings based on conversion, response rate, and lead scores</p>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        {agentPerformance.slice(0, 4).map((agent, idx) => {
          const rankStyle = RANK_STYLES[idx];
          return (
            <div key={agent.id} className="card" style={{ overflow: 'hidden', position: 'relative' }}>
              {/* Rank banner */}
              <div style={{
                height: '6px',
                background: rankStyle.bg,
              }} />

              <div className="card-body" style={{ textAlign: 'center', padding: '24px 20px' }}>
                {/* Rank badge */}
                <div style={{ fontSize: idx < 3 ? '36px' : '24px', marginBottom: '8px', lineHeight: 1 }}>
                  {rankStyle.icon}
                </div>

                {/* Avatar */}
                <div className={`agent-avatar ${agent.id}`} style={{
                  width: '52px', height: '52px', fontSize: '16px',
                  margin: '0 auto 10px', boxShadow: `0 0 0 3px ${rankStyle.border}`,
                }}>
                  {agent.avatar}
                </div>

                <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '2px' }}>{agent.name}</div>

                {/* Performance Score */}
                <div style={{
                  fontSize: '28px', fontWeight: 800, color: 'var(--primary)',
                  margin: '8px 0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                }}>
                  {agent.performanceScore}
                  <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)' }}>pts</span>
                </div>

                {/* Mini stats */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginTop: '12px' }}>
                  <div style={{ background: 'var(--bg-main)', borderRadius: 'var(--radius-sm)', padding: '8px 4px' }}>
                    <div style={{ fontSize: '16px', fontWeight: 800 }}>{agent.booked}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>Booked</div>
                  </div>
                  <div style={{ background: 'var(--bg-main)', borderRadius: 'var(--radius-sm)', padding: '8px 4px' }}>
                    <div style={{ fontSize: '16px', fontWeight: 800 }}>{agent.conversionRate}%</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>Conv.</div>
                  </div>
                  <div style={{ background: 'var(--bg-main)', borderRadius: 'var(--radius-sm)', padding: '8px 4px' }}>
                    <div style={{ fontSize: '16px', fontWeight: 800 }}>{agent.total}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>Leads</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Stats Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Detailed Performance Breakdown</h3>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Agent</th>
                <th>Score</th>
                <th>Total Leads</th>
                <th>Active</th>
                <th>Booked</th>
                <th>Lost</th>
                <th>Conversion</th>
                <th>Visits Done</th>
                <th>Avg Lead Score</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {agentPerformance.map((agent, idx) => (
                <tr key={agent.id}>
                  <td>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: '28px', height: '28px', borderRadius: '50%',
                      background: idx < 3 ? RANK_STYLES[idx].bg : 'var(--bg-main)',
                      color: idx < 3 ? 'white' : 'var(--text-secondary)',
                      fontWeight: 800, fontSize: '12px',
                    }}>
                      {idx + 1}
                    </span>
                  </td>
                  <td>
                    <div className="agent-cell" style={{ gap: '10px' }}>
                      <span className={`agent-avatar ${agent.id}`}>{agent.avatar}</span>
                      <span style={{ fontWeight: 600, fontSize: '13px' }}>{agent.name}</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 800, fontSize: '15px', color: 'var(--primary)' }}>
                      {agent.performanceScore}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{agent.total}</td>
                  <td>
                    <span className="badge badge-contacted">{agent.active}</span>
                  </td>
                  <td>
                    <span className="badge badge-booked">{agent.booked}</span>
                  </td>
                  <td>
                    <span className="badge badge-lost">{agent.lost}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ fontWeight: 700, color: agent.conversionRate >= 20 ? 'var(--success)' : agent.conversionRate >= 10 ? 'var(--warning)' : 'var(--text-secondary)' }}>
                        {agent.conversionRate}%
                      </span>
                      {agent.conversionRate >= 20 && <ArrowUpRight size={14} style={{ color: 'var(--success)' }} />}
                      {agent.conversionRate > 0 && agent.conversionRate < 20 && <Minus size={14} style={{ color: 'var(--warning)' }} />}
                    </div>
                  </td>
                  <td style={{ fontWeight: 600 }}>{agent.completedVisits}</td>
                  <td>
                    <div className="score-bar">
                      <div className="score-bar-track" style={{ maxWidth: '50px' }}>
                        <div className="score-bar-fill" style={{
                          width: `${agent.avgLeadScore}%`,
                          background: agent.avgLeadScore >= 70 ? 'var(--success)' : agent.avgLeadScore >= 50 ? 'var(--warning)' : 'var(--danger)',
                        }} />
                      </div>
                      <span className="score-value">{agent.avgLeadScore}</span>
                    </div>
                  </td>
                  <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {agent.responseActions} actions
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
