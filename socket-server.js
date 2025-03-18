// socket-server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create express app
const app = express();
app.use(cors());
app.use(express.json());

// Create HTTP server
const server = http.createServer(app);

// Configure Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*", // In production, restrict this to your frontend domain
    methods: ["GET", "POST"]
  }
});

// Set up file upload storage
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Serve uploaded files
app.use('/uploads', express.static(uploadsDir));

// Store active users
const activeUsers = {};

// Store messages (in memory for demo purposes, use a database in production)
let messages = [];

// API endpoint for file uploads
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  // Return file information
  const fileInfo = {
    filename: req.file.filename,
    originalname: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size,
    url: `/uploads/${req.file.filename}`
  };
  
  res.json(fileInfo);
});

// API endpoint to get message history
app.get('/messages', (req, res) => {
  res.json(messages);
});

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  // Handle user join
  socket.on('user_join', ({ userId, username }) => {
    // Store user information
    activeUsers[socket.id] = { userId, username };
    
    // Broadcast to all clients that a new user has joined
    io.emit('user_joined', {
      userId,
      username,
      users: Object.values(activeUsers)
    });
    
    // Send message history to the new user
    socket.emit('message_history', messages);
  });
  
  // Handle new message
  socket.on('send_message', (messageData) => {
    const user = activeUsers[socket.id];
    
    if (!user) {
      return socket.emit('error', { message: 'You must join before sending messages' });
    }
    
    // Create message object with timestamp
    const message = {
      id: Date.now().toString(),
      userId: user.userId,
      username: user.username,
      text: messageData.text,
      attachment: messageData.attachment,
      timestamp: new Date().toISOString()
    };
    
    // Store the message
    messages.push(message);
    
    // Keep only last 100 messages (for demo purposes)
    if (messages.length > 100) {
      messages = messages.slice(-100);
    }
    
    // Broadcast the message to all clients
    io.emit('new_message', message);
  });
  
  // Handle typing indicator
  socket.on('typing', () => {
    const user = activeUsers[socket.id];
    
    if (user) {
      // Broadcast to all clients except the sender
      socket.broadcast.emit('user_typing', { userId: user.userId, username: user.username });
    }
  });
  
  // Handle stopping typing
  socket.on('stop_typing', () => {
    const user = activeUsers[socket.id];
    
    if (user) {
      socket.broadcast.emit('user_stop_typing', { userId: user.userId });
    }
  });
  
  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    
    const user = activeUsers[socket.id];
    
    if (user) {
      // Remove user from active users
      delete activeUsers[socket.id];
      
      // Broadcast to all clients that a user has left
      io.emit('user_left', {
        userId: user.userId,
        username: user.username,
        users: Object.values(activeUsers)
      });
    }
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});