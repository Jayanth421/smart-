import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in React Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

export default function MapComponent({ emergencies }) {
  // Center map generally around the active area or a default city center if none exist
  const defaultCenter = [40.7128, -74.0060]; // Example: NYC coordinates
  
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '300px', borderRadius: '0 0 16px 16px', overflow: 'hidden' }}>
      <MapContainer 
        center={defaultCenter} 
        zoom={12} 
        scrollWheelZoom={false}
        style={{ width: '100%', height: '100%', zIndex: 1 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {emergencies && emergencies.map((loc, idx) => {
           // We only render markers if they actually have lat/lng data attached
           if (loc.lat && loc.lng) {
              return (
                <Marker key={loc.id || idx} position={[loc.lat, loc.lng]}>
                  <Popup>
                    <div style={{ minWidth: '150px' }}>
                      <strong style={{ display: 'block', color: 'var(--primary)', marginBottom: '4px' }}>{loc.type} Emergency</strong>
                      <span style={{ fontSize: '0.8rem', color: '#666' }}>{loc.location}</span>
                      <br />
                      <span className={`badge badge-${loc.status}`} style={{ marginTop: '8px', display: 'inline-block' }}>{loc.status}</span>
                    </div>
                  </Popup>
                </Marker>
              );
           }
           return null;
        })}

        {/* Dummy Ambulance Tracking Marker for simulation */}
        <Marker position={[40.7250, -73.9980]} icon={L.icon({
             iconUrl: 'https://cdn-icons-png.flaticon.com/512/1004/1004664.png',
             iconSize: [32, 32],
             iconAnchor: [16, 16]
          })}>
          <Popup>🚑 AMB-492 (En Route)</Popup>
        </Marker>

      </MapContainer>
    </div>
  );
}
