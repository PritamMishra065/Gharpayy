import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LeadProvider } from './context/LeadContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Pipeline from './pages/Pipeline';
import Visits from './pages/Visits';
import Properties from './pages/Properties';
import Leaderboard from './pages/Leaderboard';

function App() {
  return (
    <BrowserRouter>
      <LeadProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/pipeline" element={<Pipeline />} />
            <Route path="/visits" element={<Visits />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Route>
        </Routes>
      </LeadProvider>
    </BrowserRouter>
  );
}

export default App;

