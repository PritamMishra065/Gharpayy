import 'dotenv/config';
import { connectDB } from './db.js';
import Lead from './models/Lead.js';
import Visit from './models/Visit.js';
import Activity from './models/Activity.js';


const LEADS_DATA = [
  { name: 'Ananya Krishnan', phone: '+91 98765 43210', source: 'whatsapp', stage: 'visit_scheduled', score: 85, assignedTo: 'Priya Sharma', location: 'Koramangala', budget: '8000-10000' },
  { name: 'Vikram Joshi', phone: '+91 87654 32109', source: 'website', stage: 'requirement', score: 70, assignedTo: 'Rahul Verma', location: 'HSR Layout', budget: '7000-9000' },
  { name: 'Divya Nair', phone: '+91 76543 21098', source: 'social', stage: 'contacted', score: 60, assignedTo: 'Sneha Patil', location: 'BTM Layout', budget: '6000-8000' },
  { name: 'Rohan Mehta', phone: '+91 65432 10987', source: 'lead_form', stage: 'new', score: 45, assignedTo: 'Amit Kumar', location: 'Indiranagar', budget: '10000-15000' },
  { name: 'Meera Reddy', phone: '+91 54321 09876', source: 'phone', stage: 'property_suggested', score: 75, assignedTo: 'Priya Sharma', location: 'Electronic City', budget: '5000-7000' },
  { name: 'Arun Kumar', phone: '+91 43210 98765', source: 'whatsapp', stage: 'visit_done', score: 90, assignedTo: 'Rahul Verma', location: 'Whitefield', budget: '7000-9000' },
  { name: 'Kavitha Sundaram', phone: '+91 32109 87654', source: 'referral', stage: 'booked', score: 95, assignedTo: 'Sneha Patil', location: 'Koramangala', budget: '8000-10000' },
  { name: 'Deepak Gowda', phone: '+91 21098 76543', source: 'website', stage: 'lost', score: 20, assignedTo: 'Amit Kumar', location: 'Marathahalli', budget: '5000-6000' },
  { name: 'Neha Agarwal', phone: '+91 10987 65432', source: 'social', stage: 'new', score: 50, assignedTo: 'Priya Sharma', location: 'JP Nagar', budget: '8000-10000' },
  { name: 'Siddharth Rao', phone: '+91 09876 54321', source: 'lead_form', stage: 'contacted', score: 55, assignedTo: 'Rahul Verma', location: 'HSR Layout', budget: '9000-12000' },
  { name: 'Pooja Hegde', phone: '+91 98712 34567', source: 'whatsapp', stage: 'requirement', score: 65, assignedTo: 'Sneha Patil', location: 'Koramangala', budget: '7000-9000' },
  { name: 'Rajesh Iyer', phone: '+91 87612 34567', source: 'phone', stage: 'visit_scheduled', score: 80, assignedTo: 'Amit Kumar', location: 'Indiranagar', budget: '11000-14000' },
  { name: 'Fatima Sheikh', phone: '+91 76512 34567', source: 'website', stage: 'new', score: 40, assignedTo: 'Priya Sharma', location: 'BTM Layout', budget: '6000-7500' },
  { name: 'Karthik Bhat', phone: '+91 65412 34567', source: 'referral', stage: 'property_suggested', score: 72, assignedTo: 'Rahul Verma', location: 'Whitefield', budget: '7500-9500' },
  { name: 'Lakshmi Menon', phone: '+91 54312 34567', source: 'social', stage: 'contacted', score: 58, assignedTo: 'Sneha Patil', location: 'Electronic City', budget: '5500-7000' },
];

async function seed() {
  try {
    console.log('🔄 Connecting to MongoDB database...');
    await connectDB();

    console.log('🧹 Clearing existing collections...');
    await Lead.deleteMany({});
    await Visit.deleteMany({});
    await Activity.deleteMany({});

    // Insert leads
    const leadMap = {};
    for (const data of LEADS_DATA) {
      const pastDate = new Date(new Date().getTime() - Math.random() * 10000000000);

      const newLead = await Lead.create({
        ...data,
        createdAt: pastDate,
        lastActivity: pastDate
      });
      
      leadMap[data.name] = newLead._id;
    }
    console.log(`📋 Inserted ${LEADS_DATA.length} leads`);

    // Insert visits
    const visitsData = [
      { leadId: leadMap['Ananya Krishnan'], property: 'Sunshine PG - Koramangala', date: new Date('2026-03-10T11:00:00Z'), status: 'confirmed' },
      { leadId: leadMap['Rajesh Iyer'], property: 'Elite PG - Indiranagar', date: new Date('2026-03-10T15:00:00Z'), status: 'confirmed' },
      { leadId: leadMap['Arun Kumar'], property: 'GreenView PG - Whitefield', date: new Date('2026-03-08T10:00:00Z'), status: 'completed', notes: 'considering' },
      { leadId: leadMap['Kavitha Sundaram'], property: 'Sunshine PG - Koramangala', date: new Date('2026-03-06T14:00:00Z'), status: 'completed', notes: 'booked' },
    ];

    await Visit.insertMany(visitsData);
    console.log(`📅 Inserted ${visitsData.length} visits`);

    // Insert activities
    const actsData = [
      { leadId: leadMap['Ananya Krishnan'], type: 'created', content: 'Lead created from WhatsApp inquiry', actor: 'System' },
      { leadId: leadMap['Ananya Krishnan'], type: 'assigned', content: 'Auto-assigned to Priya Sharma (round-robin)', actor: 'System' },
      { leadId: leadMap['Ananya Krishnan'], type: 'whatsapp_sent', content: 'Welcome message sent via WhatsApp', actor: 'Priya Sharma' },
      { leadId: leadMap['Ananya Krishnan'], type: 'stage_change', content: 'Stage changed: New Lead → Contacted', actor: 'Priya Sharma' },
      { leadId: leadMap['Ananya Krishnan'], type: 'note', content: 'Looking for single sharing near office in Koramangala. Budget ₹8k-10k.', actor: 'Priya Sharma' },
      { leadId: leadMap['Vikram Joshi'], type: 'created', content: 'Lead submitted website form', actor: 'System' },
      { leadId: leadMap['Vikram Joshi'], type: 'assigned', content: 'Auto-assigned to Rahul Verma', actor: 'System' },
      { leadId: leadMap['Vikram Joshi'], type: 'call', content: 'Called lead, discussed requirements', actor: 'Rahul Verma' },
      { leadId: leadMap['Vikram Joshi'], type: 'stage_change', content: 'Stage changed: New Lead → Contacted', actor: 'Rahul Verma' },
      { leadId: leadMap['Arun Kumar'], type: 'created', content: 'Lead initiated WhatsApp chat', actor: 'System' },
      { leadId: leadMap['Arun Kumar'], type: 'visit_completed', content: 'Visit completed — outcome: Considering', actor: 'Rahul Verma' },
      { leadId: leadMap['Kavitha Sundaram'], type: 'visit_completed', content: 'Visit completed — loved Sunshine PG', actor: 'Sneha Patil' },
      { leadId: leadMap['Kavitha Sundaram'], type: 'stage_change', content: 'Stage changed: Visit Completed → Booked 🎉', actor: 'Sneha Patil' },
    ];

    await Activity.insertMany(actsData);
    console.log(`📊 Inserted ${actsData.length} activity events`);

    console.log('\n✅ MongoDB Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
}

seed();
