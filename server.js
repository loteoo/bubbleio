'use stric';

// ===============
// HTTP server
// ===============
const app = require('./server/Http.js');

















// =================
// Mongo DB
// =================
const {Bubble, Thread, Message, User, ObjectId} = require('./server/Models.js');













// ===============
// Websockets
// ===============


// Dependencies
const io = require('socket.io')(app);


// Returns number of sockets connections currently in the specified room
const getConnectionsInRoom = roomName => {
  let room = [];
  let allSockets = Object.keys(io.sockets.sockets);
  for (let i = 0; i < allSockets.length; i++) {
    let roomsOfSocket = Object.keys(io.sockets.adapter.sids[allSockets[i]]);
    for (let j = 0; j < roomsOfSocket.length; j++) {
      if (roomsOfSocket[j] == roomName) {
        room.push(allSockets[i]);
      }
    }
  }
  return room.length;
}





// Takes in an array of objects and returns a single object
// with each object indexed as a property by their unique names
const getIndexedCollection = collection => {
  let indexedCollection = {};
  for (let i = 0; i < collection.length; i++) {
    collection[i].userCount = getConnectionsInRoom(collection[i]._id);
    indexedCollection[collection[i]._id] = collection[i];
  }
  return indexedCollection;
}




// Takes in an array of objects and returns a single object
// with each object indexed as a property by their unique names
const getIndexedBubbles = bubbles => {
  let indexedBubbles = {};
  for (let i = 0; i < bubbles.length; i++) {
    bubbles[i].userCount = getConnectionsInRoom(bubbles[i].name);
    indexedBubbles[bubbles[i].name] = bubbles[i];
  }
  return indexedBubbles;
}



// Update clients who have that this bubble in their user's bubble list
// (joined in the room or not)
const emitBubbleUserCounts = (bubbleName, socket) => {

  let newState = {
    bubbles: {
      [bubbleName]: {
        userCount: getConnectionsInRoom(bubbleName)
      }
    }
  };

  // Emit to this connection, logged in or not
  socket.emit("update state", newState);

  // Find users who have this bubble in their list AND and logged in, 
  // but not necessarly in the bubble
  User.find({ bubbleNames: bubbleName }, (err, users) => {
    if (err) throw err;

    for (socketId in io.sockets.sockets) {
      users.forEach(user => {
        if (io.sockets.sockets[socketId].userId) {
          if (io.sockets.sockets[socketId].userId.toString() == user._id.toString()) {
            console.log('BUBLE USER COUNT');
            io.sockets.sockets[socketId].emit("update state", newState);
          }
        }
      });
    }
  });
}





// ================================
// Manage events
// ================================


io.on('connection', socket => {



  // Get the default bubbles
  Bubble.find({default: true}, (err, bubbles) => {
    if (err) throw err;

    // Update the client
    socket.emit("update state", {
      bubbles: getIndexedBubbles(bubbles)
    });
  });


  // Handle rooms user counts from user navigation in the app
  socket.on('switch bubble', ({prevBubbleName, nextBubbleName}) => {

    // If user was in an other room before this
    if (prevBubbleName) {

      // Leave connection to the previous room
      socket.leave(prevBubbleName);

      emitBubbleUserCounts(prevBubbleName, socket);
    }



    // Fetch, join and update clients
    Bubble.findOne({name: nextBubbleName, trashed: false}, (err, bubble) => {
      if (err) throw err;
      if (bubble) {
        // TODO: Only load user messages count, not the entire message list
        Thread.find({bubbleId: bubble._id}, (err, threads) => {
          if (err) throw err;

          // Add this bubble to the user's bubble list
          User.findByIdAndUpdate(socket.userId, {$addToSet: {bubbleNames: bubble.name}}, (err, user) => {
            if (err) throw err;

            // Join connection to the new room
            socket.join(bubble.name);

            // Update clients about new user
            emitBubbleUserCounts(bubble.name, socket);            

            // Use this occasion to send threads to the user
            socket.emit("update state", {
              user,
              bubbles: {
                [bubble.name]: bubble
              },
              threads: getIndexedCollection(threads),
              prevBubbleName: bubble.name
            });


          });
        });
      }
    });
  });




  // // Handle user bubble leaving
  // socket.on('remove user bubble', bubble => {

  //   // Remove the bubble from this user's bubble list in the database
  //   User.findByIdAndUpdate(socket.userId, {$pull: {bubbleNames: bubble.name}}, (err, result) => {
  //     if (err) throw err;
  //   });
  // });




  // // Handle user bubble leaving
  // socket.on('archive bubble', bubble => {

  //   // Update DB
  //   Bubble.findByIdAndUpdate(bubble._id, { $set: {
  //     archived: true
  //   }}, { returnOriginal: false }, (err, result) => {
  //     if (err) throw err;

  //     // List of all users who have this bubble in their list
  //     User.find({ bubbleNames: bubble.name }, (err, users) => {
  //       if (err) throw err;


  //       // Remove the bubble from these user's bubble list in the database
  //       users.forEach(user => {
  //         User.findOneAndUpdate({ _id: ObjectId(user._id) }, {
  //           $pull: {
  //             bubbleNames: bubble.name
  //           }
  //         }, { returnOriginal: false }, (err, result) => {
  //           if (err) throw err;
  //         });
  //       });


  //       // Update clients who have that this bubble in their user's bubble list
  //       for (socketId in io.sockets.sockets) {
  //         users.forEach(user => {
  //           if (io.sockets.sockets[socketId].userId) {
  //             if (io.sockets.sockets[socketId].userId.toString() == user._id.toString()) {
  //               io.sockets.sockets[socketId].emit("delete bubble", bubble);
  //             }
  //           }
  //         });
  //       }
  //     });
  //   });
  // });



  // // Feed threads to clients
  // socket.on('get bubble', data => {
  //   Thread.find({bubbleId: bubble._id}, (err, threads) => {
  //     if (err) throw err;


  //       // Send the threads
  //       socket.emit("update state", {
  //         bubbles: [
  //           {
  //             _id: data.bubbleId,
  //             threads
  //           }
  //         ]
  //       });
  //   });
  // });






  // Handle user thread rooms
  socket.on('switch thread', ({prevThreadId, nextThreadId}) => {


    // If user was in an other thread before this
    if (prevThreadId) {

      // Leave connection to the new room
      socket.leave(prevThreadId);

      Thread.findById(prevThreadId, (err, thread) => {
        if (err) throw err;
        if (thread) { // If thread actually exists
          
          console.log('LEAVE THREAD');
          
          // Update clients in the previous thread's bubble
          io.to(thread.bubbleId).emit("update state", {
            threads: {
              [thread._id]: {
                userCount: getConnectionsInRoom(thread._id)
              }
            }
          });
        }
      });
    }


    Thread.findById(nextThreadId, (err, thread) => {
      if (err) throw err;
      if (thread) { // If thread actually exists
        
        Message.find({ threadId: ObjectId(thread._id) }, (err, messages) => {
          if (err) throw err;

          // Join connection to the new room
          socket.join(thread._id);

          // Update clients in the thread's bubble (user counts only)
          socket.broadcast.to(thread.bubbleId).emit("update state", {
            threads: {
              [thread._id]: {
                userCount: getConnectionsInRoom(thread._id)
              }
            }
          });

          // Update user count and messages from the DB for the switching client
          socket.emit("update state", {
            threads: {
              [thread._id]: {
                userCount: getConnectionsInRoom(thread._id)
              }
            },
            messages: getIndexedCollection(messages),
            prevThreadId: thread._id
          });

        });
      }
    });




  });







  // Pass all received thread to all clients
  socket.on('new thread', ({title, score, type, trashed, userId, bubbleId}) => {


    let thread = new Thread({title, score, type, trashed, userId, bubbleId});
    
    // Update DB
    thread.save((err, thread) => {
      if (err) throw err;
          

      // Update clients in the bubble
      socket.broadcast.to(thread.bubbleId).emit('update state', {
        threads: {
          [thread.bubbleId]: thread
        }
      });

    });
  });


  // Archive thread
  socket.on('archive thread', thread => {

    // Just making sure...
    delete thread.upvoted;
    delete thread.relevance;
    delete thread.userCount;

    // Update clients in the bubble
    socket.broadcast.to(thread.bubbleId).emit('delete thread', thread);

    // Update clients in the thread
    socket.broadcast.to(thread._id).emit('delete thread', thread);

    // Update DB
    Thread.findOneAndUpdate({ _id: ObjectId(thread._id) }, { $set: {
      archived: true
    }}, { returnOriginal: false }, (err, result) => {
      if (err) throw err;
    });

  });





  // Pass all received message to all clients
  socket.on('update thread', thread => {


    let tempID = thread._id;

    delete thread._id;
    delete thread.bubbleId;
    delete thread.upvoted;
    delete thread.relevance;
    delete thread.userCount;

    // Update DB
    Thread.findOneAndUpdate({
      _id: ObjectId(tempID)
    }, {
      $set: thread
    }, { returnOriginal: false }, (err, result) => {
      if (err) throw err;

      let newState = {
        bubbles: [
          {
            _id: result.value.bubbleId,
            threads: [
              result.value
            ]
          }
        ]
      };

      // Update clients in the bubble
      socket.broadcast.to(result.value.bubbleId).emit('update state', newState);

      // Update clients in the thread
      socket.broadcast.to(result.value._id).emit('update state', newState);

    });
  });










  // Pass all received message to all clients
  socket.on('new message', ({userId, threadId, text}) => {

    let message = new Message({userId, threadId, text});

    // Save message
    message.save((err, message) => {

      let newState = {
        messages: {
          [message._id]: message
        }
      };
  
      // Update all clients in bubble
      socket.broadcast.to(message.bubbleId).emit('update state', newState);
  
      // Update all clients in the thread
      socket.broadcast.to(message.threadId).emit('update state', newState);
  
      
    });

  
  });









  // Pass all received message to all clients
  socket.on('login', ({username, password, mode}) => {

    console.log('user login');

    User.findOne({username}, (err, user) => {
      if (err) throw err;

      // If this is a new user
      if (!user) {

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
            socket.emit("update state", {
              user,
              bubbles: getIndexedBubbles(bubbles)
            });
          });

        });
      } else {

        // Add the user ID to the socket connection
        socket.userId = user._id;

        // Send him his bubbles
        Bubble.find({name: { $in: user.bubbleNames }, trashed: false}, (err, bubbles) => {
          if (err) throw err;

          // Update user bubbles
          socket.emit("update state", {
            user,
            bubbles: getIndexedBubbles(bubbles)
          });
        });
      }
    });
  });






  // Create bubble
  socket.on('new bubble', newBubble => {

    // Check if bubble name is already taken
    Bubble.findOne({
      name: newBubble.name,
      trashed: false
    }, (err, bubble) => {
      if (err) throw err;
      if (bubble) { // If bubble already exists
        socket.emit("update state", {
          newBubbleForm: {
            error: "nameTaken"
          }
        });
      } else {

        // Update DB
        Bubble.insertOne(newBubble, (err, bubble) => {
          if (err) throw err;

          // Add this bubble to the user's bubble list
          User.findByIdAndUpdate(socket.userId, {
              $addToSet: {
                bubbleNames: bubble.name
              }
          }, { returnOriginal: false }, (err, user) => {
            if (err) throw err;

            // Update user bubbles
            socket.emit("update state", {
              user: user.value,
              bubbles: {
                [bubble.name]: bubble
              },
              newBubbleForm: {}
            });

          });
        });
      }
    });
  });








  // Redirect to random public bubble
  socket.on('random bubble', () => {

    Bubble.count({trashed: false}, (err, total) => {
      if (err) throw err;
      Bubble.find({
        visibility: "public",
        trashed: false
      }).skip(Math.floor(Math.random()*total)).limit(1, (err, bubbles) => {
        if (err) throw err;
        if (bubbles && bubbles[0]) {
          socket.emit("redirect", "/" + bubbles[0].name);
        }
      });
    });
  });






  // Pass all received message to all clients
  socket.on('update user', user => {


    let tempID = user._id;

    delete user._id;

    // Update DB
    User.findOneAndUpdate({
      _id: ObjectId(tempID)
    }, {
      $set: user
    }, { returnOriginal: false }, (err, result) => {
      if (err) throw err;
    });
  });



});





console.log('Server started!');
