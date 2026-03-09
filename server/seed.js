import crypto from 'crypto';
import { writeDB } from './db.js';

const LEADS_DATA = [
  { name: 'Ananya Krishnan', phone: '+91 98765 43210', email: 'ananya.k@gmail.com', source: 'whatsapp', stage: 'visit_scheduled', score: 85, agent: 'a1', location: 'Koramangala', budget: '8000-10000', occupation: 'Working Professional', notes: 'Looking for single sharing near office in Koramangala' },
  { name: 'Vikram Joshi', phone: '+91 87654 32109', email: 'vikram.j@outlook.com', source: 'website', stage: 'requirement', score: 70, agent: 'a2', location: 'HSR Layout', budget: '7000-9000', occupation: 'Student', notes: 'Engineering student at PES University' },
  { name: 'Divya Nair', phone: '+91 76543 21098', email: 'divya.nair@gmail.com', source: 'social', stage: 'contacted', score: 60, agent: 'a3', location: 'BTM Layout', budget: '6000-8000', occupation: 'Student', notes: 'Responded to Instagram ad' },
  { name: 'Rohan Mehta', phone: '+91 65432 10987', email: 'rohan.m@yahoo.com', source: 'lead_form', stage: 'new', score: 45, agent: 'a4', location: 'Indiranagar', budget: '10000-15000', occupation: 'Working Professional', notes: 'Submitted Google Form, premium budget' },
  { name: 'Meera Reddy', phone: '+91 54321 09876', email: 'meera.r@gmail.com', source: 'phone', stage: 'property_suggested', score: 75, agent: 'a1', location: 'Electronic City', budget: '5000-7000', occupation: 'Student', notes: 'Called in, shared 3 options near her college' },
  { name: 'Arun Kumar', phone: '+91 43210 98765', email: 'arun.k@gmail.com', source: 'whatsapp', stage: 'visit_done', score: 90, agent: 'a2', location: 'Whitefield', budget: '7000-9000', occupation: 'Working Professional', notes: 'Visited GreenView PG, liked it, deciding' },
  { name: 'Kavitha Sundaram', phone: '+91 32109 87654', email: 'kavitha.s@gmail.com', source: 'referral', stage: 'booked', score: 95, agent: 'a3', location: 'Koramangala', budget: '8000-10000', occupation: 'Working Professional', notes: 'Referred by Kavitha, booked Sunshine PG' },
  { name: 'Deepak Gowda', phone: '+91 21098 76543', email: 'deepak.g@gmail.com', source: 'website', stage: 'lost', score: 20, agent: 'a4', location: 'Marathahalli', budget: '5000-6000', occupation: 'Student', notes: 'Found accommodation elsewhere' },
  { name: 'Neha Agarwal', phone: '+91 10987 65432', email: 'neha.a@gmail.com', source: 'social', stage: 'new', score: 50, agent: 'a1', location: 'JP Nagar', budget: '8000-10000', occupation: 'Working Professional', notes: 'Messaged on Facebook page' },
  { name: 'Siddharth Rao', phone: '+91 09876 54321', email: 'sid.rao@gmail.com', source: 'lead_form', stage: 'contacted', score: 55, agent: 'a2', location: 'HSR Layout', budget: '9000-12000', occupation: 'Working Professional', notes: 'Filled Tally form, looking for premium PG' },
  { name: 'Pooja Hegde', phone: '+91 98712 34567', email: 'pooja.h@gmail.com', source: 'whatsapp', stage: 'requirement', score: 65, agent: 'a3', location: 'Koramangala', budget: '7000-9000', occupation: 'Student', notes: 'MBA student at Christ University' },
  { name: 'Rajesh Iyer', phone: '+91 87612 34567', email: 'rajesh.i@gmail.com', source: 'phone', stage: 'visit_scheduled', score: 80, agent: 'a4', location: 'Indiranagar', budget: '11000-14000', occupation: 'Working Professional', notes: 'Visit scheduled for Elite PG on 10th March' },
  { name: 'Fatima Sheikh', phone: '+91 76512 34567', email: 'fatima.s@gmail.com', source: 'website', stage: 'new', score: 40, agent: 'a1', location: 'BTM Layout', budget: '6000-7500', occupation: 'Student', notes: 'Submitted form on website' },
  { name: 'Karthik Bhat', phone: '+91 65412 34567', email: 'karthik.b@gmail.com', source: 'referral', stage: 'property_suggested', score: 72, agent: 'a2', location: 'Whitefield', budget: '7500-9500', occupation: 'Working Professional', notes: 'Referred by Arun Kumar' },
  { name: 'Lakshmi Menon', phone: '+91 54312 34567', email: 'lakshmi.m@gmail.com', source: 'social', stage: 'contacted', score: 58, agent: 'a3', location: 'Electronic City', budget: '5500-7000', occupation: 'Student', notes: 'DM on Instagram, interested in double sharing' },
];

async function seed() {
  try {
    const db = {
      leads: [],
      visits: [],
      activities: []
    };

    const now = new Date().toISOString();

    // Insert leads
    const leadMap = {};
    for (const data of LEADS_DATA) {
      const _id = crypto.randomUUID();
      const lead = {
        _id,
        id: _id, // Front-end fallback compatibility
        ...data,
        createdAt: new Date(new Date().getTime() - Math.random()*10000000000).toISOString(),
      };
      // For consistency, set updatedAt and lastActivity
      lead.updatedAt = lead.createdAt;
      lead.lastActivity = lead.createdAt;
      
      db.leads.push(lead);
      leadMap[lead.name] = _id;
    }
    console.log(`📋 Inserted ${db.leads.length} leads`);

    // Insert visits
    const visitsData = [
      { leadId: leadMap['Ananya Krishnan'], leadName: 'Ananya Krishnan', propertyId: 'p1', propertyName: 'Sunshine PG - Koramangala', date: '2026-03-10', time: '11:00 AM', agent: 'a1', status: 'confirmed' },
      { leadId: leadMap['Rajesh Iyer'], leadName: 'Rajesh Iyer', propertyId: 'p4', propertyName: 'Elite PG - Indiranagar', date: '2026-03-10', time: '3:00 PM', agent: 'a4', status: 'confirmed' },
      { leadId: leadMap['Arun Kumar'], leadName: 'Arun Kumar', propertyId: 'p6', propertyName: 'GreenView PG - Whitefield', date: '2026-03-08', time: '10:00 AM', agent: 'a2', status: 'completed', outcome: 'considering' },
      { leadId: leadMap['Kavitha Sundaram'], leadName: 'Kavitha Sundaram', propertyId: 'p1', propertyName: 'Sunshine PG - Koramangala', date: '2026-03-06', time: '2:00 PM', agent: 'a3', status: 'completed', outcome: 'booked' },
    ];
    for (const vData of visitsData) {
      const _id = crypto.randomUUID();
      db.visits.push({ ...vData, _id, id: _id, createdAt: now, updatedAt: now });
    }
    console.log(`📅 Inserted ${db.visits.length} visits`);

    // Insert activities
    const actsData = [
      { leadId: leadMap['Ananya Krishnan'], type: 'created', message: 'Lead created from WhatsApp inquiry', timestamp: new Date('2026-03-08T10:30:00').toISOString() },
      { leadId: leadMap['Ananya Krishnan'], type: 'assigned', message: 'Auto-assigned to Priya Sharma (round-robin)', agent: 'a1', timestamp: new Date('2026-03-08T10:30:05').toISOString() },
      { leadId: leadMap['Ananya Krishnan'], type: 'whatsapp_sent', message: 'Welcome message sent via WhatsApp', agent: 'a1', timestamp: new Date('2026-03-08T10:32:00').toISOString() },
      { leadId: leadMap['Ananya Krishnan'], type: 'stage_change', message: 'Stage changed: New Lead → Contacted', agent: 'a1', timestamp: new Date('2026-03-08T11:00:00').toISOString() },
      { leadId: leadMap['Ananya Krishnan'], type: 'note', message: 'Looking for single sharing near office in Koramangala. Budget ₹8k-10k.', agent: 'a1', timestamp: new Date('2026-03-08T11:15:00').toISOString() },
      { leadId: leadMap['Ananya Krishnan'], type: 'stage_change', message: 'Stage changed: Contacted → Requirement Collected', agent: 'a1', timestamp: new Date('2026-03-08T14:00:00').toISOString() },
      { leadId: leadMap['Ananya Krishnan'], type: 'whatsapp_sent', message: 'Shared Sunshine PG details via WhatsApp', agent: 'a1', timestamp: new Date('2026-03-08T15:30:00').toISOString() },
      { leadId: leadMap['Ananya Krishnan'], type: 'whatsapp_received', message: 'Lead replied: "Looks good, can I visit tomorrow?"', timestamp: new Date('2026-03-08T18:00:00').toISOString() },
      { leadId: leadMap['Ananya Krishnan'], type: 'visit_scheduled', message: 'Visit scheduled at Sunshine PG for 10 Mar, 11:00 AM', agent: 'a1', timestamp: new Date('2026-03-09T10:00:00').toISOString() },
      { leadId: leadMap['Vikram Joshi'], type: 'created', message: 'Lead submitted website form', timestamp: new Date('2026-03-07T15:45:00').toISOString() },
      { leadId: leadMap['Vikram Joshi'], type: 'assigned', message: 'Auto-assigned to Rahul Verma', agent: 'a2', timestamp: new Date('2026-03-07T15:45:05').toISOString() },
      { leadId: leadMap['Vikram Joshi'], type: 'call', message: 'Called lead, discussed requirements', agent: 'a2', timestamp: new Date('2026-03-07T16:30:00').toISOString() },
      { leadId: leadMap['Vikram Joshi'], type: 'stage_change', message: 'Stage changed: New Lead → Contacted', agent: 'a2', timestamp: new Date('2026-03-07T16:30:00').toISOString() },
      { leadId: leadMap['Arun Kumar'], type: 'created', message: 'Lead initiated WhatsApp chat', timestamp: new Date('2026-03-03T11:30:00').toISOString() },
      { leadId: leadMap['Arun Kumar'], type: 'assigned', message: 'Auto-assigned to Rahul Verma', agent: 'a2', timestamp: new Date('2026-03-03T11:30:05').toISOString() },
      { leadId: leadMap['Arun Kumar'], type: 'visit_completed', message: 'Visit completed — outcome: Considering', agent: 'a2', timestamp: new Date('2026-03-08T10:30:00').toISOString() },
      { leadId: leadMap['Kavitha Sundaram'], type: 'created', message: 'Referral lead from existing customer', timestamp: new Date('2026-02-28T10:00:00').toISOString() },
      { leadId: leadMap['Kavitha Sundaram'], type: 'assigned', message: 'Auto-assigned to Sneha Patil', agent: 'a3', timestamp: new Date('2026-02-28T10:00:05').toISOString() },
      { leadId: leadMap['Kavitha Sundaram'], type: 'visit_completed', message: 'Visit completed — loved Sunshine PG', agent: 'a3', timestamp: new Date('2026-03-06T15:00:00').toISOString() },
      { leadId: leadMap['Kavitha Sundaram'], type: 'stage_change', message: 'Stage changed: Visit Completed → Booked 🎉', agent: 'a3', timestamp: new Date('2026-03-08T12:00:00').toISOString() },
    ];
    for (const aData of actsData) {
      const _id = crypto.randomUUID();
      db.activities.push({ ...aData, _id, id: _id });
    }
    console.log(`📊 Inserted ${db.activities.length} activity events`);

    await writeDB(db);
    console.log('\n✅ Database seeded successfully (local JSON)!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seed();
