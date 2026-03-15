const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const emailService = require('./emailService');
const { db } = require('./mockFirebase');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

// --- Seed Database with Initial Data ---
const seedDatabase = async () => {
  const emergenciesCollection = db.collection('Emergencies');
  const existing = await emergenciesCollection.get();
  if (existing.length === 0) {
    console.log("Seeding Database...");
    await emergenciesCollection.add({ type: "Fire", status: "active", location: "Sector 4 Industrial", description: "Class C electrical fire in warehouse.", time: "2m ago", lat: 40.7306, lng: -73.9352 });
    await emergenciesCollection.add({ type: "Medical", status: "pending", location: "Elm St. Crossing", description: "Multi-vehicle collision, requires 2 ambulances.", time: "5m ago", lat: 40.7128, lng: -74.0060  });
    await emergenciesCollection.add({ type: "Police", status: "resolved", location: "Downtown Mall", description: "Reported theft, suspect apprehended.", time: "1hr ago", lat: 40.7580, lng: -73.9855  });
    await emergenciesCollection.add({ type: "Medical", status: "active", location: "Highway 9", description: "Driver unconscious, ETA 4 mins for ambulance.", time: "7m ago", lat: 40.7831, lng: -73.9712 });
    await emergenciesCollection.add({ type: "Fire", status: "pending", location: "Oak Tree Complex", description: "Smoke detector triggered, waiting for dispatch.", time: "1m ago", lat: 40.7120, lng: -74.0150 });
  }
};
seedDatabase();
// --------------------------------------

// REST API Routes
app.get('/api/status', (req, res) => {
  res.json({ status: 'Server is running', time: new Date() });
});

// Mock Endpoints for Dashboard/Panels
app.post('/api/emergencies', async (req, res) => {
  try {
    const data = req.body;
    const newEmergency = await db.collection('Emergencies').add({
      ...data,
      status: 'pending',
      time: 'Just now',
      createdAt: new Date(),
    });

    const emergencyDoc = { id: newEmergency.id, status: 'pending', time: 'Just now', ...data };

    // Notify all connected clients about the new emergency
    io.emit('new_emergency', emergencyDoc);

    // Send email alert to nearest hospital/admin
    emailService.sendAlertEmail(
      'admin@example.com', 
      'New Emergency Reported', 
      `A new emergency (${data.type}) has been reported at ${data.location}.`
    );

    res.json({ id: newEmergency.id, message: 'Emergency created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/emergencies', async (req, res) => {
  const emergencies = await db.collection('Emergencies').get();
  // Reverse to show newest first
  res.json([...emergencies].reverse());
});

// Socket.IO for Live Tracking & Real-Time Comms
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('update_location', (data) => {
    console.log(`Location update from ${data.vehicleId}: ${data.lat}, ${data.lng}`);
    io.emit('location_updated', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
