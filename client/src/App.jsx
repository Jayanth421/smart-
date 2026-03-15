import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ShieldAlert, Activity, Ambulance, Stethoscope, Shield, PhoneCall, LayoutDashboard, LogOut } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import CitizenReport from './pages/CitizenReport';
import HospitalPanel from './pages/HospitalPanel';
import DriverPanel from './pages/DriverPanel';
import Login from './pages/Login';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

function AppContent() {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/report" element={<CitizenReport />} />
          <Route path="/hospital" element={<HospitalPanel />} />
          <Route path="/driver" element={<DriverPanel />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
    </div>
  );
}

const Sidebar = () => {
  const { currentUser, userRole, logout } = useAuth();

  return (
    <nav className="sidebar">
      <div className="sidebar-header" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
        <div style={{ background: 'var(--primary)', padding: '8px', borderRadius: '12px' }}>
          <ShieldAlert color="white" size={28} />
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.1rem' }}>S.E.C.S.</h3>
          <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Smart Emergency System</p>
        </div>
      </div>

      <div className="sidebar-links">
        <NavLink to="/report" icon={<PhoneCall />} label="Citizen Report" />
        
        {currentUser && userRole === 'admin' && (
          <NavLink to="/" icon={<LayoutDashboard />} label="Admin Dashboard" />
        )}
        
        {currentUser && userRole === 'hospital' && (
           <NavLink to="/hospital" icon={<Stethoscope />} label="Hospital Panel" />
        )}
        
        {currentUser && userRole === 'driver' && (
           <NavLink to="/driver" icon={<Ambulance />} label="Driver Panel" />
        )}

        <div className="divider" style={{ margin: '12px 0', borderBottom: '1px solid var(--panel-border)' }} />
        
        {!currentUser ? (
          <NavLink to="/login" icon={<Shield />} label="Staff Login" />
        ) : (
          <button onClick={logout} className="nav-item" style={{ background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%', padding: '12px 16px' }}>
             <LogOut size={20} color="var(--text-muted)" />
             <span style={{ fontWeight: 500, color: 'var(--text-main)', display: 'block' }}>Sign Out</span>
          </button>
        )}
      </div>
    </nav>
  );
};

const NavLink = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={`nav-item ${isActive ? 'active' : ''}`}
    >
      {React.cloneElement(icon, { size: 20 })}
      <span>{label}</span>
    </Link>
  );
};

export default App;
