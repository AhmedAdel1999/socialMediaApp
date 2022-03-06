require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const usersRoutes = require('./routes/api/users');
const authRoutes = require('./routes/api/auth');
const profileRoutes = require('./routes/api/profile');
const postRoutes = require('./routes/api/posts');
const convoRoutes = require('./routes/api/conversation');
const messageRoutes = require('./routes/api/message');

// App Initialized
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: true,
    origins: ['http://localhost:3000'],
});

let connectedUsers = {};

// Socket Server
io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('join', (userId) => {
        connectedUsers[userId] = socket.id;
    });

    socket.on('message', ({ userId, senderId, body }) => {
        io.to(connectedUsers[userId]).emit('message', {
            senderId,
            body,
        });
    });

    /*socket.on('disconnect', () => {
        console.log('user disconnected');
    });*/
});

// Connect Database


// Init Middleware
app.use(express.json({ limit: '30mb', extended: false }));
app.use(express.urlencoded({ limit: '30mb', extended: false }));
app.use(cors());
app.use(express.static("public"));

// Routes
app.get('/', (req, res) => {
    res.send('API Running');
});
app.use('/api/users', usersRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/conversation', convoRoutes);
app.use('/api/message', messageRoutes);

mongoose.connect(process.env.MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
}, err =>{
    if(err) throw err;
    console.log('Connected to MongoDB')
})

//  Port
const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
    console.log(`Console Up and Running at Port ${PORT}`);
});
