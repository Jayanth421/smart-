import React, { useState, useEffect } from 'react';
import { AlertTriangle, Send, MapPin, Loader2, Navigation } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export default function CitizenReport() {
  const [formData, setFormData] = useState({
    type: 'Medical',
    location: '',
    lat: null,
    lng: null,
    description: '',
    contact: ''
  });
  
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);

  const getExactLocation = () => {
    setLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          // Success! Try to reverse geocode perfectly or just keep lat/lng
          const { latitude, longitude } = position.coords;
          
          try {
             // Basic open street map reverse geocoding to pre-fill standard address
             const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
             const data = await res.json();
             setFormData({
                ...formData, 
                location: data.display_name || 'My Current GPS Location',
                lat: latitude,
                lng: longitude
             });
          } catch(e) {
             setFormData({ ...formData, location: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`, lat: latitude, lng: longitude });
          }
          setLocating(false);
        },
        (error) => {
          alert("Location access denied or unavailable. Please type manually.");
          setLocating(false);
        }
      );
    } else {
      alert("Geolocation not supported. Please type manually.");
      setLocating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      await addDoc(collection(db, 'Emergencies'), {
        ...formData,
        status: 'pending',
        time: 'Just now',
        createdAt: serverTimestamp()
      });
      setStatus('success');
      setFormData({ type: 'Medical', location: '', lat: null, lng: null, description: '', contact: '' });
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
    setLoading(false);
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '40px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{ background: 'rgba(255, 42, 84, 0.1)', display: 'inline-flex', padding: '16px', borderRadius: '50%', marginBottom: '16px', boxShadow: '0 8px 16px rgba(255,42,84,0.15)' }}>
          <AlertTriangle color="var(--primary)" size={42} />
        </div>
        <h1 className="gradient-text" style={{ fontSize: '2.5rem' }}>Citizen SOS Tool</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Immediately dispatch emergency responders to your exact location.</p>
      </div>

      <div className="glass-panel" style={{ padding: '32px' }}>
        <form onSubmit={handleSubmit}>
          
          <div className="grid-2" style={{ marginBottom: '24px' }}>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>Emergency Type</label>
              <select 
                value={formData.type} 
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                style={{ height: '52px', fontWeight: '500' }}
              >
                <option value="Medical">🚑 Medical Emergency</option>
                <option value="Fire">🔥 Fire Rescue</option>
                <option value="Police">🚓 Police Assistance</option>
                <option value="Accident">🚗 Severe Road Accident</option>
              </select>
            </div>
            
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>Your Name & Contact No.</label>
              <input 
                type="text" 
                placeholder="Required for Dispatch Callback" 
                value={formData.contact}
                onChange={(e) => setFormData({...formData, contact: e.target.value})}
                style={{ height: '52px' }}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ margin: 0 }}>Precise Location</label>
              <button 
                 type="button" 
                 onClick={getExactLocation} 
                 disabled={locating}
                 style={{ 
                    background: 'var(--secondary)', color: 'white', border: 'none', borderRadius: '6px', 
                    padding: '6px 12px', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
                 }}>
                 {locating ? <Loader2 size={14} className="spinner" /> : <Navigation size={14} />} 
                 {locating ? "Locating..." : "Use My GPS"}
              </button>
            </div>
            <input 
              type="text" 
              placeholder="e.g. 1st Floor, Building 12, Main Street..." 
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              style={{ paddingLeft: '40px' }}
              required 
            />
            <MapPin size={18} color="var(--text-muted)" style={{ position: 'absolute', transform: 'translate(14px, -36px)' }}/>
            {formData.lat && formData.lng && (
              <span style={{ fontSize: '0.75rem', color: 'var(--success)', marginTop: '4px', display: 'block' }}>
                ✓ High Accuracy GPS Coordinates Locked: {formData.lat.toFixed(6)}, {formData.lng.toFixed(6)}
              </span>
            )}
          </div>

          <div className="input-group">
            <label>Emergency Situation Details (Critical Info)</label>
            <textarea 
              rows={4} 
              placeholder="Provide context. E.g. 'Patient unconscious and not breathing', 'Heavy smoke from 2nd floor'..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
            />
          </div>

          <button type="submit" className="btn" disabled={loading} style={{ width: '100%', fontSize: '1.15rem', padding: '16px', marginTop: '16px' }}>
            {loading ? (
               <><Loader2 size={24} className="spinner" /> DISPATCHING UNITS...</>
            ) : (
               <><Send size={24} /> DISPATCH EMERGENCY UNITS IMMEDIATELY</>
            )}
          </button>

          <style jsx>{`
            @keyframes spin { 100% { transform: rotate(360deg); } }
            .spinner { animation: spin 1s linear infinite; }
          `}</style>
          
          {status === 'success' && (
            <div className="animate-fade-in" style={{ marginTop: '24px', padding: '20px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16,185,129,0.3)', color: 'var(--success)', borderRadius: '12px', textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem' }}>✓ Units Dispatched</h3>
              <p style={{ margin: 0, fontSize: '0.95rem' }}>An emergency command center has routed the nearest unit to your coordinates. Stay calm, help is on the way.</p>
            </div>
          )}
          {status === 'error' && (
            <div className="animate-fade-in" style={{ marginTop: '24px', padding: '20px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11,0.3)', color: 'var(--warning)', borderRadius: '12px', textAlign: 'center' }}>
              <p style={{ margin: 0, fontWeight: 600 }}>⚠️ Network Error: Unable to reach command server. Please try again or call 911 directly.</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
