var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
// Structure: [{user: 'name', socket: 'sock_id'},{...}]
var connectedUsers = []
var messages=[]


// const io = require('socket.io')(server);

io.on('connection', function(socket) {

    console.log(' %s sockets connected', io.engine.clientsCount);
    console.log('List of connected: ',connectedUsers)
    
   
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
        
        connectedUsers.push({user: data.user, socket: socket.id})
        
        console.log('List of connected (command from client): ',connectedUsers)
        io.emit('CONNECTED_USERS',{
            connectedUsers
        });
    });

    socket.on('disconnect',()=>{
        console.log("User Disconnected");
        
        connectedUsers.forEach((x,i)=>{
            if(x.socket==socket.id){
                delete connectedUsers[i]
            }
        })
        console.log("Remaining: ", connectedUsers);
        io.emit('CONNECTED_USERS',{
            connectedUsers
        });
        
    })

});

http.listen(3001, function(){
    console.log('listening on *:3001');
  });