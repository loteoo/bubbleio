const db = require('../models')

const io = require("socket.io");
const server = io.listen(8888);

server.on("connection", (socket) => {
  
  db.Bubble
    .findAll({
      where: {
        public: 1
      }
    })
    .then(bubbles => socket.emit("receive bubbles", bubbles));





});


