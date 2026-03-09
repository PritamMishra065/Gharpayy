import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { AGENTS, FOLLOW_UP_RULES, AUTO_REASSIGNMENT } from '../data/data';

const API = '/api';
const LeadContext = createContext();

// Helper: normalize ID (Mongoose returns _id + virtual id)
const getId = (obj) => obj?._id || obj?.id;

export function useLeads() {
  return useContext(LeadContext);
}

// Least loaded assignment
function getLeastLoadedAgent(leads) {
  const loadMap = {};
  AGENTS.forEach(a => { loadMap[a.id] = 0; });
  leads.forEach(l => {
    if (!['booked', 'lost'].includes(l.stage)) {
      loadMap[l.agent] = (loadMap[l.agent] || 0) + 1;
    }
  });
  let minAgent = AGENTS[0].id;
  let minLoad = Infinity;
  AGENTS.forEach(a => {
    if (loadMap[a.id] < minLoad) {
      minLoad = loadMap[a.id];
      minAgent = a.id;
    }
  });
  return minAgent;
}

// Round-robin
let lastAssignedIndex = -1;
function getNextAgent() {
  lastAssignedIndex = (lastAssignedIndex + 1) % AGENTS.length;
  return AGENTS[lastAssignedIndex].id;
}

export function LeadProvider({ children }) {
  const [leads, setLeads] = useState([]);
  const [visits, setVisits] = useState([]);
  const [activities, setActivities] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // ---------- FETCH DATA ----------
  const fetchLeads = useCallback(async () => {
    try {
      const res = await fetch(`${API}/leads`);
      if (res.ok) setLeads(await res.json());
    } catch { /* fallback to local */ }
  }, []);

  const fetchVisits = useCallback(async () => {
    try {
      const res = await fetch(`${API}/visits`);
      if (res.ok) setVisits(await res.json());
    } catch { /* fallback */ }
  }, []);

  // Initial fetch
  useEffect(() => {
    Promise.all([fetchLeads(), fetchVisits()])
      .finally(() => setLoading(false));
  }, [fetchLeads, fetchVisits]);

  // ---------- LEADS ----------
  const addLead = useCallback(async (leadData) => {
    const assignedAgent = leadData.agent || getNextAgent();
    const payload = {
      ...leadData,
      agent: assignedAgent,
      stage: 'new',
      score: Math.floor(Math.random() * 40) + 30,
    };

    try {
      const res = await fetch(`${API}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const newLead = await res.json();
        setLeads(prev => [newLead, ...prev]);

        // WhatsApp concept: auto-send welcome
        if (leadData.source === 'whatsapp') {
          await fetch(`${API}/activities`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              leadId: getId(newLead),
              type: 'whatsapp_sent',
              message: 'Welcome message sent via WhatsApp API',
              agent: assignedAgent,
            }),
          });
        }

        const agent = AGENTS.find(a => a.id === assignedAgent);
        setNotifications(prev => [{
          id: `n${Date.now()}`,
          message: `New lead "${newLead.name}" assigned to ${agent?.name || 'Unknown'}`,
          time: new Date().toISOString(),
          read: false,
        }, ...prev]);

        return newLead;
      }
    } catch (err) {
      console.error('Add lead error:', err);
    }
  }, []);

  const updateLeadStage = useCallback(async (leadId, newStage) => {
    try {
      const res = await fetch(`${API}/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: newStage }),
      });
      if (res.ok) {
        const updated = await res.json();
        setLeads(prev => prev.map(l => getId(l) === leadId ? updated : l));
      }
    } catch (err) {
      console.error('Update stage error:', err);
    }
  }, []);

  const updateLead = useCallback(async (leadId, updates) => {
    try {
      const res = await fetch(`${API}/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const updated = await res.json();
        setLeads(prev => prev.map(l => getId(l) === leadId ? updated : l));
      }
    } catch (err) {
      console.error('Update lead error:', err);
    }
  }, []);

  const deleteLead = useCallback(async (leadId) => {
    try {
      const res = await fetch(`${API}/leads/${leadId}`, { method: 'DELETE' });
      if (res.ok) {
        setLeads(prev => prev.filter(l => getId(l) !== leadId));
      }
    } catch (err) {
      console.error('Delete lead error:', err);
    }
  }, []);

  const reassignLead = useCallback(async (leadId, newAgentId, reason = 'manual') => {
    try {
      const res = await fetch(`${API}/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent: newAgentId, reassignReason: reason }),
      });
      if (res.ok) {
        const updated = await res.json();
        setLeads(prev => prev.map(l => getId(l) === leadId ? updated : l));

        const agent = AGENTS.find(a => a.id === newAgentId);
        setNotifications(prev => [{
          id: `n${Date.now()}`,
          message: `Lead reassigned to ${agent?.name} — ${reason}`,
          time: new Date().toISOString(),
          read: false,
        }, ...prev]);
      }
    } catch (err) {
      console.error('Reassign error:', err);
    }
  }, []);

  // ---------- ACTIVITIES ----------
  const addActivity = useCallback(async (leadId, type, message, agentId = null) => {
    try {
      const res = await fetch(`${API}/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId, type, message, agent: agentId }),
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.error('Add activity error:', err);
    }
  }, []);

  const getLeadActivities = useCallback(async (leadId) => {
    try {
      const res = await fetch(`${API}/activities/${leadId}`);
      if (res.ok) return await res.json();
    } catch { /* fallback */ }
    return [];
  }, []);

  // ---------- VISITS ----------
  const scheduleVisit = useCallback(async (visitData) => {
    try {
      const res = await fetch(`${API}/visits`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(visitData),
      });
      if (res.ok) {
        const newVisit = await res.json();
        setVisits(prev => [newVisit, ...prev]);
        // Refresh leads since stage changes
        fetchLeads();
        return newVisit;
      }
    } catch (err) {
      console.error('Schedule visit error:', err);
    }
  }, [fetchLeads]);

  const completeVisit = useCallback(async (visitId, outcome) => {
    try {
      const res = await fetch(`${API}/visits/${visitId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed', outcome }),
      });
      if (res.ok) {
        const updated = await res.json();
        setVisits(prev => prev.map(v => (getId(v) === visitId ? updated : v)));
        fetchLeads(); // Refresh leads since stage changes
      }
    } catch (err) {
      console.error('Complete visit error:', err);
    }
  }, [fetchLeads]);

  // ---------- AUTO-REASSIGNMENT ----------
  const checkAutoReassignment = useCallback(() => {
    if (!AUTO_REASSIGNMENT.enabled) return [];
    const now = new Date();
    const timeoutMs = AUTO_REASSIGNMENT.timeoutMinutes * 60 * 1000;
    return leads.filter(lead => {
      if (lead.stage === 'new' && !lead.agentRespondedAt) {
        return (now - new Date(lead.createdAt)) > timeoutMs;
      }
      return false;
    });
  }, [leads]);

  const triggerAutoReassignment = useCallback(async (leadId) => {
    const newAgentId = getLeastLoadedAgent(leads);
    const lead = leads.find(l => getId(l) === leadId);
    if (lead && newAgentId !== lead.agent) {
      await reassignLead(leadId, newAgentId, 'auto-reassignment (no response)');
    }
  }, [leads, reassignLead]);

  // ---------- WHATSAPP ----------
  const sendWhatsApp = useCallback(async (leadId, templateId, customMessage = '') => {
    const lead = leads.find(l => getId(l) === leadId);
    if (!lead) return;
    const msg = customMessage || `WhatsApp template "${templateId}" sent`;
    await addActivity(leadId, 'whatsapp_sent', msg, lead.agent);
    setNotifications(prev => [{
      id: `n${Date.now()}`,
      message: `WhatsApp message sent to ${lead.name}`,
      time: new Date().toISOString(),
      read: false,
    }, ...prev]);
  }, [leads, addActivity]);

  // ---------- NOTIFICATIONS & FOLLOW-UPS ----------
  const markNotificationRead = useCallback((notifId) => {
    setNotifications(prev => prev.map(n =>
      n.id === notifId ? { ...n, read: true } : n
    ));
  }, []);

  const getFollowUpLeads = useCallback(() => {
    const now = new Date();
    const threshold = FOLLOW_UP_RULES.inactiveDays * 24 * 60 * 60 * 1000;
    return leads.filter(lead => {
      if (lead.stage === 'booked' || lead.stage === 'lost') return false;
      const lastAct = new Date(lead.updatedAt || lead.lastActivity || lead.createdAt);
      return (now - lastAct) > threshold;
    });
  }, [leads]);

  // ---------- STATS ----------
  const stats = useMemo(() => {
    const totalLeads = leads.length;
    const byStage = {};
    leads.forEach(l => { byStage[l.stage] = (byStage[l.stage] || 0) + 1; });
    const bySource = {};
    leads.forEach(l => { bySource[l.source] = (bySource[l.source] || 0) + 1; });
    const upcomingVisits = visits.filter(v => v.status === 'confirmed').length;
    const completedVisits = visits.filter(v => v.status === 'completed').length;
    const bookings = leads.filter(l => l.stage === 'booked').length;
    const avgScore = leads.length ? Math.round(leads.reduce((sum, l) => sum + l.score, 0) / leads.length) : 0;
    const followUps = getFollowUpLeads().length;
    return { totalLeads, byStage, bySource, upcomingVisits, completedVisits, bookings, avgScore, followUps };
  }, [leads, visits, getFollowUpLeads]);

  // ---------- AGENT PERFORMANCE ----------
  const agentPerformance = useMemo(() => {
    return AGENTS.map(agent => {
      const agentLeads = leads.filter(l => l.agent === agent.id);
      const total = agentLeads.length;
      const active = agentLeads.filter(l => !['booked', 'lost'].includes(l.stage)).length;
      const booked = agentLeads.filter(l => l.stage === 'booked').length;
      const lost = agentLeads.filter(l => l.stage === 'lost').length;
      const conversionRate = total > 0 ? Math.round((booked / total) * 100) : 0;
      const avgLeadScore = agentLeads.length
        ? Math.round(agentLeads.reduce((sum, l) => sum + l.score, 0) / agentLeads.length)
        : 0;
      const agentVisits = visits.filter(v => v.agent === agent.id);
      const completedVisits = agentVisits.filter(v => v.status === 'completed').length;
      const performanceScore = Math.min(100, Math.round(
        (conversionRate * 0.35) +
        (avgLeadScore * 0.25) +
        (completedVisits * 5 * 0.1) +
        (total * 2)
      ));
      return { ...agent, total, active, booked, lost, conversionRate, avgLeadScore, completedVisits, performanceScore, responseActions: total * 2 };
    }).sort((a, b) => b.performanceScore - a.performanceScore);
  }, [leads, visits]);

  const value = {
    leads,
    visits,
    activities,
    notifications,
    stats,
    agentPerformance,
    loading,
    addLead,
    updateLead,
    updateLeadStage,
    deleteLead,
    reassignLead,
    triggerAutoReassignment,
    checkAutoReassignment,
    sendWhatsApp,
    scheduleVisit,
    completeVisit,
    markNotificationRead,
    getFollowUpLeads,
    addActivity,
    getLeadActivities,
    fetchLeads,
  };

  return (
    <LeadContext.Provider value={value}>
      {children}
    </LeadContext.Provider>
  );
}
