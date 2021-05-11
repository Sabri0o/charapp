$(document).ready(function () {
    /*global io*/ 
    // client has connected to the server 
    let socket = io();
    // clinet listen for user count
    socket.on('user count',data=>{
      console.log(data)
    })
    // Form submittion with new message in field with id 'm'
    $('form').submit(function () {
      var messageToSend = $('#m').val();
      
      $('#m').val('');
      return false; // prevent form submit from refreshing page
    });
  });
  