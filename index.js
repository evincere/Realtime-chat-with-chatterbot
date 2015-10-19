var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var request = require('request');
var path = require('path');

//Static files
app.use(express.static(path.join(__dirname + '/public')));
//Serve the html file to the client
app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

var users = {};
io.on('connection', function(socket){
//User joined/left the chatroom broadcast
  socket.on('userConnected', function(name){
    users[socket.id] = name;
    io.emit('usersOnline', users);
    socket.broadcast.emit('userConnects', name+' joined the chat room.');
    console.log(users);
  });
  socket.on('disconnect', function(){
    console.log('eh'+users[socket.id]);
    if (users[socket.id] != undefined) 
        io.emit('userDisconnects', users[socket.id]+' left the chat room.');
    delete users[socket.id];
    io.emit('usersOnline', users);  
   });  

//Broadcast the message sent by the client to all sockets  
  socket.on('message', function(data){
    io.emit('messageFromServer', data);
    console.log(data);

//Simsimi bot api   
    if (botState) {
      var url = 'http://sandbox.api.simsimi.com/request.p?key=e3a3a013-bd49-48af-9feb-ae79913375bf&lc=ph&text='+data.msg;
      request(url, function(error, response, body){
        var botApi = JSON.parse(body);
        io.emit('botResponse', {botResponse: botApi, botState: botState});
      });
    }
  });
//Checks if bot is enabled or not 
   var botState;  
   socket.on('botState', function(state){
      io.emit('updateButton', state)
      botState = state;
   });  
  
  //User is typing functionality  
  socket.on('userIsTyping', function(user){
    io.emit('useristyping', user+' is typing...');
  });
});

//Creates a server
var port = Number(process.env.PORT || 3000);
http.listen(port, function(){
  console.log('Listening on *:'+port);
});
