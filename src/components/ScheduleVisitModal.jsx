import { useState } from 'react';
import { X } from 'lucide-react';
import { useLeads } from '../context/LeadContext';
import { PROPERTIES, AGENTS } from '../data/data';

export default function ScheduleVisitModal({ onClose }) {
  const { leads, scheduleVisit } = useLeads();
  const eligibleLeads = leads.filter(l => !['booked', 'lost', 'visit_scheduled', 'visit_done'].includes(l.stage));

  const [form, setForm] = useState({
    leadId: '',
    propertyId: '',
    date: '',
    time: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.leadId || !form.propertyId || !form.date || !form.time) return;

    const lead = leads.find(l => l.id === form.leadId);
    const property = PROPERTIES.find(p => p.id === form.propertyId);

    scheduleVisit({
      leadId: form.leadId,
      leadName: lead?.name || '',
      propertyId: form.propertyId,
      propertyName: property?.name || '',
      date: form.date,
      time: form.time,
      agent: lead?.agent || '',
    });
    onClose();
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">Schedule Property Visit</h2>
          <button className="modal-close" onClick={onClose}><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Select Lead *</label>
              <select className="form-select" value={form.leadId} onChange={e => handleChange('leadId', e.target.value)} required>
                <option value="">Choose a lead</option>
                {eligibleLeads.map(l => (
                  <option key={l.id} value={l.id}>{l.name} — {l.phone}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Select Property *</label>
              <select className="form-select" value={form.propertyId} onChange={e => handleChange('propertyId', e.target.value)} required>
                <option value="">Choose a property</option>
                {PROPERTIES.map(p => (
                  <option key={p.id} value={p.id}>{p.name} — ₹{p.rent.toLocaleString('en-IN')}/mo</option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Visit Date *</label>
                <input
                  className="form-input"
                  type="date"
                  value={form.date}
                  onChange={e => handleChange('date', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Visit Time *</label>
                <select className="form-select" value={form.time} onChange={e => handleChange('time', e.target.value)} required>
                  <option value="">Select time</option>
                  <option value="9:00 AM">9:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="12:00 PM">12:00 PM</option>
                  <option value="1:00 PM">1:00 PM</option>
                  <option value="2:00 PM">2:00 PM</option>
                  <option value="3:00 PM">3:00 PM</option>
                  <option value="4:00 PM">4:00 PM</option>
                  <option value="5:00 PM">5:00 PM</option>
                </select>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">Schedule Visit</button>
          </div>
        </form>
      </div>
    </div>
  );
}
