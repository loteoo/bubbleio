const io = require("socket.io");
const sockets = io.listen(8888);

const Sequelize = require('sequelize');
const {User, Bubble, Thread, Message, Bump, UserBubble} = require('../models')



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
  //         if (io.sockets.sockets[socketId].userId.toString() == user.id.toString()) {
  //           console.log('BUBLE USER COUNT');
  //           io.sockets.sockets[socketId].emit('update state', newState);
  //         }
  //       }
  //     });
  //   }
  // });
}









sockets.on('connection', (socket) => {
  
  



  // ==============================================
  // Get the default bubbles on login, for anyone
  // ==============================================

  Bubble.findAll({
    where: {public: 1}
  }).then(bubbles => 
    socket.emit('receive bubbles', bubbles)
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
    Bubble.findOne({
      where: {name: bubbleName},
      attributes: {
        include: [
          [Sequelize.literal('(SELECT COUNT(*) FROM Threads WHERE Threads.bubbleId = Bubble.id)'), 'threadCount'],
          [Sequelize.literal('(SELECT COUNT(*) FROM UserBubbles WHERE UserBubbles.bubbleId = Bubble.id)'), 'userCount']
        ]
      },
      include: [
        User,
        {
          model: Thread,
          include: [User]
        }
      ],
      order: [
        [Thread, 'createdAt', 'DESC']
      ]
    })
    .then(bubble => {
      socket.join(lastBubbleName)
      emitBubbleUserCounts(lastBubbleName, socket)
      reply(bubble)
    })
  })






  // ==============================================
  // Thread navigation
  // ==============================================

  socket.on('load and join thread', (threadId, reply) =>
    Thread.findById(threadId, {
      include: [
        User,
        {
          model: Message,
          include: [User]
        }
      ],
      order: [
        [Message, 'createdAt', 'DESC']
      ]
    })
    .then(reply)
  )

























  // ==============================================
  // Login form
  // ==============================================
  socket.on('pick name', (userName, reply) => {

    console.log(`Pick name: ${userName}`);


    User.findOrCreate({
      where: {name: userName}
    })
    .then(([user, wasCreated]) => {

      // Add the user ID to the socket connection
      socket.userId = user.id;

      reply(user)
    })
    
  });




















  // ==============================================
  // New message
  // ==============================================
  socket.on('new message', (message, reply) => {

    // TODO: figure out user's current thread + userID from socket object
    const threadId = 1;
    const userId = 1;

    Message.create({
      message,
      userId,
      threadId
    })
    .then(message => {
      Thread.findById(threadId)
      .then(thread => {
        Bubble.findById(thread.BubbleId)
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
    //             [message.id]: message
    //           },
    //           threads: {
    //             [thread.id]: {
    //               messageCount: count
    //             }
    //           }
    //         });

    //         // Update all message count in bubble
    //         socket.broadcast.to(bubble.name).emit('update state', {
    //           threads: {
    //             [thread.id]: {
    //               messageCount: count
    //             }
    //           }
    //         });
    //         console.log(`User #${socket.userId} sent a message in thread #${thread.id} (${thread.title}). Message: ${text}`);
    //       });
    //     });
    //   });
    // });


  });









});


