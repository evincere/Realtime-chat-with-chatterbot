var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

app.use(express.static(path.join(__dirname + '/public')));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

var user;
io.on('connection', function(socket){
  socket.on('userconnected', function(name){
    io.emit('userconnects', name+' joined the chatroom.');
    user = name;
  });
  socket.on('disconnect', function(){
    io.emit('userdisconnects', user+' left the chatroom.');
  });
  
  socket.on('message', function(data){
    console.log('message: '+data.msg);
    io.emit('messagefromserver', data);
  });
  
  socket.on('useristyping', function(user){
    io.emit('useristyping', user+' is typing...');
  });
  
});


var port = Number(process.env.PORT || 3000);
http.listen(port, function(){
  console.log('listening on *:'+port);
});