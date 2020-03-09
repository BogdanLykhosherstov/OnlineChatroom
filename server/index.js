var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
// Structure: [{user: 'name', socket: 'sock_id'},{...}]
var users = new Map();
var messages=[]

http.listen(3001, function(){
    console.log('listening on *:3001');
  });
// const io = require('socket.io')(server);

io.on('connection', function(socket) {

    console.log(' %s sockets connected', io.engine.clientsCount);
    console.log('List of connected: ',users)
    socket.emit('check cookie');
   

    // console.log(socket.id)
    socket.on('send message', function(msg) {
        
        var messageRest={
            time: buildTime(),
            name: users.get(socket.id).name,
            message: msg,
            color: users.get(socket.id).color,
            weight:200
        }
        
        console.log("Message:",messageRest);
        messages.push(messageRest)

        var messageSender={
            time: buildTime(),
            name: users.get(socket.id).name,
            message: msg,
            color: users.get(socket.id).color,
            weight: 600
        }
        //everyone else
        socket.broadcast.emit('message', messageRest)
        //just to sender
        socket.emit('message', messageSender)
       

    });
    socket.on('get chat', () =>{
        io.emit('update chat', messages)
    })
    socket.on('new user', function() {
        var randomName = getRandomName();
        var color = getRandomColor();
        users.set(socket.id, {'name':randomName, 'color': color});
        socket.emit('name', randomName);
        socket.emit('color', color);
        socket.emit('set cookie', randomName, color);
        io.emit('updateUsers', Array.from(users.values()));
      });
      socket.on('set existing user', function(userObject) {

        // check if username from cookie is already taken by another client. If so, generate a new random name otherwise set the name.
        if (doesnameExist(userObject.name)) {
          userObject.name = getRandomName();
        }
    
        users.set(socket.id, userObject);
        socket.emit('name', userObject.name);
        socket.emit('color', userObject.color);
        io.emit('updateUsers', Array.from(users.values()));
      });
    socket.on('disconnect',()=>{
        console.log("User Disconnected");
        
        // connectedUsers.forEach((x,i)=>{
        //     if(x.socket==socket.id){
        //         delete connectedUsers[i]
        //     }
        // })
        users.delete(socket.id);
        io.emit('updateUsers', Array.from(users.values()));
        
    })

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

// will build time with format hh:mm
function buildTime() {
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

// Checks if name already exists by iterating through user map
function doesnameExist(newname) {

  var nameExists = false;

  for (const v of users.values()) {
    if (v.name === newname) {
      nameExists = true;
      break;
    }
  }

  return nameExists;
}