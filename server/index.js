var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var connectedUsers = new Map();
var messages=[]

http.listen(3001, function(){
    console.log('listening on *:3001');
  });

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function getRandomName() {
    var randomName = '';
  
    do {
    randomName ='User'+Math.floor((Math.random() * 10000000) + 1);
    } while(doesnameExist(randomName));
  
    return randomName;
  }
  
  function doesnameExist(newname) {
    
    for (const value of connectedUsers.values()) {
      if (value.name === newname) {
        return true;
      }
    }
    return false;;
  }

io.on('connection', function(socket) {

    console.log(' %s sockets connected', io.engine.clientsCount);
    console.log('List of connected: ',connectedUsers)
    socket.emit('cookie_check');
    socket.on('send message', function(msg) {
        
        var messageRest={
            time: getTime(),
            name: connectedUsers.get(socket.id).name,
            message: msg,
            color: connectedUsers.get(socket.id).color,
            weight:200
        }
        
        console.log("Message:",messageRest);

        messages.push(messageRest)

        var messageSender={
            time: getTime(),
            name: connectedUsers.get(socket.id).name,
            message: msg,
            color: connectedUsers.get(socket.id).color,
            weight: 600
        }
        
        //everyone else
        socket.broadcast.emit('message', messageRest)
        
        //just to sender, ensuring he sees message in bold
        socket.emit('message', messageSender)
       

    });
    socket.on('get chat', () =>{
        io.emit('update chat', messages)
    })
    socket.on('saved user', function(userObject) {

        if (doesnameExist(userObject.name)) {
          userObject.name = getRandomName();
        }
    
        connectedUsers.set(socket.id, userObject);
        socket.emit('color', userObject.color);

        socket.emit('name', userObject.name);

        io.emit('get users', Array.from(connectedUsers.values()));
      });
    socket.on('connects user', function() {
        var randomName = getRandomName();
        var color = getRandomColor();

        connectedUsers.set(socket.id, {'name':randomName, 'color': color});
        // Set new users color, name. Add it to cookie. Then notify existing users of that change.
        socket.emit('color', color);

        socket.emit('name', randomName);

        socket.emit('cookie_set', randomName, color);

        io.emit('get users', Array.from(connectedUsers.values()));
      });
      
    socket.on('disconnect',()=>{
        console.log("User Disconnected");
        
        // connectedUsers.forEach((x,i)=>{
        //     if(x.socket==socket.id){
        //         delete connectedUsers[i]
        //     }
        // })
        connectedUsers.delete(socket.id);
        io.emit('get users', Array.from(connectedUsers.values()));
        
    })

});


function getTime() {
    var date = new Date();
    var hour = date.getHours();
    var minutes = date.getMinutes();
  
    if (hour < 10) {
      hour = '0' + hour;
    }
  
    if (minutes < 10) {
      minutes = '0' + minutes;
    }
  
    var time = hour + ":" + minutes;
    return time;
  }



