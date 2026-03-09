import { useState, useEffect } from 'react';
import { useLeads } from '../context/LeadContext';
import { AGENTS, PIPELINE_STAGES, LEAD_SOURCES } from '../data/data';
import { X, MessageCircle, Phone, MapPin, IndianRupee, Clock, User, ArrowRightLeft, ChevronRight } from 'lucide-react';

const ACTIVITY_ICONS = {
  created: { emoji: '🆕', color: '#6366f1' },
  assigned: { emoji: '👤', color: '#3b82f6' },
  reassigned: { emoji: '🔄', color: '#f59e0b' },
  reassignment_warning: { emoji: '⚠️', color: '#ef4444' },
  stage_change: { emoji: '📊', color: '#8b5cf6' },
  whatsapp_sent: { emoji: '📤', color: '#25D366' },
  whatsapp_received: { emoji: '📥', color: '#25D366' },
  call: { emoji: '📞', color: '#f59e0b' },
  note: { emoji: '📝', color: '#6b7280' },
  visit_scheduled: { emoji: '📅', color: '#10b981' },
  visit_completed: { emoji: '✅', color: '#22c55e' },
};

export default function LeadDetailModal({ leadId, onClose }) {
  const { leads, getLeadActivities, updateLead, reassignLead, sendWhatsApp, addActivity, triggerAutoReassignment, checkAutoReassignment } = useLeads();
  const lead = leads.find(l => (l._id || l.id) === leadId);
  const [activities, setActivities] = useState([]);
  const [activeTab, setActiveTab] = useState('timeline');
  const [noteText, setNoteText] = useState('');
  const [waMessage, setWaMessage] = useState('');
  const [showReassign, setShowReassign] = useState(false);

  useEffect(() => {
    if (leadId) {
      getLeadActivities(leadId).then(acts => setActivities(acts || []));
    }
  }, [leadId, getLeadActivities]);

  if (!lead) return null;

  const agent = AGENTS.find(a => a.id === lead.agent);
  const pendingReassignment = checkAutoReassignment().find(l => (l._id || l.id) === leadId);

  const handleAddNote = async () => {
    if (!noteText.trim()) return;
    await addActivity(leadId, 'note', noteText.trim(), lead.agent);
    setNoteText('');
    // Refresh activities
    const acts = await getLeadActivities(leadId);
    setActivities(acts || []);
  };

  const handleSendWhatsApp = async () => {
    if (!waMessage.trim()) return;
    await sendWhatsApp(leadId, 'custom', waMessage.trim());
    setWaMessage('');
    // Refresh activities
    const acts = await getLeadActivities(leadId);
    setActivities(acts || []);
  };

  const formatTime = (ts) => {
    const d = new Date(ts);
    const now = new Date();
    const diff = now - d;
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: '640px', maxHeight: '90vh' }}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">{lead.name}</h2>
            <div style={{ display: 'flex', gap: '8px', marginTop: '6px', alignItems: 'center' }}>
              <span className={`badge badge-${lead.source}`}>
                {LEAD_SOURCES.find(s => s.id === lead.source)?.label}
              </span>
              <span className={`badge badge-${lead.stage}`}>
                {PIPELINE_STAGES.find(s => s.id === lead.stage)?.label}
              </span>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}><X size={16} /></button>
        </div>

        {/* Lead Info Summary */}
        <div style={{ padding: '12px 24px', background: 'var(--bg-main)', borderBottom: '1px solid var(--border-light)', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>
            <Phone size={14} /> {lead.phone}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>
            <MapPin size={14} /> {lead.location || 'N/A'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>
            <IndianRupee size={14} /> ₹{lead.budget || 'N/A'}
          </div>
        </div>

        {/* Agent + Reassignment */}
        <div style={{ padding: '12px 24px', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="agent-cell" style={{ gap: '10px' }}>
            <span className={`agent-avatar ${lead.agent}`}>{agent?.avatar}</span>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600 }}>{agent?.name}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Assigned Agent</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {pendingReassignment && (
              <button className="btn-primary" style={{ fontSize: '11px', padding: '5px 10px', background: 'var(--danger)' }} onClick={() => triggerAutoReassignment(leadId)}>
                ⚠ Auto-Reassign
              </button>
            )}
            <button className="btn-secondary" style={{ fontSize: '11px', padding: '5px 10px' }} onClick={() => setShowReassign(!showReassign)}>
              <ArrowRightLeft size={12} /> Reassign
            </button>
          </div>
        </div>

        {/* Reassign dropdown */}
        {showReassign && (
          <div style={{ padding: '10px 24px', background: 'var(--primary-bg)', borderBottom: '1px solid var(--border-light)', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {AGENTS.filter(a => a.id !== lead.agent).map(a => (
              <button
                key={a.id}
                className="btn-secondary"
                style={{ fontSize: '11px', padding: '4px 10px' }}
                onClick={() => { reassignLead(leadId, a.id, 'manual override'); setShowReassign(false); }}
              >
                <span className={`agent-avatar ${a.id}`} style={{ width: '18px', height: '18px', fontSize: '8px' }}>{a.avatar}</span>
                {a.name}
              </button>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-light)' }}>
          {[
            { id: 'timeline', label: 'Activity Timeline' },
            { id: 'whatsapp', label: 'WhatsApp' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '10px',
                border: 'none',
                background: activeTab === tab.id ? 'var(--bg-card)' : 'var(--bg-main)',
                fontWeight: activeTab === tab.id ? 700 : 500,
                fontSize: '13px',
                color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-secondary)',
                borderBottom: activeTab === tab.id ? '2px solid var(--primary)' : '2px solid transparent',
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                transition: 'var(--transition)',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="modal-body" style={{ maxHeight: '380px', overflowY: 'auto', padding: '16px 24px' }}>
          {activeTab === 'timeline' && (
            <>
              {/* Add note */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                <input
                  className="form-input"
                  style={{ flex: 1, fontSize: '12px', padding: '7px 12px' }}
                  placeholder="Add a note..."
                  value={noteText}
                  onChange={e => setNoteText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddNote()}
                />
                <button className="btn-primary" style={{ fontSize: '11px', padding: '6px 12px' }} onClick={handleAddNote}>Add</button>
              </div>

              {/* Timeline */}
              <div style={{ position: 'relative' }}>
                {/* Vertical line */}
                <div style={{
                  position: 'absolute', left: '11px', top: '0', bottom: '0', width: '2px',
                  background: 'var(--border)', zIndex: 0,
                }} />

                {activities.map((act, i) => {
                  const config = ACTIVITY_ICONS[act.type] || { emoji: '•', color: '#6b7280' };
                  const actAgent = act.agent ? AGENTS.find(a => a.id === act.agent) : null;
                  return (
                    <div key={act.id} style={{
                      display: 'flex', gap: '14px', marginBottom: '16px', position: 'relative', zIndex: 1,
                    }}>
                      {/* Dot */}
                      <div style={{
                        width: '24px', height: '24px', borderRadius: '50%',
                        background: 'var(--bg-card)', border: `2px solid ${config.color}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '11px', flexShrink: 0, zIndex: 1,
                      }}>
                        {config.emoji}
                      </div>
                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: '13px', color: 'var(--text-primary)', lineHeight: '1.5',
                          background: act.type === 'whatsapp_received' ? 'rgba(37, 211, 102, 0.06)' :
                                     act.type === 'reassignment_warning' ? 'var(--danger-bg)' : 'transparent',
                          padding: act.type === 'whatsapp_received' || act.type === 'reassignment_warning' ? '6px 10px' : '0',
                          borderRadius: 'var(--radius-sm)',
                        }}>
                          {act.message}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px' }}>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            <Clock size={10} style={{ verticalAlign: 'middle', marginRight: '3px' }} />
                            {formatTime(act.timestamp)}
                          </span>
                          {actAgent && (
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                              by {actAgent.name.split(' ')[0]}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {activities.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', fontSize: '13px' }}>
                    No activity recorded yet
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'whatsapp' && (
            <div>
              {/* WhatsApp Integration Concept */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(37, 211, 102, 0.08), rgba(37, 211, 102, 0.02))',
                borderRadius: 'var(--radius-md)', padding: '16px', marginBottom: '16px',
                border: '1px solid rgba(37, 211, 102, 0.15)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <MessageCircle size={18} style={{ color: '#25D366' }} />
                  <span style={{ fontWeight: 700, fontSize: '14px' }}>WhatsApp Business API</span>
                  <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', fontSize: '10px' }}>Sandbox</span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Connected via Meta Cloud API. Messages are sent through approved templates. 
                  Incoming messages trigger webhook events and auto-create leads.
                </p>
              </div>

              {/* Quick Templates */}
              <h4 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: '10px' }}>
                Quick Templates
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
                {[
                  { id: 'follow_up', label: '📩 Follow-up', preview: `Hi ${lead.name}, we have great PG options in ${lead.location}...` },
                  { id: 'visit_confirm', label: '📅 Visit Confirmation', preview: `Hi ${lead.name}, your visit is confirmed...` },
                  { id: 'post_visit', label: '🏠 Post Visit', preview: `Hi ${lead.name}, how was your visit? Would you like to book?` },
                ].map(tmpl => (
                  <button
                    key={tmpl.id}
                    style={{
                      textAlign: 'left', padding: '10px 14px', background: 'var(--bg-main)',
                      border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
                      cursor: 'pointer', transition: 'var(--transition)', fontFamily: 'Inter, sans-serif',
                    }}
                    onMouseOver={e => { e.currentTarget.style.borderColor = '#25D366'; }}
                    onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
                    onClick={() => sendWhatsApp(leadId, tmpl.id, `Template "${tmpl.label}" sent to ${lead.name}`)}
                  >
                    <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '2px' }}>{tmpl.label}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{tmpl.preview}</div>
                  </button>
                ))}
              </div>

              {/* Custom Message */}
              <h4 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                Custom Message
              </h4>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  className="form-input"
                  style={{ flex: 1, fontSize: '12px', padding: '7px 12px' }}
                  placeholder={`Message to ${lead.name}...`}
                  value={waMessage}
                  onChange={e => setWaMessage(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendWhatsApp()}
                />
                <button
                  style={{
                    background: '#25D366', color: 'white', border: 'none', borderRadius: 'var(--radius-md)',
                    padding: '7px 14px', fontWeight: 600, fontSize: '12px', cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', gap: '4px',
                  }}
                  onClick={handleSendWhatsApp}
                >
                  <MessageCircle size={13} /> Send
                </button>
              </div>

              {/* WhatsApp activity */}
              <div style={{ marginTop: '20px' }}>
                <h4 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: '10px' }}>
                  Message History
                </h4>
                {activities.filter(a => a.type.includes('whatsapp')).map(act => (
                  <div key={act.id} style={{
                    display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '10px',
                    padding: '8px 12px', borderRadius: 'var(--radius-sm)',
                    background: act.type === 'whatsapp_received' ? 'rgba(37, 211, 102, 0.06)' : 'var(--bg-main)',
                  }}>
                    <span style={{ fontSize: '14px', flexShrink: 0 }}>{act.type === 'whatsapp_received' ? '📥' : '📤'}</span>
                    <div>
                      <div style={{ fontSize: '12px', color: 'var(--text-primary)' }}>{act.message}</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>{formatTime(act.timestamp)}</div>
                    </div>
                  </div>
                ))}
                {activities.filter(a => a.type.includes('whatsapp')).length === 0 && (
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', padding: '16px' }}>
                    No WhatsApp messages yet
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
