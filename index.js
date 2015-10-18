var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var request = require('request');
var path = require('path');

app.use(express.static(path.join(__dirname + '/public')));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

var users = {};
io.on('connection', function(socket){
  
  socket.on('userConnected', function(name){
    users[socket.id] = name;
    io.emit('usersOnline', users);
    socket.broadcast.emit('userConnects', name+' joined the chatroom.');
  });
  socket.on('disconnect', function(){
    io.emit('userDisconnects', users[socket.id]+' left the chatroom.');
    delete users[socket.id];
    io.emit('usersOnline', users);
   });  
  
  socket.on('message', function(data){
    io.emit('messageFromServer', data);
    console.log(data);
    
    var url = 'http://sandbox.api.simsimi.com/request.p?key=e3a3a013-bd49-48af-9feb-ae79913375bf&lc=ph&text='+data.msg;
    request(url, function(error, response, body){
      var botApi = JSON.parse(body);
      io.emit('botResponse', botApi);
    });
  });
  
  
  socket.on('userIsTyping', function(user){
    io.emit('useristyping', user+' is typing...');
  });
  
});

var port = Number(process.env.PORT || 3000);
http.listen(port, function(){
  console.log('Listening on *:'+port);
});
