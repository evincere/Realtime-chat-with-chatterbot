var socket = io();
var name;
		
$('.name form').submit(function(){
	name = $('#name').val();
	socket.emit('userConnected', name);
	$('.name').css('display', 'none');
});	
		
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
	if (name) {
		socket.emit('message', {msg: message, name: name});
		$('#chat').val('');	
	}
	return false;
});

socket.on('messageFromServer', function(data){
	if (data.msg) {
		$('.chats').append($('<li>').text(data.name+': '+data.msg));
		$('.chatLog').scrollTop($('.chats').outerHeight());
	}
});

var botState;
console.log(botState);
$('.vbot').bootstrapSwitch();
$('.vbot').on('switchChange.bootstrapSwitch', function(event, state){
	socket.emit('botState', state);
	console.log('vBot: '+state);
});
socket.on('updateButton', function(buttonState){
	$('.vbot').bootstrapSwitch('state', buttonState);
});
socket.on('botResponse', function(data){
	console.log(data);
	console.log('vBot: '+data.botState);
	if (data.botState == true && data.botResponse.response != undefined) {
		$('.chats').append($('<li>').text('vBot: '+data.botResponse.response));
		$('.chatLog').scrollTop($('.chats').outerHeight());
	}
});

$('#chat').keyup(function(){		
	if ($('#chat').val()) {
		$('.send').addClass('hover');
		socket.emit('userIsTyping', name);
	}
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