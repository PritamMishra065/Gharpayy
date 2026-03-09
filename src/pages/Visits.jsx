import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useLeads } from '../context/LeadContext';
import { AGENTS } from '../data/data';
import { Calendar, Clock, MapPin, User, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Visits() {
  const { visits, completeVisit } = useLeads();
  const { openScheduleVisit } = useOutletContext();
  const [outcomeModal, setOutcomeModal] = useState(null);

  const upcomingVisits = visits.filter(v => v.status === 'confirmed');
  const completedVisits = visits.filter(v => v.status === 'completed');

  const handleComplete = (visitId, outcome) => {
    completeVisit(visitId, outcome);
    setOutcomeModal(null);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-header-title">Visit Management</h2>
          <p className="page-header-subtitle">{upcomingVisits.length} upcoming, {completedVisits.length} completed</p>
        </div>
      </div>

      {/* Upcoming Visits */}
      <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Calendar size={18} style={{ color: 'var(--primary)' }} />
        Upcoming Visits
      </h3>

      {upcomingVisits.length === 0 ? (
        <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '12px' }}>No upcoming visits scheduled</p>
          <button className="btn-primary" onClick={openScheduleVisit}>Schedule a Visit</button>
        </div>
      ) : (
        <div className="visits-grid" style={{ marginBottom: '32px' }}>
          {upcomingVisits.map(visit => {
            const agent = AGENTS.find(a => a.id === visit.agent);
            return (
              <div className="visit-card" key={visit.id}>
                <div className="visit-card-header">
                  <div className="visit-card-title">{visit.leadName}</div>
                  <span className="badge badge-confirmed">
                    <CheckCircle2 size={12} /> Confirmed
                  </span>
                </div>
                <div className="visit-card-details">
                  <div className="visit-detail-row">
                    <MapPin /> {visit.propertyName}
                  </div>
                  <div className="visit-detail-row">
                    <Calendar /> {new Date(visit.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                  </div>
                  <div className="visit-detail-row">
                    <Clock /> {visit.time}
                  </div>
                  <div className="visit-detail-row">
                    <User />
                    <span className="agent-cell">
                      <span className={`agent-avatar ${visit.agent}`} style={{ width: '22px', height: '22px', fontSize: '9px' }}>{agent?.avatar}</span>
                      {agent?.name}
                    </span>
                  </div>
                </div>
                <div className="visit-card-actions">
                  <button className="btn-complete" onClick={() => setOutcomeModal(visit.id)}>
                    Mark Complete
                  </button>
                  <button style={{ color: 'var(--text-secondary)' }}>Reschedule</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Outcome Modal */}
      {outcomeModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setOutcomeModal(null)}>
          <div className="modal" style={{ maxWidth: '380px' }}>
            <div className="modal-header">
              <h2 className="modal-title">Visit Outcome</h2>
              <button className="modal-close" onClick={() => setOutcomeModal(null)}>×</button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                How did the property visit go?
              </p>
              {[
                { value: 'booked', label: '🎉 Booked!', desc: 'Lead confirmed the booking' },
                { value: 'considering', label: '🤔 Considering', desc: 'Liked it, needs time to decide' },
                { value: 'not_interested', label: '👎 Not Interested', desc: 'Didn\'t match requirements' },
                { value: 'no_show', label: '❌ No Show', desc: 'Lead didn\'t show up' },
              ].map(opt => (
                <button
                  key={opt.value}
                  style={{
                    padding: '12px 16px',
                    background: 'var(--bg-main)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'var(--transition)',
                    fontFamily: 'Inter, sans-serif',
                  }}
                  onMouseOver={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.background = 'var(--primary-bg)'; }}
                  onMouseOut={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.background = 'var(--bg-main)'; }}
                  onClick={() => handleComplete(outcomeModal, opt.value)}
                >
                  <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '2px' }}>{opt.label}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Completed Visits */}
      <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <CheckCircle2 size={18} style={{ color: 'var(--success)' }} />
        Completed Visits
      </h3>

      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Lead</th>
                <th>Property</th>
                <th>Date</th>
                <th>Agent</th>
                <th>Outcome</th>
              </tr>
            </thead>
            <tbody>
              {completedVisits.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                    No completed visits yet
                  </td>
                </tr>
              ) : (
                completedVisits.map(visit => {
                  const agent = AGENTS.find(a => a.id === visit.agent);
                  const outcomeLabels = {
                    booked: { label: 'Booked', class: 'badge-booked' },
                    considering: { label: 'Considering', class: 'badge-contacted' },
                    not_interested: { label: 'Not Interested', class: 'badge-lost' },
                    no_show: { label: 'No Show', class: 'badge-lost' },
                  };
                  const outcome = outcomeLabels[visit.outcome] || { label: visit.outcome || 'N/A', class: '' };
                  return (
                    <tr key={visit.id}>
                      <td><span className="lead-name">{visit.leadName}</span></td>
                      <td style={{ fontSize: '13px' }}>{visit.propertyName}</td>
                      <td style={{ fontSize: '13px' }}>
                        {new Date(visit.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} · {visit.time}
                      </td>
                      <td>
                        <div className="agent-cell">
                          <span className={`agent-avatar ${visit.agent}`} style={{ width: '24px', height: '24px', fontSize: '9px' }}>{agent?.avatar}</span>
                          {agent?.name?.split(' ')[0]}
                        </div>
                      </td>
                      <td><span className={`badge ${outcome.class}`}>{outcome.label}</span></td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <button className="fab" onClick={openScheduleVisit} title="Schedule Visit">
        <span style={{ fontSize: '24px', lineHeight: 1 }}>+</span>
      </button>
    </div>
  );
}
