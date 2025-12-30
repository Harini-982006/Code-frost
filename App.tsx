
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import SafetyAlerts from './pages/SafetyAlerts';
import Checklist from './pages/Checklist';
import HealthHub from './pages/HealthHub';
import Advisor from './pages/Advisor';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/alerts" element={<SafetyAlerts />} />
          <Route path="/checklist" element={<Checklist />} />
          <Route path="/health" element={<HealthHub />} />
          <Route path="/advisor" element={<Advisor />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
