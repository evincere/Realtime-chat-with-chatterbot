var socket = io();
      
$('.send').click(function(){
      var message = $('#chat').val();
      socket.emit('message', message);
      $('#m').val('');
      return false;
});
socket.on('messagefromserver', function(msg){
      if (msg)
            $('.chats').append($('<li>').text(msg));
            $('#chat').val('');
});