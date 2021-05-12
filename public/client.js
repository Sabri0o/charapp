$(document).ready(function () {
  /*global io*/
  // client has connected to the server
  let socket = io();
  // clinet listen for user count
  socket.on("user count", (data) => {
    console.log(data);
    $("#num-users").text(data.currentUsers + "users online");
    let message =
      data.name + data.connected
        ? " has joined the chat"
        : " has left the chat";
    $("#messages").append("<li>" + message + "</li>");
  });
  // Form submittion with new message in field with id 'm'
  $("form").submit(function () {
    var messageToSend = $("#m").val();

    $("#m").val("");
    return false; // prevent form submit from refreshing page
  });
});
