const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const mongo = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const mongo_url = "mongodb://localhost:27017/";
const db_name = "bubbleio";
const port = 80;


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




// Takes in an array of threads and returns a single object
// with each bubble indexed as a property by their id
const getIndexedThreads = threads => {
  let indexedThreads = {};
  for (let i = 0; i < threads.length; i++) {
    threads[i].userCount = getConnectionsInRoom(threads[i]._id);
    indexedThreads[threads[i]._id] = threads[i];
  }
  return indexedThreads;
}





// Takes in an array of bubbles and returns a single object
// with each bubble indexed as a property by their unique names
const getIndexedBubbles = bubbles => {
  let indexedBubbles = {};
  for (let i = 0; i < bubbles.length; i++) {
    bubbles[i].userCount = getConnectionsInRoom(bubbles[i]._id);
    indexedBubbles[bubbles[i].name] = bubbles[i];
  }
  return indexedBubbles;
}



// Update clients who have that this bubble in their user's bubble list
// (joined in the room or not)
const emitBubbleUserCounts = bubbleName => {

  dbo.collection("users").find({ bubble_names: bubbleName }).toArray((err, users) => {
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






app.use(express.static('public'));



// On browser load
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// On browser load
app.get('/:bubbleName', (req, res) => {
  dbo.collection("bubbles").findOne({
    name: req.params.bubbleName,
    archived: { $exists: false }
  }, (err, bubble) => {
    if (err) throw err;
    if (bubble) { // If bubble actually exists
      res.sendFile(__dirname + '/public/index.html');
    } else {
      res.send("Unknown bubble");
    }
  });
});

// On browser load
app.get('/:bubbleName/:threadId', (req, res) => {
  dbo.collection("bubbles").findOne({
    name: req.params.bubbleName,
    archived: { $exists: false }
  }, (err, bubble) => {
    if (err) throw err;
    if (bubble) { // If bubble actually exists
      if (ObjectID.isValid(req.params.threadId)) {
        dbo.collection("threads").findOne({
          _id: ObjectID(req.params.threadId),
          archived: { $exists: false }
        }, (err, thread) => {
          if (err) throw err;
          if (thread) { // If thread actually exists
            res.sendFile(__dirname + '/public/index.html');
          } else {
            res.send("Unknown thread");
          }
        });
      } else {
        res.send("Invalid thread ID");
      }
    } else {
      res.send("Unknown bubble");
    }
  });
});















// ================================
// Manage socket.io events
// ================================


io.on('connection', socket => {


  // Handle rooms user counts from user navigation in the app
  socket.on('switch bubble', navData => {


    // If user was in an other room before this
    if (navData.prevBubbleName) {

      // Leave connection to the previous room
      socket.leave(navData.prevBubbleName);

      emitBubbleUserCounts(navData.prevBubbleName);

    }



    // Fetch, join and update clients
    dbo.collection("bubbles").findOne({
      name: navData.nextBubbleName,
      archived: { $exists: false }
    }, (err, bubble) => {
      if (err) throw err;
      if (bubble) {
        // TODO: Only load user messages count, not the entire message list
        dbo.collection("threads").aggregate([
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
          dbo.collection("users").findOneAndUpdate({ _id: ObjectID(socket.userID) }, {
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
              threads: getIndexedThreads(threads)
            });



          });
        });
      }
    });
  });




  // Handle user bubble leaving
  socket.on('leave bubble', bubble => {

    // Remove the bubble from this user's bubble list in the database
    dbo.collection("users").findOneAndUpdate({ _id: ObjectID(socket.userID) }, {
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
    dbo.collection("bubbles").findOneAndUpdate({ _id: ObjectID(bubble._id) }, { $set: {
      archived: true
    }}, { returnOriginal: false }, (err, result) => {
      if (err) throw err;

      // List of all users who have this bubble in their list
      dbo.collection("users").find({ bubble_names: bubble.name }).toArray((err, users) => {
        if (err) throw err;


        // Remove the bubble from these user's bubble list in the database
        users.forEach(user => {
          dbo.collection("users").findOneAndUpdate({ _id: ObjectID(user._id) }, {
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
    dbo.collection("threads").aggregate([
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
  socket.on('switch thread', navData => {


    // If user was in an other thread before this
    if (navData.prevThread) {

      // Leave connection to the new room
      socket.leave(navData.prevThread._id);

      // Update the thread's user count
      navData.prevThread.userCount = getConnectionsInRoom(navData.prevThread._id);

      // Update clients in the previous thread's bubble
      io.to(navData.prevThread.bubble_id).emit("update state", {
        bubbles: [
          {
            _id: navData.prevThread.bubble_id,
            threads: [
              navData.prevThread
            ]
          }
        ]
      });
    }


    dbo.collection("threads").findOne({
      _id: ObjectID(navData.nextThread._id),
      archived: { $exists: false }
    }, (err, thread) => {
      if (err) throw err;
      if (thread) { // If thread actually exists
        dbo.collection("messages").find({ thread_id: ObjectID(thread._id) }).toArray((err, messages) => {
          if (err) throw err;


          // Join connection to the new room
          socket.join(thread._id);


          // Append user counts to thread
          thread.userCount = getConnectionsInRoom(thread._id);


          // Update clients in the thread's bubble (user counts only)
          socket.broadcast.to(thread.bubble_id).emit("update state", {
            bubbles: [
              {
                _id: thread.bubble_id,
                threads: [
                  thread
                ]
              }
            ]
          });




          // Inject messages to thread
          thread.messages = messages;


          // Update user count and messages from the DB for the switching client
          socket.emit("update state", {
            bubbles: [
              {
                _id: thread.bubble_id,
                threads: [
                  thread
                ]
              }
            ]
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
    dbo.collection("threads").insertOne(thread, (err, result) => {
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
    dbo.collection("threads").findOneAndUpdate({ _id: ObjectID(thread._id) }, { $set: {
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
    dbo.collection("threads").findOneAndUpdate({
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
  socket.on('new message', message => {

    let newState = {
      bubbles: [
        {
          _id: message.bubble_id,
          threads: [
            {
              _id: message.thread_id,
              messages: [
                message
              ]
            }
          ]
        }
      ]
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
    dbo.collection("messages").insertOne(message, (err, result) => {
      if (err) throw err;
    });
  });









  // Pass all received message to all clients
  socket.on('login', user => {
    dbo.collection("users").findOne(user, (err, result) => {
      if (err) throw err;

      // If this is a new user
      if (!result) {

        // Get the default bubbles
        dbo.collection("bubbles").find({default: true}).toArray((err, bubbles) => {
          if (err) throw err;

          // Give the user the default bubbles
          user.bubble_names = [];
          bubbles.forEach(bubble => {
            user.bubble_names.push(bubble.name);
          });

          // Insert in DB
          dbo.collection("users").insertOne(user, (err, result) => {
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
        dbo.collection("bubbles").find({
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
    dbo.collection("bubbles").findOne({
      name: newBubble.name,
      archived: { $exists: false }
    }, (err, bubble) => {
      if (err) throw err;
      if (bubble) { // If bubble already exists
        socket.emit("update state", {
          bubbleForm: {
            error: "nameTaken"
          }
        });
      } else {

        // Update DB
        dbo.collection("bubbles").insertOne(newBubble, (err, result) => {
          if (err) throw err;

          // Update user bubbles
          socket.emit("update state", {
            bubbles: [
              result.ops[0]
            ],
            bubbleForm: {}
          });
        });
      }
    });

  });








  // Redirect to random public bubble
  socket.on('random bubble', () => {

    dbo.collection("bubbles").count({archived: { $exists: false }}, (err, total) => {
      if (err) throw err;
      dbo.collection("bubbles").find({
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
    dbo.collection("users").findOneAndUpdate({
      _id: ObjectID(tempID)
    }, {
      $set: user
    }, { returnOriginal: false }, (err, result) => {
      if (err) throw err;
    });
  });



});





// DB connection
let dbo;


// Create a DB connection and start listening http
mongo.connect(mongo_url, (err, db) => {
  if (err) throw err;
  dbo = db.db(db_name);
  server.listen(port, () => {
   console.log('Server listening on http://localhost:' + port);
  });

  // When the server gets launched with a brand new database,
  // we create the first bubble:
  // Check if bubble "general" exists.
  // If not, create it.
  dbo.collection("bubbles").findOne({name: "general"}, (err, bubble) => {
    if (err) throw err;
    if (!bubble) {
      // Update DB
      dbo.collection("bubbles").insertOne({
        name: "general",
        title: "General",
        desc: "A bubble for everyone!",
        visibility: "public",
        default: true,
        author: "loteoo",
        created: new Date().getTime()
      }, (err, result) => {
        if (err) throw err;
      });
    }
  });
});
