import { useState } from 'react';
import { X } from 'lucide-react';
import { useLeads } from '../context/LeadContext';
import { LEAD_SOURCES, AGENTS } from '../data/data';

export default function AddLeadModal({ onClose }) {
  const { addLead } = useLeads();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    source: 'whatsapp',
    location: '',
    budget: '',
    occupation: '',
    notes: '',
    agent: '', // empty = auto-assign
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) return;
    addLead(form);
    onClose();
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">Add New Lead</h2>
          <button className="modal-close" onClick={onClose}><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="e.g., Priya Sharma"
                  value={form.name}
                  onChange={e => handleChange('name', e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input
                  className="form-input"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={e => handleChange('phone', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  className="form-input"
                  type="email"
                  placeholder="email@example.com"
                  value={form.email}
                  onChange={e => handleChange('email', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Lead Source</label>
                <select className="form-select" value={form.source} onChange={e => handleChange('source', e.target.value)}>
                  {LEAD_SOURCES.map(s => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Preferred Location</label>
                <select className="form-select" value={form.location} onChange={e => handleChange('location', e.target.value)}>
                  <option value="">Select area</option>
                  <option value="Koramangala">Koramangala</option>
                  <option value="HSR Layout">HSR Layout</option>
                  <option value="BTM Layout">BTM Layout</option>
                  <option value="Indiranagar">Indiranagar</option>
                  <option value="Electronic City">Electronic City</option>
                  <option value="Whitefield">Whitefield</option>
                  <option value="Marathahalli">Marathahalli</option>
                  <option value="JP Nagar">JP Nagar</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Budget Range</label>
                <select className="form-select" value={form.budget} onChange={e => handleChange('budget', e.target.value)}>
                  <option value="">Select budget</option>
                  <option value="5000-7000">₹5,000 - ₹7,000</option>
                  <option value="7000-9000">₹7,000 - ₹9,000</option>
                  <option value="9000-12000">₹9,000 - ₹12,000</option>
                  <option value="12000-15000">₹12,000 - ₹15,000</option>
                  <option value="15000+">₹15,000+</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Occupation</label>
                <select className="form-select" value={form.occupation} onChange={e => handleChange('occupation', e.target.value)}>
                  <option value="">Select</option>
                  <option value="Student">Student</option>
                  <option value="Working Professional">Working Professional</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Assign Agent</label>
                <select className="form-select" value={form.agent} onChange={e => handleChange('agent', e.target.value)}>
                  <option value="">Auto-assign (Round Robin)</option>
                  {AGENTS.map(a => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea
                className="form-textarea"
                placeholder="Any additional information..."
                value={form.notes}
                onChange={e => handleChange('notes', e.target.value)}
                rows={2}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">Add Lead</button>
          </div>
        </form>
      </div>
    </div>
  );
}
