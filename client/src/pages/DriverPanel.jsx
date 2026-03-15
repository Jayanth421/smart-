import React, { useState } from 'react';
import { Navigation2, MapPin, CheckCircle } from 'lucide-react';

export default function DriverPanel() {
  const [activeJob, setActiveJob] = useState(null);

  return (
    <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 className="gradient-text">Driver Terminal</h1>
        <p style={{ color: 'var(--text-muted)' }}>Ambulance Unit: AMB-492 (Available)</p>
      </div>

      {!activeJob ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
          <div style={{ background: 'rgba(255, 42, 84, 0.1)', padding: '24px', borderRadius: '50%' }}>
            <MapPin size={48} color="var(--primary)" />
          </div>
          <h3>Awaiting Dispatch</h3>
          <p style={{ color: 'var(--text-muted)' }}>You will receive an alert here when an emergency matches your location radius.</p>
          <button className="btn btn-secondary" onClick={() => setActiveJob(true)}>Simulate Incoming Alert</button>
        </div>
      ) : (
        <div className="glass-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--panel-border)', paddingBottom: '20px', marginBottom: '20px' }}>
            <div>
              <span className="badge badge-active" style={{ marginBottom: '8px', display: 'inline-block' }}>Code 3 Dispatch</span>
              <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Medical Emergency</h2>
            </div>
            <h1 style={{ color: 'var(--primary)', margin: 0 }}>4.2 mi</h1>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Pickup Location</p>
              <h4 style={{ margin: '4px 0 0 0' }}>1244 Downtown Ave, Near Metro Station</h4>
            </div>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Patient Info</p>
              <h4 style={{ margin: '4px 0 0 0' }}>Male, 45, Suspected Cardiac Arrest</h4>
            </div>
          </div>

          <div className="grid-2">
            <button className="btn" style={{ background: 'var(--success)', padding: '16px' }} onClick={() => setActiveJob(false)}>
              <CheckCircle size={20} /> Accept & Start Route
            </button>
            <button className="btn btn-secondary" style={{ padding: '16px', color: 'var(--text-muted)' }} onClick={() => setActiveJob(false)}>
              Reject
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
