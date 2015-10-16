var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

app.use(express.static(path.join(__dirname + '/public')));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('a user disconnected');
  });
  socket.on('message', function(msg){
    console.log('message: '+msg);
    io.emit('messagefromserver', msg);
  });
});

var port =Number(process.env.PORT || 3000);

http.listen(port, function(){
  console.log('listening on *:'+port);
});