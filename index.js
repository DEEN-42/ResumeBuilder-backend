import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
dotenv.config();
import { connectToDatabase } from './db.js';
import { socketAuth } from './middleware/socketAuth.js';
import { handleSocketConnection } from './socket/socketHandlers.js';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ['GET','POST','PUT'],
    credentials: true
  }
});

app.use(cors());
import userRoute from './Routes/userRoute.js';
import resumeRoute from './Routes/resumeRoutes.js';
import aiRoutes from './Routes/aiRoutes.js';
const PORT = process.env.PORT;

app.use(cors());

connectToDatabase();

app.use(express.json());
app.use('/users', userRoute); 
app.use('/resumes', resumeRoute);
app.use('/ai', aiRoutes);
// Socket.io middleware for authentication
io.use(socketAuth);

// Handle socket connections
io.on('connection', (socket) => {
  handleSocketConnection(io, socket);
});

// Make io available globally for use in other files
app.set('io', io);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});