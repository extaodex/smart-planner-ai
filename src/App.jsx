import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Schedule from './pages/Schedule';
import Tasks from './pages/Tasks';
import Stats from './pages/Stats';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <div className="flex h-screen w-full bg-[#050505] text-white overflow-hidden">
        <Sidebar user={{ name: "Utilisateur", email: "demo@example.com", id: "0000" }} />
        <main className="flex-1 h-full overflow-y-auto relative bg-[#050505]">
          <Routes>
            <Route path="/"          element={<Dashboard />} />
            <Route path="/tasks"     element={<Tasks />} />
            <Route path="/schedule"  element={<Schedule />} />
            <Route path="/stats"     element={<Stats />} />
            <Route path="/settings"  element={<Settings />} />
            <Route path="*"          element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
