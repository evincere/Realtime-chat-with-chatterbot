var socket = io();
var name = prompt('name pls');
while (!name)
	name = prompt('name pls, wag makulit');
	
socket.emit('userConnected', name);
socket.on('userConnects', function(data){
	$('.chats').append($('<li>').text(data));
	$('.chatLog').scrollTop($('.chats').outerHeight());
});
socket.on('userDisconnects', function(data){
	$('.chats').append($('<li>').text(data));
	$('.chatLog').scrollTop($('.chats').outerHeight());
});

$('form').submit(function(){
	$('.send').removeClass('hover');
	var message = $('#chat').val();
	socket.emit('message', {msg: message, name: name});
	$('#chat').val('');
	return false;
});

socket.on('messageFromServer', function(data){
	if (data.msg)
		$('.chats').append($('<li>').text(data.name+': '+data.msg));
		$('.chatLog').scrollTop($('.chats').outerHeight());
});

socket.on('botResponse', function(bot){
	if (bot.response)
		$('.chats').append($('<li>').text('vbot: '+bot.response));
		$('.chatLog').scrollTop($('.chats').outerHeight());
});

$('#chat').keyup(function(){
	if ($('#chat').val()) 
		$('.send').addClass('hover');
		socket.emit('useristyping', name);
});
// socket.on('useristyping', function(data){
	
// });

socket.on('usersOnline', function(user){
	$('.users li').remove();
	for(var userId in user) {
		$('.users').append($('<li>').text(user[userId]));
	}
	$('.chatLog').scrollTop($('.chats').outerHeight());
});