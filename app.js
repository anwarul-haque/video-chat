const { json } = require('body-parser');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const {v4: uuid} = require('uuid');

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.get('/', (req, res) => {
    let roomId = uuid();
    res.redirect(`/${roomId}`);
})
//Room ID local user
app.get('/:room', (req, res) => {
    res.render('room', {roomId: req.params.room});
});


io.on('connection',(socket)=>{
    socket.on('join-room', (roomId, userId)=>{
      
        socket.join(roomId);
        
        socket.broadcast.to(roomId).emit('user-connected', userId);
        
        socket.on('disconnect', () => {
            socket.broadcast.to(roomId).emit('user-disconnected', userId);
        });
    })



})


let port = 3000;

server.listen(port, ()=>{
    console.log(`server running on http://localhost:${port}`);
})
