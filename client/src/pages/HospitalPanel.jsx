import React from 'react';
import { BedDouble, Stethoscope, Activity } from 'lucide-react';

export default function HospitalPanel() {
  return (
    <div className="animate-fade-in">
      <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Hospital Command</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Incoming patient alerts and bed management.</p>

      <div className="grid-3" style={{ marginBottom: '40px' }}>
        <div className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ color: 'var(--text-muted)' }}>Emergency ETA &lt; 5m</p>
            <h2 style={{ fontSize: '2rem', color: 'var(--warning)', margin: 0 }}>2</h2>
          </div>
          <Activity size={32} color="var(--warning)" />
        </div>
        
        <div className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ color: 'var(--text-muted)' }}>Available ICU Beds</p>
            <h2 style={{ fontSize: '2rem', color: 'var(--success)', margin: 0 }}>14</h2>
          </div>
          <BedDouble size={32} color="var(--success)" />
        </div>
        
        <div className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ color: 'var(--text-muted)' }}>On-call Doctors</p>
            <h2 style={{ fontSize: '2rem', color: 'var(--secondary)', margin: 0 }}>8</h2>
          </div>
          <Stethoscope size={32} color="var(--secondary)" />
        </div>
      </div>

      <div className="glass-panel">
        <h3>Incoming Ambulances</h3>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', marginTop: '16px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--panel-border)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '12px' }}>Vehicle ID</th>
              <th style={{ padding: '12px' }}>Patient Type</th>
              <th style={{ padding: '12px' }}>Condition</th>
              <th style={{ padding: '12px' }}>ETA</th>
              <th style={{ padding: '12px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <td style={{ padding: '16px 12px' }}>AMB-492</td>
              <td>Accident Trauma</td>
              <td><span className="badge badge-pending" style={{ color: 'var(--primary)', borderColor: 'var(--primary)' }}>Critical</span></td>
              <td style={{ fontWeight: 600, color: 'var(--warning)' }}>4 mins</td>
              <td><button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Prepare ER</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
