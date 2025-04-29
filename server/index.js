const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const socketHandler = require('./socket-handler');

// Create Express app
const app = express();
app.use(cors());

// Create HTTP server
const server = http.createServer(app);

// Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: '*', // In production, restrict this to your app's domain
    methods: ['GET', 'POST']
  }
});

// Initialize socket handler
socketHandler(io);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Chat server is running');
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});