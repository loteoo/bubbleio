const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const mongo = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const mongo_url = "mongodb://localhost:27017/";
const db_name = "bubbleio";
const port = 80;
let dbo;


app.use(express.static('build'));







const getConnectionsInRoom = (roomName) => {
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






// On browser load
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/build/index.html');
});




// On browser load
app.get('/:bubbleName', function(req, res) {
  dbo.collection("bubbles").findOne({name: req.params.bubbleName}, function(err, bubble) {
    if (err) throw err;
    if (bubble) { // If bubble actually exists
      res.sendFile(__dirname + '/build/index.html');
    } else {
      res.send("Unknown bubble");
    }
  });
});





// On browser load
app.get('/:bubbleName/:threadId', function(req, res) {
  dbo.collection("bubbles").findOne({name: req.params.bubbleName}, function(err, bubble) {
    if (err) throw err;
    if (bubble) { // If bubble actually exists
      if (ObjectID.isValid(req.params.threadId)) {
        dbo.collection("threads").findOne({ _id: ObjectID(req.params.threadId) }, function(err, thread) {
          if (err) throw err;
          if (thread) { // If thread actually exists
            res.sendFile(__dirname + '/build/index.html');
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
// Manage socket connections
// ================================


io.on('connection', function (socket) {


  // Handle rooms user counts from user navigation in the app
  socket.on('switch bubble', function (navData) {


    // If user was in an other room before this
    if (navData.prevBubbleName) {

      // Find ID, leave and update clients
      dbo.collection("bubbles").findOne({ name: navData.prevBubbleName }, function(err, bubble) {
        if (err) throw err;
        if (bubble) {

          // Leave connection to the previous room
          socket.leave(bubble._id);

          // List of all users who have this bubble in their list
          dbo.collection("users").find({ bubble_ids: ObjectID(bubble._id) }).toArray(function(err, users) {
            if (err) throw err;

            // Inject user counts to bubble
            bubble.userCount = getConnectionsInRoom(bubble._id);


            // Update clients who have that this bubble in their user's bubble list
            for (socketId in io.sockets.sockets) {
              users.forEach(user => {
                if (io.sockets.sockets[socketId].userID) {
                  if (io.sockets.sockets[socketId].userID.toString() == user._id.toString()) {
                    io.sockets.sockets[socketId].emit("update state", {
                      bubbles: [
                        bubble
                      ]
                    });
                  }
                }
              });
            }
          });
        }
      });
    }



    // Fetch, join and update clients
    dbo.collection("bubbles").findOne({ name: navData.nextBubbleName }, function(err, bubble) {
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
        ]).toArray(function(err, threads) {
          if (err) throw err;

          // Add this bubble to the user's bubble list
          dbo.collection("users").findOneAndUpdate({ _id: ObjectID(socket.userID) }, {
              $addToSet: {
                bubble_ids: ObjectID(bubble._id)
              }
          }, { returnOriginal: false }, function(err, result) {
            if (err) throw err;


            // Join connection to the new room
            socket.join(bubble._id);


            // List of all users who have this bubble in their list
            dbo.collection("users").find({ bubble_ids: ObjectID(bubble._id) }).toArray(function(err, users) {
              if (err) throw err;


              // Inject user counts to bubble
              bubble.userCount = getConnectionsInRoom(bubble._id);


              // Update clients who have that this bubble in their user's bubble list
              // (User counts only)
              for (socketId in io.sockets.sockets) {
                users.forEach(user => {
                  if (io.sockets.sockets[socketId].userID) {
                    if (io.sockets.sockets[socketId].userID.toString() == user._id.toString()) {
                      io.sockets.sockets[socketId].emit("update state", {
                        bubbles: [
                          bubble
                        ]
                      });
                    }
                  }
                });
              }


              // Use this ocasion to send threads to the user

              // Inject user counts to threads
              for (let i = 0; i < threads.length; i++) {
                if (threads[i]._id) {
                  threads[i].userCount = getConnectionsInRoom(threads[i]._id);
                }
              }

              // Inject threads to bubble
              bubble.threads = threads;

              // Send the threads
              socket.emit("update state", {
                bubbles: [
                  bubble
                ]
              });

            });
          });
        });
      }
    });
  });




  // Handle user thread rooms
  socket.on('leave bubble', function (bubble) {
    dbo.collection("users").findOneAndUpdate({ _id: ObjectID(socket.userID) }, {
        $pull: {
          bubble_ids: ObjectID(bubble._id)
        }
    }, { returnOriginal: false }, function(err, result) {
      if (err) throw err;
    });
  });



  // Feed threads to clients
  socket.on('get bubble', function (data) {
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
    ]).toArray(function(err, threads) {
      if (err) throw err;

        // Inject user counts to threads
        for (let i = 0; i < threads.length; i++) {
          if (threads[i]._id) {
            threads[i].userCount = getConnectionsInRoom(threads[i]._id);
          }
        }

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
  socket.on('switch thread', function (navData) {


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


    dbo.collection("threads").findOne({ _id: ObjectID(navData.nextThread._id) }, function(err, thread) {
      if (err) throw err;
      if (thread) { // If thread actually exists
        dbo.collection("messages").find({ thread_id: ObjectID(thread._id) }).toArray(function(err, messages) {
          if (err) throw err;


          // Join connection to the new room
          socket.join(thread._id);


          // Inject user counts to thread
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
  socket.on('new thread', function (thread) {

    // Just making sure...
    delete thread.upvoted;
    delete thread.relevance;

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
    dbo.collection("threads").insertOne(thread, function(err, result) {
      if (err) throw err;
    });
  });


  // Archive thread
  socket.on('archive thread', function (thread) {

    // Update clients in the bubble
    socket.broadcast.to(thread.bubble_id).emit('delete thread', thread);

    // Update clients in the thread
    socket.broadcast.to(thread.thread_id).emit('delete thread', thread);

    // Update DB
    dbo.collection("threads").findOneAndUpdate({ _id: ObjectID(thread._id) }, { $set: {
      archived: true
    }}, { returnOriginal: false }, function(err, result) {
      if (err) throw err;
    });

  });






  // Pass all received message to all clients
  socket.on('thread upvote', function (thread) {

    // Update DB
    dbo.collection("threads").findOneAndUpdate({ _id: ObjectID(thread._id) }, { $inc: { score: 1 } }, { returnOriginal: false }, function(err, result) {
      if (err) throw err;

      let newState = {
        bubbles: [
          {
            _id: thread.bubble_id,
            threads: [
              result.value
            ]
          }
        ]
      };

      // Update clients in the bubble
      socket.broadcast.to(thread.bubble_id).emit('update state', newState);

      // Update clients in the thread
      socket.broadcast.to(thread.thread_id).emit('update state', newState);

    });
  });










  // Pass all received message to all clients
  socket.on('new message', function (message) {

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
    dbo.collection("messages").insertOne(message, function(err, result) {
      if (err) throw err;
    });
  });









  // Pass all received message to all clients
  socket.on('login', function (user) {
    dbo.collection("users").findOne(user, function(err, result) {
      if (err) throw err;

      // If this is a new user
      if (!result) {

        user.bubble_ids = [];

        // Insert in DB
        dbo.collection("users").insertOne(user, function(err, result) {
          if (err) throw err;

          // Add the user ID to the socket connection
          socket.userID = result.ops[0]._id;

          // Give him the default bubbles
          dbo.collection("bubbles").find({default: true}).toArray(function(err, bubbles) {
            if (err) throw err;

            // Inject user counts to bubbles
            for (let i = 0; i < bubbles.length; i++) {
              if (bubbles[i]._id) {
                bubbles[i].userCount = getConnectionsInRoom(bubbles[i]._id);
              }
            }

            // Update user bubbles
            socket.emit("update state", {
              user: result.ops[0],
              bubbles
            });
          });
        });
      } else {

        // Add the user ID to the socket connection
        socket.userID = result._id;


        // Send him his bubbles
        dbo.collection("bubbles").find({ _id: { $in: result.bubble_ids }}).toArray(function(err, bubbles) {
          if (err) throw err;

          // Inject user counts to bubbles
          for (let i = 0; i < bubbles.length; i++) {
            if (bubbles[i]._id) {
              bubbles[i].userCount = getConnectionsInRoom(bubbles[i]._id);
            }
          }

          // Update user bubbles
          socket.emit("update state", {
            user: result,
            bubbles
          });
        });
      }
    });
  });






  // Create bubble
  socket.on('new bubble', function (newBubble) {

    // Check if bubble name is already taken
    dbo.collection("bubbles").findOne({name: newBubble.name}, function(err, bubble) {
      if (err) throw err;
      if (bubble) { // If bubble already exists
        socket.emit("update state", {
          bubbleForm: {
            error: "nameTaken"
          }
        });
      } else {

        // Update DB
        dbo.collection("bubbles").insertOne(newBubble, function(err, result) {
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
  socket.on('random bubble', function () {

    dbo.collection("bubbles").count({}, function(err, total) {
      if (err) throw err;
      dbo.collection("bubbles").find({}).skip(Math.floor(Math.random()*total)).limit(1).toArray(function(err, bubbles) {
        if (err) throw err;
        socket.emit("redirect", "/" + bubbles[0].name);
      });
    });
  });








});





// Create a DB connection and start listening http
mongo.connect(mongo_url, function(err, db) {
  if (err) throw err;
  dbo = db.db(db_name);
  server.listen(port, function() {
   console.log('Server listening on http://localhost:' + port);
  });



  // When the server gets launched with a brand new data base,
  // we create the first bubble.
  // Check if bubble "general" exists
  dbo.collection("bubbles").findOne({name: "general"}, function(err, bubble) {
    if (err) throw err;
    if (!bubble) {
      // Update DB
      dbo.collection("bubbles").insertOne({
        name: "general",
        title: "General",
        desc: "A bubble for everyone!",
        visibility: "public",
        created: new Date().getTime()
      }, function(err, result) {
        if (err) throw err;
      });
    }
  });
});
