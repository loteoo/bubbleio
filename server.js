'use stric';

const path = require('path');


// ===============
// HTTP server
// ===============
const app = require(path.resolve(__dirname, './server/Http.js'));

















// =================
// Mongo DB
// =================
const {Bubble, Thread, Message, User} = require(path.resolve(__dirname, './server/Models.js'));






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
const emitBubbleUserCounts = bubbleName => {

  User.find({ bubble_names: bubbleName }).toArray((err, users) => {
    if (err) throw err;

    for (socketId in io.sockets.sockets) {
      users.forEach(user => {
        if (io.sockets.sockets[socketId].userID) {
          if (io.sockets.sockets[socketId].userID.toString() == user._id.toString()) {
            io.sockets.sockets[socketId].emit("update state", {
              bubbles: {
                [bubbleName]: {
                  userCount: getConnectionsInRoom(bubbleName)
                }
              }
            });
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

  
  // Handle rooms user counts from user navigation in the app
  socket.on('switch bubble', ({prevBubbleName, nextBubbleName}) => {


    // If user was in an other room before this
    if (prevBubbleName) {

      // Leave connection to the previous room
      socket.leave(prevBubbleName);

      emitBubbleUserCounts(prevBubbleName);

    }



    // Fetch, join and update clients
    Bubble.findOne({
      name: nextBubbleName,
      archived: { $exists: false }
    }, (err, bubble) => {
      if (err) throw err;
      if (bubble) {
        // TODO: Only load user messages count, not the entire message list
        Thread.aggregate([
          {
            $match: {
              bubble_id: ObjectID(bubble._id),
              archived: { $exists: false }
            }
          },
          {
            $lookup: {
              from: 'messages',
              localField: '_id',
              foreignField: 'thread_id',
              as: 'messages'
            }
          },
          {
            $sort: {
              created: -1
            }
          },
          {
            $limit : 20
          }
        ]).toArray((err, threads) => {
          if (err) throw err;

          // Add this bubble to the user's bubble list
          User.findOneAndUpdate({ _id: ObjectID(socket.userID) }, {
              $addToSet: {
                bubble_names: bubble.name
              }
          }, { returnOriginal: false }, (err, result) => {
            if (err) throw err;


            // Join connection to the new room
            socket.join(bubble.name);

            // Update clients about new user
            emitBubbleUserCounts(bubble.name);

            // Use this occasion to send threads to the user
            socket.emit("update state", {
              user: result.value,
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




  // Handle user bubble leaving
  socket.on('leave bubble', bubble => {

    // Remove the bubble from this user's bubble list in the database
    User.findOneAndUpdate({ _id: ObjectID(socket.userID) }, {
        $pull: {
          bubble_names: bubble.name
        }
    }, { returnOriginal: false }, (err, result) => {
      if (err) throw err;
    });
  });




  // Handle user bubble leaving
  socket.on('archive bubble', bubble => {

    // Update DB
    Bubble.findOneAndUpdate({ _id: ObjectID(bubble._id) }, { $set: {
      archived: true
    }}, { returnOriginal: false }, (err, result) => {
      if (err) throw err;

      // List of all users who have this bubble in their list
      User.find({ bubble_names: bubble.name }).toArray((err, users) => {
        if (err) throw err;


        // Remove the bubble from these user's bubble list in the database
        users.forEach(user => {
          User.findOneAndUpdate({ _id: ObjectID(user._id) }, {
            $pull: {
              bubble_names: bubble.name
            }
          }, { returnOriginal: false }, (err, result) => {
            if (err) throw err;
          });
        });


        // Update clients who have that this bubble in their user's bubble list
        for (socketId in io.sockets.sockets) {
          users.forEach(user => {
            if (io.sockets.sockets[socketId].userID) {
              if (io.sockets.sockets[socketId].userID.toString() == user._id.toString()) {
                io.sockets.sockets[socketId].emit("delete bubble", bubble);
              }
            }
          });
        }
      });
    });
  });



  // Feed threads to clients
  socket.on('get bubble', data => {
    Thread.aggregate([
      {
        $match: {
          bubble_id: ObjectID(data.bubble_id),
          archived: { $exists: false }
        }
      },
      {
        $lookup: {
          from: 'messages',
          localField: '_id',
          foreignField: 'thread_id',
          as: 'messages'
        }
      },
      {
        $sort: {
          created: -1
        }
      },
      {
        $skip : data.skip
      },
      {
        $limit : data.limit
      }
    ]).toArray((err, threads) => {
      if (err) throw err;


        // Send the threads
        socket.emit("update state", {
          bubbles: [
            {
              _id: data.bubble_id,
              threads
            }
          ]
        });
    });
  });






  // Handle user thread rooms
  socket.on('switch thread', ({prevThreadId, nextThreadId}) => {


    // If user was in an other thread before this
    if (prevThreadId) {

      // Leave connection to the new room
      socket.leave(prevThreadId);

      
      Thread.findOne({
        _id: ObjectID(prevThreadId),
        archived: { $exists: false }
      }, (err, thread) => {
        if (err) throw err;
        if (thread) { // If thread actually exists
          
          // Update clients in the previous thread's bubble
          io.to(thread.bubble_id).emit("update state", {
            threads: {
              [thread._id]: {
                userCount: getConnectionsInRoom(thread._id)
              }
            }
          });

        }
      });
            
      
      
    }


    Thread.findOne({
      _id: ObjectID(nextThreadId),
      archived: { $exists: false }
    }, (err, thread) => {
      if (err) throw err;
      if (thread) { // If thread actually exists

        
        Message.find({ thread_id: ObjectID(thread._id) }).toArray((err, messages) => {
          if (err) throw err;


          // Join connection to the new room
          socket.join(thread._id);


          // Update clients in the thread's bubble (user counts only)
          socket.broadcast.to(thread.bubble_id).emit("update state", {
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
  socket.on('new thread', thread => {

    // Just making sure...
    delete thread.upvoted;
    delete thread.relevance;
    delete thread.userCount;

    // Update clients in the bubble
    socket.broadcast.to(thread.bubble_id).emit('update state', {
      bubbles: [
        {
          _id: thread.bubble_id,
          threads: [
            thread
          ]
        }
      ]
    });


    // Proper indexes for mongodb
    thread._id = ObjectID(thread._id);
    thread.bubble_id = ObjectID(thread.bubble_id);

    // Update DB
    Thread.insertOne(thread, (err, result) => {
      if (err) throw err;
    });
  });


  // Archive thread
  socket.on('archive thread', thread => {

    // Just making sure...
    delete thread.upvoted;
    delete thread.relevance;
    delete thread.userCount;

    // Update clients in the bubble
    socket.broadcast.to(thread.bubble_id).emit('delete thread', thread);

    // Update clients in the thread
    socket.broadcast.to(thread._id).emit('delete thread', thread);

    // Update DB
    Thread.findOneAndUpdate({ _id: ObjectID(thread._id) }, { $set: {
      archived: true
    }}, { returnOriginal: false }, (err, result) => {
      if (err) throw err;
    });

  });





  // Pass all received message to all clients
  socket.on('update thread', thread => {


    let tempID = thread._id;

    delete thread._id;
    delete thread.bubble_id;
    delete thread.upvoted;
    delete thread.relevance;
    delete thread.userCount;

    // Update DB
    Thread.findOneAndUpdate({
      _id: ObjectID(tempID)
    }, {
      $set: thread
    }, { returnOriginal: false }, (err, result) => {
      if (err) throw err;

      let newState = {
        bubbles: [
          {
            _id: result.value.bubble_id,
            threads: [
              result.value
            ]
          }
        ]
      };

      // Update clients in the bubble
      socket.broadcast.to(result.value.bubble_id).emit('update state', newState);

      // Update clients in the thread
      socket.broadcast.to(result.value._id).emit('update state', newState);

    });
  });










  // Pass all received message to all clients
  socket.on('new message', ({userId, threadId, message}) => {

    let newState = {
      messages: {
        
      }
    };

    // Update all clients in bubble
    socket.broadcast.to(message.bubble_id).emit('update state', newState);

    // Update all clients in the thread
    socket.broadcast.to(message.thread_id).emit('update state', newState);


    // Proper indexes for mongodb
    message._id = ObjectID(message._id);
    message.bubble_id = ObjectID(message.bubble_id);
    message.thread_id = ObjectID(message.thread_id);

    // Update DB
    Message.insertOne(message, (err, result) => {
      if (err) throw err;
    });
  });









  // Pass all received message to all clients
  socket.on('login', user => {
    User.findOne(user, (err, result) => {
      if (err) throw err;

      // If this is a new user
      if (!result) {

        // Get the default bubbles
        Bubble.find({default: true}).toArray((err, bubbles) => {
          if (err) throw err;

          // Give the user the default bubbles
          user.bubble_names = [];
          bubbles.forEach(bubble => {
            user.bubble_names.push(bubble.name);
          });

          // Insert in DB
          User.insertOne(user, (err, result) => {
            if (err) throw err;

            // Link the user ID to the socket connection
            socket.userID = result.ops[0]._id;

            // Update the client
            socket.emit("update state", {
              user: result.ops[0],
              bubbles: getIndexedBubbles(bubbles)
            });
          });
        });
      } else {

        // Add the user ID to the socket connection
        socket.userID = result._id;

        // Send him his bubbles
        Bubble.find({
          name: { $in: result.bubble_names },
          archived: { $exists: false }
        }).toArray((err, bubbles) => {
          if (err) throw err;

          // Update user bubbles
          socket.emit("update state", {
            user: result,
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
      archived: { $exists: false }
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
          User.findOneAndUpdate({ _id: ObjectID(socket.userID) }, {
              $addToSet: {
                bubble_names: bubble.ops[0].name
              }
          }, { returnOriginal: false }, (err, user) => {
            if (err) throw err;

            // Update user bubbles
            socket.emit("update state", {
              user: user.value,
              bubbles: {
                [bubble.ops[0].name]: bubble.ops[0]
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

    Bubble.count({archived: { $exists: false }}, (err, total) => {
      if (err) throw err;
      Bubble.find({
        visibility: "public",
        archived: { $exists: false }
      }).skip(Math.floor(Math.random()*total)).limit(1).toArray((err, bubbles) => {
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
      _id: ObjectID(tempID)
    }, {
      $set: user
    }, { returnOriginal: false }, (err, result) => {
      if (err) throw err;
    });
  });



});





console.log('Server started!');
