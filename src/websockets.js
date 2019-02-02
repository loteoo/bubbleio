const db = require('../models')

const io = require("socket.io");
const server = io.listen(8888);

server.on("connection", function(socket) {
  console.log("user connected");
  socket.emit("receive bubbles", "welcome man");
  socket.emit("receive bubbles", "welcome man");
  socket.emit("receive bubbles", "welcome man");
  socket.emit("receive bubbles", "welcome man");
});


