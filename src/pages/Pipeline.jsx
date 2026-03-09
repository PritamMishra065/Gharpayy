import { useState, useRef } from 'react';
import { useLeads } from '../context/LeadContext';
import { PIPELINE_STAGES, LEAD_SOURCES, AGENTS } from '../data/data';
import { MapPin, IndianRupee, Phone, MessageCircle, ChevronRight, ChevronLeft } from 'lucide-react';

export default function Pipeline() {
  const { leads, updateLeadStage } = useLeads();
  const [draggedLead, setDraggedLead] = useState(null);
  const [dragOverStage, setDragOverStage] = useState(null);

  const handleDragStart = (e, lead) => {
    setDraggedLead(lead);
    e.dataTransfer.effectAllowed = 'move';
    // Make the card semi-transparent while dragging
    setTimeout(() => {
      e.target.classList.add('dragging');
    }, 0);
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove('dragging');
    setDraggedLead(null);
    setDragOverStage(null);
  };

  const handleDragOver = (e, stageId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverStage(stageId);
  };

  const handleDragLeave = () => {
    setDragOverStage(null);
  };

  const handleDrop = (e, stageId) => {
    e.preventDefault();
    if (draggedLead && draggedLead.stage !== stageId) {
      updateLeadStage(draggedLead.id, stageId);
    }
    setDraggedLead(null);
    setDragOverStage(null);
  };

  const moveLeadToStage = (leadId, currentStage, direction) => {
    const currentIndex = PIPELINE_STAGES.findIndex(s => s.id === currentStage);
    const newIndex = currentIndex + direction;
    if (newIndex >= 0 && newIndex < PIPELINE_STAGES.length) {
      updateLeadStage(leadId, PIPELINE_STAGES[newIndex].id);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-header-title">Sales Pipeline</h2>
          <p className="page-header-subtitle">Drag and drop leads between stages</p>
        </div>
      </div>

      <div className="pipeline-board">
        {PIPELINE_STAGES.map(stage => {
          const stageLeads = leads.filter(l => l.stage === stage.id);
          return (
            <div
              key={stage.id}
              className={`pipeline-column ${dragOverStage === stage.id ? 'drag-over' : ''}`}
              onDragOver={(e) => handleDragOver(e, stage.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, stage.id)}
            >
              <div className="pipeline-column-header">
                <div className="pipeline-column-title">
                  <span className="pipeline-column-dot" style={{ background: stage.color }} />
                  {stage.label}
                </div>
                <span className="pipeline-column-count">{stageLeads.length}</span>
              </div>

              <div className="pipeline-column-body">
                {stageLeads.length === 0 ? (
                  <div className="empty-column">No leads in this stage</div>
                ) : (
                  stageLeads.map(lead => {
                    const agent = AGENTS.find(a => a.id === lead.agent);
                    const stageIdx = PIPELINE_STAGES.findIndex(s => s.id === stage.id);
                    return (
                      <div
                        key={lead.id}
                        className="pipeline-card"
                        draggable
                        onDragStart={(e) => handleDragStart(e, lead)}
                        onDragEnd={handleDragEnd}
                      >
                        <div className="pipeline-card-name">{lead.name}</div>
                        <div className="pipeline-card-info">
                          <div className="pipeline-card-row">
                            <MapPin />
                            {lead.location || 'No location'}
                          </div>
                          <div className="pipeline-card-row">
                            <IndianRupee />
                            ₹{lead.budget || 'N/A'}
                          </div>
                          <div className="pipeline-card-row">
                            <span className={`badge badge-${lead.source}`} style={{ fontSize: '10px', padding: '1px 6px' }}>
                              {LEAD_SOURCES.find(s => s.id === lead.source)?.label}
                            </span>
                            {agent && (
                              <span className="agent-cell" style={{ marginLeft: 'auto', gap: '4px' }}>
                                <span className={`agent-avatar ${lead.agent}`} style={{ width: '20px', height: '20px', fontSize: '8px' }}>{agent.avatar}</span>
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="pipeline-card-actions">
                          {stageIdx > 0 && (
                            <button onClick={() => moveLeadToStage(lead.id, stage.id, -1)} title="Move back">
                              <ChevronLeft size={12} />
                            </button>
                          )}
                          <button title="Call"><Phone size={12} /></button>
                          <button title="WhatsApp" style={{ color: '#25D366' }}><MessageCircle size={12} /></button>
                          {stageIdx < PIPELINE_STAGES.length - 1 && (
                            <button onClick={() => moveLeadToStage(lead.id, stage.id, 1)} title="Move forward">
                              <ChevronRight size={12} />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
