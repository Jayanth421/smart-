import React, { useState, useEffect } from 'react';
import { Activity, Users, MapPin, Search, AlertTriangle, Clock } from 'lucide-react';
import { io } from 'socket.io-client';
import MapComponent from '../components/MapComponent';

export default function Dashboard() {
  const [emergencies, setEmergencies] = useState([
     // Dummy data to showcase the Pinterest layout immediately
     { type: "Fire", status: "active", location: "Sector 4 Industrial", description: "Class C electrical fire in warehouse.", time: "2m ago" },
     { type: "Medical", status: "pending", location: "Elm St. Crossing", description: "Multi-vehicle collision, requires 2 ambulances.", time: "5m ago" },
     { type: "Police", status: "resolved", location: "Downtown Mall", description: "Reported theft, suspect apprehended.", time: "1hr ago" },
     { type: "Medical", status: "active", location: "Highway 9", description: "Driver unconscious, ETA 4 mins for ambulance.", time: "7m ago" },
     { type: "Fire", status: "pending", location: "Oak Tree Complex", description: "Smoke detector triggered, waiting for dispatch.", time: "1m ago" }
  ]);
  const [stats, setStats] = useState({ active: 2, pending: 2, resolved: 1 });

  useEffect(() => {
    // We keep real-time listeners, but the dummy data sits alongside it for the visual demonstration
    fetch('http://localhost:5000/api/emergencies')
      .then(res => res.json())
      .then(data => {
        if(data && data.length > 0) {
           setEmergencies(prev => [...data.reverse(), ...prev]); 
           calculateStats([...data, ...emergencies]);
        }
      })
      .catch(() => {});

    const socket = io('http://localhost:5000');
    socket.on('new_emergency', (data) => {
      setEmergencies(prev => {
        const updated = [{...data, time: "Just now"}, ...prev];
        calculateStats(updated);
        return updated;
      });
    });

    return () => socket.disconnect();
  }, []);

  const calculateStats = (data) => {
    const s = { active: 0, pending: 0, resolved: 0 };
    data.forEach(e => {
      if (s[e.status] !== undefined) s[e.status]++;
    });
    setStats(s);
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Command Center</h1>
          <p style={{ color: 'var(--text-muted)' }}>Real-time overview of all active emergencies.</p>
        </div>
        <button className="btn btn-secondary">
          <Search size={18} /> Search Incident
        </button>
      </div>

      {/* Metric Cards - Also Masonry Item sized for Pinterest Feel */}
      <div className="masonry-grid">
        <div className="masonry-item">
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ background: 'rgba(255,42,84,0.1)', padding: '12px', borderRadius: '12px' }}><Activity color="var(--primary)" size={24}/></div>
                <span className="badge badge-active">Critical</span>
             </div>
             <h3 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 700 }}>{stats.active}</h3>
             <p style={{ margin: 0, color: 'var(--text-muted)' }}>Active Emergencies</p>
          </div>
        </div>

        <div className="masonry-item">
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ background: 'rgba(245,158,11,0.1)', padding: '12px', borderRadius: '12px' }}><Users color="var(--warning)" size={24}/></div>
                <span className="badge badge-pending">Queue</span>
             </div>
             <h3 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 700 }}>{stats.pending}</h3>
             <p style={{ margin: 0, color: 'var(--text-muted)' }}>Pending Dispatches</p>
          </div>
        </div>

        <div className="masonry-item">
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ background: 'rgba(16,185,129,0.1)', padding: '12px', borderRadius: '12px' }}><MapPin color="var(--success)" size={24}/></div>
                <span className="badge badge-resolved">Done</span>
             </div>
             <h3 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 700 }}>{stats.resolved}</h3>
             <p style={{ margin: 0, color: 'var(--text-muted)' }}>Resolved Today</p>
          </div>
        </div>

        {/* Pinterest Style Masonry Cards for Emergencies */}
        {emergencies.map((e, idx) => {
          // Determine color based on status
          let borderColor = 'var(--panel-border)';
          if (e.status === 'active') borderColor = 'rgba(255, 42, 84, 0.4)';
          if (e.status === 'pending') borderColor = 'rgba(245, 158, 11, 0.4)';

          return (
            <div key={idx} className="masonry-item">
              <div className="glass-panel" style={{ border: `1px solid ${borderColor}`, padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <AlertTriangle size={18} color={e.status === 'active' ? 'var(--primary)' : 'var(--warning)'} />
                    <h4 style={{ margin: 0 }}>{e.type}</h4>
                  </div>
                  <span className={`badge badge-${e.status}`}>{e.status}</span>
                </div>
                
                <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', marginBottom: '16px', lineHeight: '1.5' }}>
                  {e.description || "No detailed description provided."}
                </p>

                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={14} /> {e.location}
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                     <Clock size={12} /> {e.time || "Just now"}
                  </span>
                  <button className="btn" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Manage</button>
                </div>
              </div>
            </div>
          )
        })}

        {/* Live Map Representation as a larger masonry component */}
        <div className="masonry-item">
          <div className="glass-panel" style={{ padding: 0, overflow: 'hidden', minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid var(--panel-border)', background: 'rgba(0,0,0,0.2)' }}>
              <h4 style={{ margin: 0, display: 'flex', justifyContent: 'space-between' }}>
                Live Tracking Map 
                <span style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: 'normal' }}>• Live</span>
              </h4>
            </div>
            <div style={{ flex: 1, display: 'flex', background: 'rgba(255,255,255,0.02)' }}>
              <MapComponent emergencies={emergencies} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
