const db = require('../models')
const io = require("socket.io");

const sockets = io.listen(8888);



// Returns number of sockets connections currently in the specified room
const getConnectionsInRoom = roomName => {
  let room = [];
  let allSockets = Object.keys(sockets.sockets.sockets);
  for (let i = 0; i < allSockets.length; i++) {
    let roomsOfSocket = Object.keys(sockets.sockets.adapter.sids[allSockets[i]]);
    for (let j = 0; j < roomsOfSocket.length; j++) {
      if (roomsOfSocket[j] == roomName) {
        room.push(allSockets[i]);
      }
    }
  }
  return room.length;
}




// Update clients who have this bubble in their user's bubble list
// (joined in the room or not)
const emitBubbleUserCounts = (bubbleName, socket) => {

  // Emit to this connection, logged in or not
  socket.emit('update bubble', {
    userCount: getConnectionsInRoom(bubbleName)
  });

  // Find users who have this bubble in their list AND and are logged in, 
  // but not necessarly in the bubble's room
  // User.find({ bubbleNames: bubbleName }, (err, users) => {
  //   if (err) throw err;

  //   for (socketId in io.sockets.sockets) {
  //     users.forEach(user => {
  //       if (io.sockets.sockets[socketId].userId) {
  //         if (io.sockets.sockets[socketId].userId.toString() == user._id.toString()) {
  //           console.log('BUBLE USER COUNT');
  //           io.sockets.sockets[socketId].emit('update state', newState);
  //         }
  //       }
  //     });
  //   }
  // });
}









sockets.on("connection", (socket) => {
  
  



  // ==============================================
  // Get the default bubbles on login, for anyone
  // ==============================================

  db.Bubble.findAll({
    where: {
      public: 1
    }
  }).then(bubbles => 
    socket.emit("receive bubbles", bubbles)
  );





  // ==============================================
  // Bubble navigation
  // ==============================================

  socket.on('load and join bubble', ({lastBubbleName, bubbleName}, reply) => {
    
    if (lastBubbleName) {
      // Leave connection to the previous room
      socket.leave(lastBubbleName);

      emitBubbleUserCounts(lastBubbleName, socket)

      // console.log(`${socket.userId ? 'User #' + socket.userId : 'Anonymous'} left bubble ${lastBubbleName}`);

    }


    socket.join(bubbleName);
    

    // console.log(socket.id);
    db.Bubble.findOne({
      where: {
        name: bubbleName
      }
    })
    .then(bubble => {
      bubble.getThreads()
        .then(threads => {
          
          socket.join(lastBubbleName)

          emitBubbleUserCounts(lastBubbleName, socket)

          reply({bubble, threads})
        })
    })
  })






  // ==============================================
  // Thread navigation
  // ==============================================

  socket.on('load and join thread', (threadId, reply) => {
    db.Thread.findById(threadId)
    .then(thread => {
      thread.getMessages()
        .then(messages => reply({thread, messages}))
    })
  })

























  // ==============================================
  // Login form
  // ==============================================
  socket.on('pick name', ({name}) => {

    console.log(`Pick name: ${name}`);


    db.User.findOne({
      where: {
        name: bubbleName
      }
    })
    .then(user => {

      // If this user exists
      if (user) {

        // Add the user ID to the socket connection
        socket.userId = user.id;

        // // Send him his bubbles
        // db.Bubble.findOne({name: { $in: user.bubbleNames }, trashed: false}, (err, bubbles) => {
        //   if (err) throw err;

        //   // Update user bubbles
        //   socket.emit('update state', {
        //     user,
        //     bubbles: getIndexedBubbles(bubbles)
        //   });
        //   console.log(`User ${username} logged in. (#${user._id})`);
        // });


      } else {

        // Get the default bubbles
        Bubble.find({default: true}, (err, bubbles) => {
          if (err) throw err;

          // Give the user the default bubbles
          let user = new User({
            username,
            password,
            bubbleNames: bubbles.map(bubble => bubble.name)
          });
          
          user.save((err, user) => {
            if (err) throw err;

            // Link the user ID to the socket connection
            socket.userId = user._id;

            // Update the client
            socket.emit('update state', {
              user,
              bubbles: getIndexedBubbles(bubbles)
            });
          });
          console.log(`Created user ${username}. (#${user._id})`);

        });

      }
    })
    
  });




















  // ==============================================
  // New message
  // ==============================================
  socket.on('new message', (message, reply) => {

    // TODO: figure out user's current thread + userID from socket object
    const threadId = 1;
    const userId = 1;

    db.Message.create({
      message,
      userId,
      threadId
    })
    .then(message => {
      db.Thread.findById(threadId)
      .then(thread => {
        db.Bubble.findById(thread.BubbleId)
        .then(bubble => {

          // Update all clients in the thread

          // Update all message count in bubble

          reply({bubble, thread, message})
        })
      })
    })

    // let message = new Message({userId, threadId, text});

    // // Save message
    // message.save((err, message) => {
    //   if (err) throw err;


    //   Thread.findById(message.threadId, (err, thread) => {
    //     if (err) throw err;
    //     Bubble.findById(thread.bubbleId, (err, bubble) => {
    //       if (err) throw err;
    //       Message.countDocuments({threadId: message.threadId}, (err, count) => {
    //         if (err) throw err;
              
    //         // Update all clients in the thread
    //         io.in(message.threadId).emit('update state', {
    //           messages: {
    //             [message._id]: message
    //           },
    //           threads: {
    //             [thread._id]: {
    //               messageCount: count
    //             }
    //           }
    //         });

    //         // Update all message count in bubble
    //         socket.broadcast.to(bubble.name).emit('update state', {
    //           threads: {
    //             [thread._id]: {
    //               messageCount: count
    //             }
    //           }
    //         });
    //         console.log(`User #${socket.userId} sent a message in thread #${thread._id} (${thread.title}). Message: ${text}`);
    //       });
    //     });
    //   });
    // });


  });









});


