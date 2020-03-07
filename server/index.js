const express = require('express');


const app = express();



const server = app.listen(3001, function() {
    console.log('server running on port 3001');
});

var connectedUsers = []
var messages=[]


const io = require('socket.io')(server);

io.on('connection', function(socket) {
    // console.log(socket.id)
    socket.on('SEND_MESSAGE', function(data) {
        console.log("Message:",data);
        messages.push(data)

        io.emit('MESSAGE', messages)
    });
    socket.on('GET_CHAT', () =>{
        io.emit('MESSAGE', messages)
    })
    socket.on('USER_CONNECTED', (data)=> {
        console.log('Connected: ',data.user);
        if(!connectedUsers.includes(data.user)){
            connectedUsers.push(data.user)
        }
        console.log('List of connected: ',connectedUsers)
        io.emit('CONNECTED_USERS',{
            connectedUsers
        });
    });

});