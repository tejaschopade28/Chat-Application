const express = require('express');
const socketio= require('socket.io');

const {getUser,addUser,removeUser,getUsersInRoom} = require('./users');

const cors= require('cors');
const http = require('http');
const PORT= process.env.PORT || 8001;
const router= require('./router');

// CORS Configuration
const corsOptions = {
    origin: 'http://localhost:3001', // Replace with your React app's URL
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
};
const app= express();
app.use(cors(corsOptions));


const server= http.createServer(app);

const io = socketio(server, {
    cors: {
        origin: 'http://localhost:3001', // Replace with your React app's URL
        methods: ['GET', 'POST'], // Allow specific methods
    },
});

io.on('connection', (socket)=>{
    // console.log('We Have a new Connection !!!');

    socket.on('join',({ name,room},callback)=>{
        const { error, user} = addUser({id:socket.id, name , room});
        // console.log("error", error);
        if(error) return callback(error);

        socket.join(user.room);
        socket.emit('message', {user:'admin', text: `${user.name}, Welcome to the room ${user.room}`});
        socket.broadcast.to(user.room).emit('message', {user:'admin' , text:`${user.name}, has joined`});
        
        io.to(user.room).emit('roomData',{room: user.room , users: getUsersInRoom(user.room)});
        callback();
       
    });

    socket.on('sendMessage', (message, callback)=>{
        const user= getUser(socket.id);
        if (!user) {
            console.error('User not found for socket ID:', socket.id);
            return callback('User not found');
        }
        io.to(user.room).emit('message',{user: user.name,text:message});
        io.to(user.room).emit('roomData',{room: user.room,users: getUsersInRoom(user.room)});

        callback();
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);

        if(user) {
            io.to(user.room).emit('message',{user:'admin', text:`${user.name} has left.`});
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room),
              });
        }
    });
})

app.use(router);

server.listen(PORT, ()=> console.log(`Server has Started at post ${PORT}`));