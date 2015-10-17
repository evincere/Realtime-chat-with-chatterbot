var socket = io();
var name = prompt('name pls');
while (!name)
	name = prompt('name pls, wag makulit');
	
socket.emit('userconnected', name);
$('form').submit(function(){
	var message = $('#chat').val();
	socket.emit('message', {msg: message, name: name});
	$('#chat').val('');
	$('.chatLog').scrollTop($('li:last').height);
	return false;
});

socket.on('messagefromserver', function(data){
	if (data.msg)
		$('.chats').append($('<li>').text(data.name+': '+data.msg));
		$('#chat').val('');
});

$('#chat').keyup(function(){
	if ($('#chat').val()) 
		socket.emit('useristyping', name);
});
socket.on('useristyping', function(data){
});


socket.on('userconnects', function(data){
	$('.chats').append($('<li>').text(data));
});
socket.on('userdisconnects', function(data){
	$('.chats').append($('<li>').text(data));
});

socket.on('usersonline', function(data){
	$('.chats').append($('<li>').text(data.socket.id));
});