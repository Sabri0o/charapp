$(document).ready(function () {
  // client has connected to the server
  /*global io*/
  let socket = io();
  // client listen for user count
  socket.on("user", (data) => {
    console.log(data);
    $("#num-users").text(data.currentUsers + "users online");
    let name = data.userName;
    let connected = data.connected
      ? " has joined the chat"
      : " has left the chat";
    let join = name + connected
    $("#messages").append("<li>" + join + "</li>");
  });
  socket.on("chat message", (data) => {
    $("#messages").append(
      "<li>" + data.userName + ": " + data.message + "</li>"
    );
  });
  // Form submittion with new message in field with id 'm'
  $("form").submit(function () {
    var messageToSend = $("#m").val();
    socket.emit("chat message", messageToSend);

    $("#m").val("");
    return false; // prevent form submit from refreshing page
  });
});
