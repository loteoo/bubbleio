const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const mongo = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
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
  // TODO: only load 30 messages from only the requested bubble
  dbo.collection("bubbles").findOne({name: req.params.bubbleName}, function(err, bubble) {
    if (err) throw err;
    if (bubble) { // If bubble actually exists
      if (ObjectId.isValid(req.params.threadId)) {
        dbo.collection("threads").findOne({ _id: ObjectId(req.params.threadId) }, function(err, thread) {
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

          // Inject user counts to bubble
          bubble.userCount = getConnectionsInRoom(bubble._id);

          // TODO: Update all clients who have that this bubble in their account's bubble list
          io.emit("update state", { // Emit to everyone for now
            bubbles: [
              bubble
            ]
          });
        }
      });
    }

    // Fet, join and update clients
    dbo.collection("bubbles").findOne({ name: navData.nextBubbleName }, function(err, bubble) {
      if (err) throw err;
      if (bubble) {
        // TODO: Only load user messages count, not the entire message list
        dbo.collection("threads").aggregate([
          {
            $match: { bubble_id: ObjectId(bubble._id) }
          },
          {
            $lookup: {
              from: 'messages',
              localField: '_id',
              foreignField: 'thread_id',
              as: 'messages'
            }
          }
        ]).toArray(function(err, threads) {
          if (err) throw err;

          // Join connection to the new room
          socket.join(bubble._id);

          // Inject user counts to bubble
          bubble.userCount = getConnectionsInRoom(bubble._id);


          // Inject user counts and message counts to threads
          for (var i = 0; i < threads.length; i++) {
            if (threads[i]._id) {
              threads[i].userCount = getConnectionsInRoom(threads[i]._id);
            }
          }


          // TODO: Update all clients who have that this bubble in their account's bubble list
          // This updates the user counts only
          socket.broadcast.emit("update state", { // Emit to everyone for now
            bubbles: [
              bubble
            ]
          });


          // Inject threads to bubble
          bubble.threads = threads;

          // Update user count and new threads from the DB for the switching client
          socket.emit("update state", { // Emit to everyone for now
            bubbles: [
              bubble
            ]
          });
        });
      }
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


    dbo.collection("threads").findOne({ _id: ObjectId(navData.nextThread._id) }, function(err, thread) {
      if (err) throw err;
      if (thread) { // If thread actually exists
        dbo.collection("messages").find({ thread_id: ObjectId(thread._id) }).toArray(function(err, messages) {
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

    // Update clients in the bubble
    socket.broadcast.to(thread.bubble_id).emit('update state', {
      bubbles: [
        {
          _id: thread.bubble_id,
          threads: [
            thread
          ]
        },
      ]
    });


    // Proper indexes for mongodb
    thread._id = ObjectId(thread._id);
    thread.bubble_id = ObjectId(thread.bubble_id);

    // Update DB
    dbo.collection("threads").insert(thread, function(err, result) {
      if (err) throw err;
    });
  });






  // Pass all received message to all clients
  socket.on('thread upvote', function (thread) {

    // Increase score
    thread.score++;

    // No idea why this prop gets here in the first place...
    delete thread.upvoted;

    let newState = {
      bubbles: [
        {
          _id: thread.bubble_id,
          threads: [
            thread
          ]
        },
      ]
    };

    // Update clients in the bubble
    socket.broadcast.to(thread.bubble_id).emit('update state', newState);

    // Update clients in the thread
    socket.broadcast.to(thread.thread_id).emit('update state', newState);


    // Update DB
    dbo.collection("threads").findOneAndUpdate({ '_id': ObjectId(thread._id) }, { $inc: { score: 1 } }, { returnOriginal: false }, function(err, result) {
      if (err) throw err;
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
    message._id = ObjectId(message._id);
    message.bubble_id = ObjectId(message.bubble_id);
    message.thread_id = ObjectId(message.thread_id);

    // Update DB
    dbo.collection("messages").insert(message, function(err, result) {
      if (err) throw err;
    });
  });









  // Pass all received message to all clients
  socket.on('login', function (username) {
    dbo.collection("bubbles").find().toArray(function(err, bubbles) {
      if (err) throw err;

      // Inject user counts to bubbles
      for (var i = 0; i < bubbles.length; i++) {
        if (bubbles[i]._id) {
          bubbles[i].userCount = getConnectionsInRoom(bubbles[i]._id);
        }
      }

      // Update user bubbles
      socket.emit("update state", {
        user: {
          username
        },
        bubbles
      });
    });
  });






  // Create bubble
  socket.on('new bubble', function (bubble) {

    // TODO: check if bubble name is already taken 


    // Update user bubbles
    socket.emit("update state", {
      bubbles: [
        bubble
      ]
    });

    // Proper indexes for mongodb
    bubble._id = ObjectId(bubble._id);

    // Update DB
    dbo.collection("bubbles").insert(bubble, function(err, result) {
      if (err) throw err;
    });
  });








});





// Create a DB connection
mongo.connect(mongo_url, function(err, db) {
  if (err) throw err;
  dbo = db.db(db_name);
  server.listen(port, function() {
   console.log('Server listening on http://localhost:' + port);
  });
});
