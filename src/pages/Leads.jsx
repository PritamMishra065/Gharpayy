import { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useLeads } from '../context/LeadContext';
import { PIPELINE_STAGES, LEAD_SOURCES, AGENTS } from '../data/data';
import { Download, Filter, Phone, MessageCircle, Trash2, Eye } from 'lucide-react';
import LeadDetailModal from '../components/LeadDetailModal';

export default function Leads() {
  const { leads, updateLeadStage, deleteLead } = useLeads();
  const { openAddLead } = useOutletContext();

  const [sourceFilter, setSourceFilter] = useState('all');
  const [stageFilter, setStageFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedLeadId, setSelectedLeadId] = useState(null);

  const filteredLeads = useMemo(() => {
    let result = [...leads];

    if (sourceFilter !== 'all') result = result.filter(l => l.source === sourceFilter);
    if (stageFilter !== 'all') result = result.filter(l => l.stage === stageFilter);
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(l =>
        l.name.toLowerCase().includes(lower) ||
        l.phone.includes(searchTerm) ||
        l.email.toLowerCase().includes(lower) ||
        l.location.toLowerCase().includes(lower)
      );
    }

    switch (sortBy) {
      case 'newest': result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); break;
      case 'oldest': result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); break;
      case 'score-high': result.sort((a, b) => b.score - a.score); break;
      case 'score-low': result.sort((a, b) => a.score - b.score); break;
      case 'name': result.sort((a, b) => a.name.localeCompare(b.name)); break;
    }

    return result;
  }, [leads, sourceFilter, stageFilter, searchTerm, sortBy]);

  const getScoreColor = (score) => {
    if (score >= 80) return 'var(--success)';
    if (score >= 60) return 'var(--warning)';
    return 'var(--danger)';
  };

  const handleExport = () => {
    const csv = [
      ['Name', 'Phone', 'Email', 'Source', 'Stage', 'Score', 'Agent', 'Location', 'Budget', 'Created'],
      ...filteredLeads.map(l => [
        l.name, l.phone, l.email,
        LEAD_SOURCES.find(s => s.id === l.source)?.label,
        PIPELINE_STAGES.find(s => s.id === l.stage)?.label,
        l.score,
        AGENTS.find(a => a.id === l.agent)?.name,
        l.location, l.budget,
        new Date(l.createdAt).toLocaleDateString('en-IN'),
      ]),
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gharpayy_leads.csv';
    a.click();
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-header-title">All Leads</h2>
          <p className="page-header-subtitle">{filteredLeads.length} leads found</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-secondary" onClick={handleExport}>
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      <div className="filters-bar">
        <Filter size={16} style={{ color: 'var(--text-muted)' }} />

        <input
          className="form-input"
          style={{ maxWidth: '220px', padding: '6px 12px', fontSize: '12px' }}
          placeholder="Search by name, phone, location..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />

        <select className="form-select" style={{ maxWidth: '150px', padding: '6px 10px', fontSize: '12px' }} value={sourceFilter} onChange={e => setSourceFilter(e.target.value)}>
          <option value="all">All Sources</option>
          {LEAD_SOURCES.map(s => (
            <option key={s.id} value={s.id}>{s.label}</option>
          ))}
        </select>

        <select className="form-select" style={{ maxWidth: '180px', padding: '6px 10px', fontSize: '12px' }} value={stageFilter} onChange={e => setStageFilter(e.target.value)}>
          <option value="all">All Stages</option>
          {PIPELINE_STAGES.map(s => (
            <option key={s.id} value={s.id}>{s.label}</option>
          ))}
        </select>

        <select className="form-select" style={{ maxWidth: '140px', padding: '6px 10px', fontSize: '12px' }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="score-high">Score: High → Low</option>
          <option value="score-low">Score: Low → High</option>
          <option value="name">Name A-Z</option>
        </select>
      </div>

      <div className="card">
        <div className="table-wrapper" style={{ maxHeight: 'calc(100vh - 300px)', overflowY: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Lead</th>
                <th>Contact</th>
                <th>Source</th>
                <th>Stage</th>
                <th>Score</th>
                <th>Agent</th>
                <th>Location</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map(lead => {
                const agent = AGENTS.find(a => a.id === lead.agent);
                return (
                  <tr key={lead.id}>
                    <td>
                      <div className="lead-name-cell" style={{ cursor: 'pointer' }} onClick={() => setSelectedLeadId(lead.id)}>
                        <span className="lead-name" style={{ color: 'var(--primary)', textDecoration: 'none' }}>{lead.name}</span>
                        <span className="lead-email">{lead.email}</span>
                      </div>
                    </td>
                    <td style={{ fontSize: '13px' }}>{lead.phone}</td>
                    <td>
                      <span className={`badge badge-${lead.source}`}>
                        {LEAD_SOURCES.find(s => s.id === lead.source)?.label}
                      </span>
                    </td>
                    <td>
                      <select
                        className="stage-select"
                        value={lead.stage}
                        onChange={e => updateLeadStage(lead.id, e.target.value)}
                      >
                        {PIPELINE_STAGES.map(s => (
                          <option key={s.id} value={s.id}>{s.label}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <div className="score-bar">
                        <div className="score-bar-track">
                          <div
                            className="score-bar-fill"
                            style={{ width: `${lead.score}%`, background: getScoreColor(lead.score) }}
                          />
                        </div>
                        <span className="score-value" style={{ color: getScoreColor(lead.score) }}>{lead.score}</span>
                      </div>
                    </td>
                    <td>
                      <div className="agent-cell">
                        <span className={`agent-avatar ${lead.agent}`}>{agent?.avatar}</span>
                        {agent?.name?.split(' ')[0]}
                      </div>
                    </td>
                    <td style={{ fontSize: '13px' }}>{lead.location}</td>
                    <td style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {new Date(lead.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button className="topbar-btn" style={{ width: '30px', height: '30px' }} title="Call">
                          <Phone size={13} />
                        </button>
                        <button className="topbar-btn" style={{ width: '30px', height: '30px', color: '#25D366' }} title="WhatsApp">
                          <MessageCircle size={13} />
                        </button>
                        <button
                          className="topbar-btn"
                          style={{ width: '30px', height: '30px' }}
                          title="Delete"
                          onClick={() => { if (confirm('Delete this lead?')) deleteLead(lead.id); }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <button className="fab" onClick={openAddLead} title="Add Lead">
        <span style={{ fontSize: '24px', lineHeight: 1 }}>+</span>
      </button>

      {selectedLeadId && (
        <LeadDetailModal leadId={selectedLeadId} onClose={() => setSelectedLeadId(null)} />
      )}
    </div>
  );
}
