# Gharpayy Lead Management CRM

Gharpayy CRM is a custom-built Lead Management System designed specifically to help manage student and working professional inquiries for PG accommodations in Bangalore. It centralizes leads from WhatsApp, Websites, Social Media, and Phone Calls into a single, highly intuitive interface.

### 🌟 Features

- **Centralized Lead Capture**: Aggregate leads from multiple sources.
- **Automated Round-Robin Assignment**: Ensures fair and immediate lead distribution among agents.
- **Pipeline Kanban Board**: Drag-and-drop interface for visually tracking leads from *New* to *Booked*.
- **Visit Scheduling**: Integrated calendar and scheduling tools for tracking property visits.
- **Comprehensive Activity Tracking**: Automatic timeline mapping of every interaction, status change, and note left on a lead.
- **Performance Analytics Dashboard**: Real-time metrics on conversion rates, stage drop-offs, and follow-up alerts.
- **Modern, Professional UI**: A clean, accessible, and fast interface built on the "Pipeline Pal" design aesthetic.

---

## 🚀 Working MVP

The application is deployed live using Vercel Serverless Functions and a MongoDB Atlas Cluster.

**Live URL**: *(Update with your Vercel Project URL once deployed)*
**Source Code Repository**: [https://github.com/PritamMishra065/Gharpayy](https://github.com/PritamMishra065/Gharpayy)

---

## 💻 Local Setup Instructions

To run this application locally for development:

### Prerequisites:
- Node.js (v18+)
- A MongoDB Atlas Cluster Database URL

### Installation & Execution:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/PritamMishra065/Gharpayy.git
   cd Gharpayy
   ```

2. **Install all dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add your MongoDB connection string:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@<your-cluster>.mongodb.net/gharpayy
   ```

4. **Seed the Database (Optional):**
   If starting fresh, run the seeding script to populate the database with mock leads and visits:
   ```bash
   npm run seed
   ```

5. **Start the Application:**
   Run the full-stack application (starts both the Express backend and Vite frontend concurrently):
   ```bash
   npm run dev:full
   ```

The frontend will be available at `http://localhost:5173` and the backend API at `http://localhost:5000`.
