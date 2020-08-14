const express = require('express');
const app= express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const {v4: uuidv4 } = require('uuid');
const { ExpressPeerServer } = require('peer');
const cors = require('cors')
app.use(cors())
const peerServer = ExpressPeerServer(server, {
  debug: true
});
let port1 = process.env.PORT || 3030
app.use(express.static('public'));
app.set("view engine","ejs");

app.use('/peerjs', peerServer);
app.get('/', (req,res) => {
    res.status(200).redirect(`/${uuidv4()}`);
});
app.get('/:room', (req,res) => {
    res.status(200).render('room', {roomId: req.params.room});
});
io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        console.log("joined room");
        socket.join(roomId);
        socket.to(roomId).broadcast.emit('user-connected', userId);
        socket.on('message', (message, userId) => {
            io.to(roomId).emit('createMessage', message, userId)
    })
  })
})

server.listen(port1, () => {
    console.log('Server is running on port:', port1);
});