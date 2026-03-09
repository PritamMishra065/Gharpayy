// Gharpayy CRM - Sample Data
// PG accommodations in Bangalore for students and working professionals

export const PIPELINE_STAGES = [
  { id: 'new', label: 'New Lead', color: '#6366f1' },
  { id: 'contacted', label: 'Contacted', color: '#3b82f6' },
  { id: 'requirement', label: 'Requirement Collected', color: '#8b5cf6' },
  { id: 'property_suggested', label: 'Property Suggested', color: '#f59e0b' },
  { id: 'visit_scheduled', label: 'Visit Scheduled', color: '#10b981' },
  { id: 'visit_done', label: 'Visit Completed', color: '#14b8a6' },
  { id: 'booked', label: 'Booked', color: '#22c55e' },
  { id: 'lost', label: 'Lost', color: '#ef4444' },
];

export const LEAD_SOURCES = [
  { id: 'whatsapp', label: 'WhatsApp', color: '#25D366' },
  { id: 'website', label: 'Website', color: '#3b82f6' },
  { id: 'social', label: 'Social Media', color: '#e1306c' },
  { id: 'phone', label: 'Phone Call', color: '#f59e0b' },
  { id: 'lead_form', label: 'Lead Form', color: '#8b5cf6' },
  { id: 'referral', label: 'Referral', color: '#14b8a6' },
];

export const AGENTS = [
  { id: 'a1', name: 'Priya Sharma', avatar: 'PS', activeLeads: 5 },
  { id: 'a2', name: 'Rahul Verma', avatar: 'RV', activeLeads: 3 },
  { id: 'a3', name: 'Sneha Patil', avatar: 'SP', activeLeads: 4 },
  { id: 'a4', name: 'Arjun Reddy', avatar: 'AR', activeLeads: 2 },
];

export const PROPERTIES = [
  { id: 'p1', name: 'Sunshine PG - Koramangala', area: 'Koramangala', rent: 8500, type: 'Single Sharing', amenities: ['WiFi', 'AC', 'Food'] },
  { id: 'p2', name: 'Urban Nest - HSR Layout', area: 'HSR Layout', rent: 9500, type: 'Double Sharing', amenities: ['WiFi', 'Gym', 'Food'] },
  { id: 'p3', name: 'Comfort Stay - BTM Layout', area: 'BTM Layout', rent: 7000, type: 'Triple Sharing', amenities: ['WiFi', 'Food', 'Laundry'] },
  { id: 'p4', name: 'Elite PG - Indiranagar', area: 'Indiranagar', rent: 12000, type: 'Single Sharing', amenities: ['WiFi', 'AC', 'Gym', 'Food'] },
  { id: 'p5', name: 'Student Hub - Electronic City', area: 'Electronic City', rent: 6500, type: 'Double Sharing', amenities: ['WiFi', 'Food'] },
  { id: 'p6', name: 'GreenView PG - Whitefield', area: 'Whitefield', rent: 8000, type: 'Single Sharing', amenities: ['WiFi', 'AC', 'Food', 'Parking'] },
  { id: 'p7', name: 'Metro Living - Marathahalli', area: 'Marathahalli', rent: 7500, type: 'Double Sharing', amenities: ['WiFi', 'Food', 'Laundry'] },
  { id: 'p8', name: 'Haven PG - JP Nagar', area: 'JP Nagar', rent: 9000, type: 'Single Sharing', amenities: ['WiFi', 'AC', 'Food', 'Gym'] },
];

export const INITIAL_LEADS = [
  { id: 'l1', name: 'Ananya Krishnan', phone: '+91 98765 43210', email: 'ananya.k@gmail.com', source: 'whatsapp', stage: 'visit_scheduled', score: 85, agent: 'a1', location: 'Koramangala', budget: '8000-10000', occupation: 'Working Professional', createdAt: '2026-03-08T10:30:00', lastActivity: '2026-03-09T14:20:00', notes: 'Looking for single sharing near office in Koramangala' },
  { id: 'l2', name: 'Vikram Joshi', phone: '+91 87654 32109', email: 'vikram.j@outlook.com', source: 'website', stage: 'requirement', score: 70, agent: 'a2', location: 'HSR Layout', budget: '7000-9000', occupation: 'Student', createdAt: '2026-03-07T15:45:00', lastActivity: '2026-03-09T11:00:00', notes: 'Engineering student at PES University' },
  { id: 'l3', name: 'Divya Nair', phone: '+91 76543 21098', email: 'divya.nair@gmail.com', source: 'social', stage: 'contacted', score: 60, agent: 'a3', location: 'BTM Layout', budget: '6000-8000', occupation: 'Student', createdAt: '2026-03-06T09:15:00', lastActivity: '2026-03-08T16:30:00', notes: 'Responded to Instagram ad' },
  { id: 'l4', name: 'Rohan Mehta', phone: '+91 65432 10987', email: 'rohan.m@yahoo.com', source: 'lead_form', stage: 'new', score: 45, agent: 'a4', location: 'Indiranagar', budget: '10000-15000', occupation: 'Working Professional', createdAt: '2026-03-09T08:00:00', lastActivity: '2026-03-09T08:00:00', notes: 'Submitted Google Form, premium budget' },
  { id: 'l5', name: 'Meera Reddy', phone: '+91 54321 09876', email: 'meera.r@gmail.com', source: 'phone', stage: 'property_suggested', score: 75, agent: 'a1', location: 'Electronic City', budget: '5000-7000', occupation: 'Student', createdAt: '2026-03-05T14:20:00', lastActivity: '2026-03-09T09:45:00', notes: 'Called in, shared 3 options near her college' },
  { id: 'l6', name: 'Arun Kumar', phone: '+91 43210 98765', email: 'arun.k@gmail.com', source: 'whatsapp', stage: 'visit_done', score: 90, agent: 'a2', location: 'Whitefield', budget: '7000-9000', occupation: 'Working Professional', createdAt: '2026-03-03T11:30:00', lastActivity: '2026-03-09T17:00:00', notes: 'Visited GreenView PG, liked it, deciding' },
  { id: 'l7', name: 'Kavitha Sundaram', phone: '+91 32109 87654', email: 'kavitha.s@gmail.com', source: 'referral', stage: 'booked', score: 95, agent: 'a3', location: 'Koramangala', budget: '8000-10000', occupation: 'Working Professional', createdAt: '2026-02-28T10:00:00', lastActivity: '2026-03-08T12:00:00', notes: 'Referred by Kavitha, booked Sunshine PG' },
  { id: 'l8', name: 'Deepak Gowda', phone: '+91 21098 76543', email: 'deepak.g@gmail.com', source: 'website', stage: 'lost', score: 20, agent: 'a4', location: 'Marathahalli', budget: '5000-6000', occupation: 'Student', createdAt: '2026-02-25T09:00:00', lastActivity: '2026-03-05T15:00:00', notes: 'Found accommodation elsewhere' },
  { id: 'l9', name: 'Neha Agarwal', phone: '+91 10987 65432', email: 'neha.a@gmail.com', source: 'social', stage: 'new', score: 50, agent: 'a1', location: 'JP Nagar', budget: '8000-10000', occupation: 'Working Professional', createdAt: '2026-03-09T12:30:00', lastActivity: '2026-03-09T12:30:00', notes: 'Messaged on Facebook page' },
  { id: 'l10', name: 'Siddharth Rao', phone: '+91 09876 54321', email: 'sid.rao@gmail.com', source: 'lead_form', stage: 'contacted', score: 55, agent: 'a2', location: 'HSR Layout', budget: '9000-12000', occupation: 'Working Professional', createdAt: '2026-03-08T16:00:00', lastActivity: '2026-03-09T10:15:00', notes: 'Filled Tally form, looking for premium PG' },
  { id: 'l11', name: 'Pooja Hegde', phone: '+91 98712 34567', email: 'pooja.h@gmail.com', source: 'whatsapp', stage: 'requirement', score: 65, agent: 'a3', location: 'Koramangala', budget: '7000-9000', occupation: 'Student', createdAt: '2026-03-07T08:45:00', lastActivity: '2026-03-09T13:00:00', notes: 'MBA student at Christ University' },
  { id: 'l12', name: 'Rajesh Iyer', phone: '+91 87612 34567', email: 'rajesh.i@gmail.com', source: 'phone', stage: 'visit_scheduled', score: 80, agent: 'a4', location: 'Indiranagar', budget: '11000-14000', occupation: 'Working Professional', createdAt: '2026-03-06T13:00:00', lastActivity: '2026-03-09T16:00:00', notes: 'Visit scheduled for Elite PG on 10th March' },
  { id: 'l13', name: 'Fatima Sheikh', phone: '+91 76512 34567', email: 'fatima.s@gmail.com', source: 'website', stage: 'new', score: 40, agent: 'a1', location: 'BTM Layout', budget: '6000-7500', occupation: 'Student', createdAt: '2026-03-09T18:00:00', lastActivity: '2026-03-09T18:00:00', notes: 'Submitted form on website' },
  { id: 'l14', name: 'Karthik Bhat', phone: '+91 65412 34567', email: 'karthik.b@gmail.com', source: 'referral', stage: 'property_suggested', score: 72, agent: 'a2', location: 'Whitefield', budget: '7500-9500', occupation: 'Working Professional', createdAt: '2026-03-04T10:30:00', lastActivity: '2026-03-09T11:30:00', notes: 'Referred by Arun Kumar' },
  { id: 'l15', name: 'Lakshmi Menon', phone: '+91 54312 34567', email: 'lakshmi.m@gmail.com', source: 'social', stage: 'contacted', score: 58, agent: 'a3', location: 'Electronic City', budget: '5500-7000', occupation: 'Student', createdAt: '2026-03-08T14:15:00', lastActivity: '2026-03-09T09:00:00', notes: 'DM on Instagram, interested in double sharing' },
];

export const INITIAL_VISITS = [
  { id: 'v1', leadId: 'l1', leadName: 'Ananya Krishnan', propertyId: 'p1', propertyName: 'Sunshine PG - Koramangala', date: '2026-03-10', time: '11:00 AM', agent: 'a1', status: 'confirmed', outcome: null },
  { id: 'v2', leadId: 'l12', leadName: 'Rajesh Iyer', propertyId: 'p4', propertyName: 'Elite PG - Indiranagar', date: '2026-03-10', time: '3:00 PM', agent: 'a4', status: 'confirmed', outcome: null },
  { id: 'v3', leadId: 'l6', leadName: 'Arun Kumar', propertyId: 'p6', propertyName: 'GreenView PG - Whitefield', date: '2026-03-08', time: '10:00 AM', agent: 'a2', status: 'completed', outcome: 'considering' },
  { id: 'v4', leadId: 'l7', leadName: 'Kavitha Sundaram', propertyId: 'p1', propertyName: 'Sunshine PG - Koramangala', date: '2026-03-06', time: '2:00 PM', agent: 'a3', status: 'completed', outcome: 'booked' },
];

export const FOLLOW_UP_RULES = {
  inactiveDays: 1,
  reminderMessage: 'This lead has been inactive for over 24 hours. Please follow up.',
};

// Auto-reassignment config: if an agent doesn't respond within X minutes, reassign
export const AUTO_REASSIGNMENT = {
  timeoutMinutes: 30,
  enabled: true,
  method: 'least_loaded', // 'round_robin' | 'least_loaded'
};

// WhatsApp Business API integration config (concept)
export const WHATSAPP_CONFIG = {
  apiUrl: 'https://graph.facebook.com/v18.0/{PHONE_NUMBER_ID}/messages',
  webhookUrl: 'https://api.gharpayy.com/webhooks/whatsapp',
  businessNumber: '+91 80000 12345',
  templates: [
    { id: 'welcome', name: 'Welcome Message', body: 'Hi {{name}}, thank you for your interest in Gharpayy PG! Our agent {{agent}} will reach out shortly.' },
    { id: 'follow_up', name: 'Follow-up', body: 'Hi {{name}}, we have some great PG options in {{location}}. Would you like to schedule a visit?' },
    { id: 'visit_confirm', name: 'Visit Confirmation', body: 'Hi {{name}}, your visit to {{property}} is confirmed for {{date}} at {{time}}. Our agent {{agent}} will meet you there.' },
    { id: 'post_visit', name: 'Post Visit', body: 'Hi {{name}}, how was your visit to {{property}}? Would you like to proceed with booking?' },
  ],
  status: 'sandbox', // 'sandbox' | 'production'
};

// Pre-seeded activity events for lead timelines
export const INITIAL_ACTIVITIES = [
  // l1 - Ananya
  { id: 'act1', leadId: 'l1', type: 'created', message: 'Lead created from WhatsApp inquiry', agent: null, timestamp: '2026-03-08T10:30:00' },
  { id: 'act2', leadId: 'l1', type: 'assigned', message: 'Auto-assigned to Priya Sharma (round-robin)', agent: 'a1', timestamp: '2026-03-08T10:30:05' },
  { id: 'act3', leadId: 'l1', type: 'whatsapp_sent', message: 'Welcome message sent via WhatsApp', agent: 'a1', timestamp: '2026-03-08T10:32:00' },
  { id: 'act4', leadId: 'l1', type: 'stage_change', message: 'Stage changed: New Lead → Contacted', agent: 'a1', timestamp: '2026-03-08T11:00:00' },
  { id: 'act5', leadId: 'l1', type: 'note', message: 'Looking for single sharing near office in Koramangala. Budget ₹8k-10k.', agent: 'a1', timestamp: '2026-03-08T11:15:00' },
  { id: 'act6', leadId: 'l1', type: 'stage_change', message: 'Stage changed: Contacted → Requirement Collected', agent: 'a1', timestamp: '2026-03-08T14:00:00' },
  { id: 'act7', leadId: 'l1', type: 'whatsapp_sent', message: 'Shared Sunshine PG details via WhatsApp', agent: 'a1', timestamp: '2026-03-08T15:30:00' },
  { id: 'act8', leadId: 'l1', type: 'stage_change', message: 'Stage changed: Requirement Collected → Property Suggested', agent: 'a1', timestamp: '2026-03-08T15:30:00' },
  { id: 'act9', leadId: 'l1', type: 'whatsapp_received', message: 'Lead replied: "Looks good, can I visit tomorrow?"', agent: null, timestamp: '2026-03-08T18:00:00' },
  { id: 'act10', leadId: 'l1', type: 'visit_scheduled', message: 'Visit scheduled at Sunshine PG for 10 Mar, 11:00 AM', agent: 'a1', timestamp: '2026-03-09T10:00:00' },
  { id: 'act11', leadId: 'l1', type: 'whatsapp_sent', message: 'Visit confirmation message sent via WhatsApp', agent: 'a1', timestamp: '2026-03-09T10:01:00' },
  // l2 - Vikram
  { id: 'act12', leadId: 'l2', type: 'created', message: 'Lead submitted website form', agent: null, timestamp: '2026-03-07T15:45:00' },
  { id: 'act13', leadId: 'l2', type: 'assigned', message: 'Auto-assigned to Rahul Verma (round-robin)', agent: 'a2', timestamp: '2026-03-07T15:45:05' },
  { id: 'act14', leadId: 'l2', type: 'call', message: 'Called lead, discussed requirements', agent: 'a2', timestamp: '2026-03-07T16:30:00' },
  { id: 'act15', leadId: 'l2', type: 'stage_change', message: 'Stage changed: New Lead → Contacted', agent: 'a2', timestamp: '2026-03-07T16:30:00' },
  { id: 'act16', leadId: 'l2', type: 'note', message: 'Engineering student at PES, needs near campus. Budget ₹7k-9k.', agent: 'a2', timestamp: '2026-03-08T10:00:00' },
  { id: 'act17', leadId: 'l2', type: 'stage_change', message: 'Stage changed: Contacted → Requirement Collected', agent: 'a2', timestamp: '2026-03-09T11:00:00' },
  // l4 - Rohan (for reassignment demo)
  { id: 'act18', leadId: 'l4', type: 'created', message: 'Lead submitted Google Form', agent: null, timestamp: '2026-03-09T08:00:00' },
  { id: 'act19', leadId: 'l4', type: 'assigned', message: 'Auto-assigned to Arjun Reddy (round-robin)', agent: 'a4', timestamp: '2026-03-09T08:00:05' },
  { id: 'act20', leadId: 'l4', type: 'reassignment_warning', message: '⚠ No response from Arjun Reddy in 30 min — auto-reassignment pending', agent: null, timestamp: '2026-03-09T08:30:05' },
  // l6 - Arun
  { id: 'act21', leadId: 'l6', type: 'created', message: 'Lead initiated WhatsApp chat', agent: null, timestamp: '2026-03-03T11:30:00' },
  { id: 'act22', leadId: 'l6', type: 'assigned', message: 'Auto-assigned to Rahul Verma', agent: 'a2', timestamp: '2026-03-03T11:30:05' },
  { id: 'act23', leadId: 'l6', type: 'whatsapp_sent', message: 'Welcome message sent via WhatsApp', agent: 'a2', timestamp: '2026-03-03T11:32:00' },
  { id: 'act24', leadId: 'l6', type: 'visit_scheduled', message: 'Visit scheduled at GreenView PG for 8 Mar', agent: 'a2', timestamp: '2026-03-07T14:00:00' },
  { id: 'act25', leadId: 'l6', type: 'visit_completed', message: 'Visit completed — outcome: Considering', agent: 'a2', timestamp: '2026-03-08T10:30:00' },
  { id: 'act26', leadId: 'l6', type: 'whatsapp_sent', message: 'Post-visit follow-up sent via WhatsApp', agent: 'a2', timestamp: '2026-03-08T11:00:00' },
  // l7 - Kavitha (booked)
  { id: 'act27', leadId: 'l7', type: 'created', message: 'Referral lead from existing customer', agent: null, timestamp: '2026-02-28T10:00:00' },
  { id: 'act28', leadId: 'l7', type: 'assigned', message: 'Auto-assigned to Sneha Patil', agent: 'a3', timestamp: '2026-02-28T10:00:05' },
  { id: 'act29', leadId: 'l7', type: 'visit_completed', message: 'Visit completed — loved Sunshine PG', agent: 'a3', timestamp: '2026-03-06T15:00:00' },
  { id: 'act30', leadId: 'l7', type: 'stage_change', message: 'Stage changed: Visit Completed → Booked 🎉', agent: 'a3', timestamp: '2026-03-08T12:00:00' },
  { id: 'act31', leadId: 'l7', type: 'whatsapp_sent', message: 'Booking confirmation sent via WhatsApp', agent: 'a3', timestamp: '2026-03-08T12:05:00' },
];

