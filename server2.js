const http = require('http');
const express = require('express');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Define Socket.IO event handlers
io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle chat message event
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
        // Broadcast the message to all connected clients
        io.emit('chat message', msg);
    });

    // Handle disconnect event
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});
io.on('error',(e)=>{
  console.log(e);
})

// Serve static files (e.g., HTML, CSS, JS)
app.use(express.static('public'));

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT,'127.0.0.1');
