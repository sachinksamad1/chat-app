module.exports = (io) => {
    // Store connected users and typing status
    const connectedUsers = new Map();
    const typingUsers = new Map();
    
    io.on('connection', (socket) => {
      console.log('New client connected:', socket.id);
      
      // Handle user connection
      socket.on('user-connected', (user) => {
        // Store user information
        connectedUsers.set(socket.id, user);
        
        // Notify other users
        socket.broadcast.emit('user-connected', user);
        
        console.log(`User connected: ${user.username} (${socket.id})`);
      });
      
      // Handle message sending
      socket.on('send-message', (message) => {
        // Broadcast message to all other clients
        socket.broadcast.emit('new-message', message);
        
        console.log(`Message from ${message.sender.username}: ${message.content}`);
      });
      
      // Handle typing events
      socket.on('typing', ({ user, isTyping }) => {
        if (isTyping) {
          typingUsers.set(socket.id, user);
        } else {
          typingUsers.delete(socket.id);
        }
        
        // Create array of typing info objects to send to clients
        const typingInfo = Array.from(typingUsers.entries()).map(([_, user]) => ({
          user,
          isTyping: true
        }));
        
        // Broadcast typing status to all clients
        io.emit('typing-users', typingInfo);
      });
      
      // Handle disconnection
      socket.on('disconnect', () => {
        const user = connectedUsers.get(socket.id);
        
        if (user) {
          // Remove user from connected users
          connectedUsers.delete(socket.id);
          
          // Remove user from typing users
          typingUsers.delete(socket.id);
          
          // Broadcast updated typing users
          const typingInfo = Array.from(typingUsers.entries()).map(([_, user]) => ({
            user,
            isTyping: true
          }));
          io.emit('typing-users', typingInfo);
          
          // Notify other users about disconnection
          socket.broadcast.emit('user-disconnected', user);
          
          console.log(`User disconnected: ${user.username} (${socket.id})`);
        } else {
          console.log(`Client disconnected: ${socket.id}`);
        }
      });
    });
  };