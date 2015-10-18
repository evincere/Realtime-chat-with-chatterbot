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
  
  socket.on('userconnected', function(name){
    users[socket.id] = name;
    io.emit('usersonline', users);
    socket.broadcast.emit('userconnects', name+' joined the chatroom.');
  });
  socket.on('disconnect', function(){
    io.emit('userdisconnects', users[socket.id]+' left the chatroom.');
    delete users[socket.id];
    io.emit('usersonline', users);
   });  
  
  socket.on('message', function(data){
    console.log('message: '+data.msg);
    io.emit('messagefromserver', data);
    console.log(users);
  });
  
  socket.on('useristyping', function(user){
    io.emit('useristyping', user+' is typing...');
  });
  
});

var port = Number(process.env.PORT || 3000);
http.listen(port, function(){
  console.log('listening on *:'+port);
});
