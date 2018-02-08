var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var mongo = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var mongo_url = "mongodb://localhost:27017/";
var db_name = "bubbleio";
var port = 80;




app.set('view engine', 'ejs');
app.use(express.static('build'));







const getConnectionsInRoom = (roomName) => {
  let room = [];
  let allSockets = Object.keys(io.sockets.sockets);
  for (var i = 0; i < allSockets.length; i++) {
    let roomsOfSocket = Object.keys(io.sockets.adapter.sids[allSockets[i]]);
    for (var j = 0; j < roomsOfSocket.length; j++) {
      if (roomsOfSocket[j] == roomName) {
        room.push(allSockets[i]);
      }
    }
  }
  return room.length;
}





// Acts as a micro API for threads
// For ajax requests such as "load more"
app.get('/get/:bubbleName', function(req, res) {
  mongo.connect(mongo_url, function(err, db) {
    if (err) throw err;

    // TODO: only load 30 posts from only the requested bubble

    let dbo = db.db(db_name);
    dbo.collection("bubbles").findOne({name: req.params.bubbleName}, function(err, bubble) {
      if (err) throw err;
      if (bubble) { // If bubble actually exists
        dbo.collection("threads").find({ bubble_id: ObjectId(bubble._id) }).toArray(function(err, threads) {
          if (err) throw err;
          db.close();


          // Inject user counts to threads
          for (thread in threads) {
            thread.userCount = getConnectionsInRoom(thread._id);
          }

          bubble.threads = threads;

          let newState = {
            bubbles: [
              bubble
            ]
          };
          res.send(JSON.stringify(newState));
        });
      } else {
        res.send("Unknown bubble");
      }
    });
  });
});







// Acts as a micro API for messages
// For ajax requests such as "load more"
app.get('/get/:bubbleName/:threadId', function(req, res) {
  mongo.connect(mongo_url, function(err, db) {
    if (err) throw err;

    // TODO: only load 30 messages from only the requested bubble

    let dbo = db.db(db_name);
    dbo.collection("threads").findOne({_id: ObjectId(req.params.threadId)}, function(err, thread) {
      if (err) throw err;
      if (thread) { // If thread actually exists
        dbo.collection("messages").find({ thread_id: ObjectId(thread._id) }).toArray(function(err, messages) {
          if (err) throw err;
          db.close();


          thread.messages = messages;

          let newState = {
            bubbles: [
              {
                _id: thread.bubble_id,
                threads: [
                  thread
                ]
              }
            ]
          };
          res.send(JSON.stringify(newState));
        });
      } else {
        res.send("Unknown thread");
      }
    });
  });
});





// On browser load
app.get('/', function (req, res) {
  mongo.connect(mongo_url, function(err, db) {
    if (err) throw err;


    let dbo = db.db(db_name);
    dbo.collection("bubbles").find({}).toArray(function(err, bubbles) {
      if (err) throw err;
      db.close();

      // Inject user counts to threads
      for (bubble in bubbles) {
        bubble.userCount = getConnectionsInRoom(bubble._id);
      }

      res.render(__dirname + '/src/index', { state: JSON.stringify({ bubbles: bubbles }).replace(/'/g, "\\'") });
    });
  });
});




// On browser load
app.get('/:bubbleName', function(req, res) {
  mongo.connect(mongo_url, function(err, db) {
    if (err) throw err;

    // TODO: only load first 30 posts from only the requested bubble


    let dbo = db.db(db_name);
    dbo.collection("bubbles").findOne({name: req.params.bubbleName}, function(err, bubble) {
      if (err) throw err;
      if (bubble) { // If bubble actually exists
        dbo.collection("threads").find({ bubble_id: ObjectId(bubble._id) }).toArray(function(err, threads) {
          if (err) throw err;
          db.close();


          // Inject user counts to threads
          for (thread in threads) {
            thread.userCount = getConnectionsInRoom(thread._id);
          }


          bubble.threads = threads;

          let newState = {
            bubbles: [
              bubble
            ]
          };



          res.render(__dirname + '/src/index', {
            state: JSON.stringify(newState).replace(/'/g, "\\'"),
            joinBubble: bubble._id
          });
        });
      } else {
        res.send("Unknown bubble");
      }
    });
  });
});





// On browser load
app.get('/:bubbleName/:threadId', function(req, res) {
  mongo.connect(mongo_url, function(err, db) {
    if (err) throw err;

    // TODO: only load 30 messages from only the requested bubble

    let dbo = db.db(db_name);
    dbo.collection("bubbles").findOne({name: req.params.bubbleName}, function(err, bubble) {
      if (err) throw err;

      if (bubble) { // If bubble actually exists
        if (ObjectId.isValid(req.params.threadId)) {
          dbo.collection("threads").findOne({ _id: ObjectId(req.params.threadId) }, function(err, thread) {
            if (err) throw err;
            if (thread) { // If thread actually exists
              dbo.collection("messages").find({ thread_id: ObjectId(thread._id) }).toArray(function(err, messages) {
                if (err) throw err;
                db.close();

                // Append messages to thread
                thread.messages = messages;

                // Append thread to bubble
                bubble.threads = [
                  thread
                ];

                // Append bubble to state
                let newState = {
                  bubbles: [
                    bubble
                  ]
                };

                res.render(__dirname + '/src/index', {
                  state: JSON.stringify(newState).replace(/'/g, "\\'"),
                  joinBubble: thread.bubble_id,
                  joinThread: JSON.stringify(thread).replace(/'/g, "\\'")
                });
              });
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
});















// ================================
// Manage socket connections
// ================================


io.on('connection', function (socket) {


  // Handle rooms user counts from user navigation in the app
  socket.on('switch room', function (navData) {

    // Temporary state object to send to the clients
    let newState = {
      bubbles : []
    }


    // If user was in an other room before this
    if (navData.prevRoomId) {

      // Leave connection to the previous room
      socket.leave(navData.prevRoomId);

      // Add the new bubble count to the next state update
      newState.bubbles.push({
          _id: navData.prevRoomId,
          userCount: getConnectionsInRoom(navData.prevRoomId)
      });
    }


    // Join connection to the new room
    socket.join(navData.nextRoomId);

    // Add the new bubble count to the next state update
    newState.bubbles.push({
      _id: navData.nextRoomId,
      userCount: getConnectionsInRoom(navData.nextRoomId)
    });



    // Update all clients // TODO: change this to all clients who have the bubble in their list
    io.emit("update state", newState);
  });




  // Handle thread user counts
  socket.on('join thread', function (thread) {

    // Join connection to the new room
    socket.join(thread._id);

    // Update the thread's user count
    thread.userCount = getConnectionsInRoom(thread._id);

    // Update clients in the bubble
    io.to(thread.bubble_id).emit("update state", {
      bubbles: [
        {
          _id: thread.bubble_id,
          threads: [
            thread
          ]
        },
      ]
    });

  });





  // Handle thread user counts
  socket.on('leave thread', function (thread) {


    // Leave connection to the new room
    socket.leave(thread._id);

    // Update the thread's user count
    thread.userCount = getConnectionsInRoom(thread._id);

    // Update clients in the bubble
    io.to(thread.bubble_id).emit("update state", {
      bubbles: [
        {
          _id: thread.bubble_id,
          threads: [
            thread
          ]
        },
      ]
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
    mongo.connect(mongo_url, function(err, db) {
      if (err) throw err;
      let dbo = db.db(db_name);
      dbo.collection("threads").insert(thread, function(err, result) {
        if (err) throw err;
        db.close();
      });
    });
  });






  // Pass all received message to all clients
  socket.on('thread upvote', function (thread) {

    // Increase score
    thread.score++;


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


    // Update DB
    mongo.connect(mongo_url, function(err, db) {
      if (err) throw err;
      let dbo = db.db(db_name);
      dbo.collection("threads").findOneAndUpdate({ '_id': ObjectId(thread._id) }, { $inc: { score: 1 } }, { returnOriginal: false }, function(err, result) {
        if (err) throw err;
        db.close();
      });
    });
  });










  // Pass all received message to all clients
  socket.on('new message', function (message) {

    // Update all clients in bubble
    socket.broadcast.to(message.bubble_id).emit('update state', {
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
    });


    // Proper indexes for mongodb
    message._id = ObjectId(message._id);
    message.bubble_id = ObjectId(message.bubble_id);
    message.thread_id = ObjectId(message.thread_id);

    // Update DB
    mongo.connect(mongo_url, function(err, db) {
      if (err) throw err;
      let dbo = db.db(db_name);
      dbo.collection("messages").insert(message, function(err, result) {
        if (err) throw err;
        db.close();
      });
    });
  });




});






server.listen(port, function() {
 console.log('Server listening on http://localhost:' + port);
});
