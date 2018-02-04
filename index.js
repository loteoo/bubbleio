var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;
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





app.get('/', function (req, res) {
  mongo.connect(mongo_url, function(err, db) {
    if (err) throw err;


    var dbo = db.db(db_name);
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





app.get('/:bubbleName', function(req, res) {
  mongo.connect(mongo_url, function(err, db) {
    if (err) throw err;

    // TODO: only load first 30 posts from only the requested bubble


    var dbo = db.db(db_name);
    dbo.collection("bubbles").findOne({}, function(err, bubble) {
      if (err) throw err;
      if (bubble.name == req.params.bubbleName) {



        dbo.collection("threads").find({ bubble_id: objectId(bubble._id) }).toArray(function(err, threads) {
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
            joinRoom: bubble._id
          });
        });

      }
    });
  });
});





app.get('/get/:bubbleName', function(req, res) {
  mongo.connect(mongo_url, function(err, db) {
    if (err) throw err;

    // TODO: only load 30 posts from only the requested bubble

    var dbo = db.db(db_name);
    dbo.collection("bubbles").findOne({name: req.params.bubbleName}, function(err, bubble) {
      if (err) throw err;
      if (bubble) {
        dbo.collection("threads").find({ bubble_id: objectId(bubble._id) }).toArray(function(err, threads) {
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
      }
    });
  });
});






app.get('/:bubbleName/:threadId', function(req, res) {
   res.redirect('/' + req.params.bubbleName);
});







// TODO: Use namespaces for bubbles and rooms for chats
// namespaces need to be created every time a bubble is created and... complexityyyyyyy




// ================================
// Manage socket connections
// ================================


io.on('connection', function (socket) {


  // Handle rooms user counts
  socket.on('switch room', function (navData) {


    let newState = {
      bubbles : []
    }


    // If user was in an other room before this
    if (navData.prevRoomId) {

      // Leaves connection to the previous room
      socket.leave(navData.prevRoomId);

      newState.bubbles.push({
          _id: navData.prevRoomId,
          userCount: getConnectionsInRoom(navData.prevRoomId)
      });
    }


    // Join connection to the new room
    socket.join(navData.nextRoomId);

    newState.bubbles.push({
      _id: navData.nextRoomId,
      userCount: getConnectionsInRoom(navData.nextRoomId)
    });


    // Tell clients about the new user count in the room

    // TODO: send to all users who have this bubble or the previous one IN THEIR LIST

    socket.broadcast.emit("update state", newState);
    io.to(navData.nextRoomId).emit("update state", newState);
  });



  // TODO: Refresh thread user counts on load in bubble view (like bubble countds on load)


  // Handle thread user counts
  socket.on('join thread', function (thread) {

    // Join connection to the new room
    socket.join(thread._id);


    let newState = {
      bubbles: [
        {
          _id: thread.bubble_id,
          threads: [
            {
              _id: thread._id,
              userCount: getConnectionsInRoom(thread._id)
            }
          ]
        },
      ]
    };

    // Tell clients about the new user count in the thread
    io.to(thread.bubble_id).emit("update state", newState);

  });





  // Handle thread user counts
  socket.on('leave thread', function (thread) {


    // Join connection to the new room
    socket.leave(thread._id);


    let newState = {
      bubbles: [
        {
          _id: thread.bubble_id,
          threads: [
            {
              _id: thread._id,
              userCount: getConnectionsInRoom(thread._id)
            }
          ]
        },
      ]
    };
    // Tell clients about the new user count in the thread
    io.to(thread.bubble_id).emit("update state", newState);


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
        },
      ]
    };

    socket.broadcast.to(message.bubble_id).emit('update state', newState);
  });




  // Pass all received thread to all clients
  socket.on('new thread', function (thread) {
    mongo.connect(mongo_url, function(err, db) {
      if (err) throw err;

      var newThread = {
        _id: objectId(thread._id),
        title: thread.title,
        score: 0,
        created: new Date().getTime(),
        author: thread.author,
        type: thread.type,
        bubble_id: objectId(thread.bubble_id)
      };



      let newState = {
        bubbles: [
          {
            _id: thread.bubble_id,
            threads: [
              newThread
            ]
          },
        ]
      };

      socket.broadcast.to(thread.bubble_id).emit('update state', newState);

      var dbo = db.db(db_name);
      dbo.collection("threads").insert(newThread, function(err, result) {
        if (err) throw err;
        db.close();
      });
    });
  });






  // Pass all received message to all clients
  socket.on('thread upvote', function (thread) {
    mongo.connect(mongo_url, function(err, db) {
      if (err) throw err;

      var dbo = db.db(db_name);


      dbo.collection("threads").findOneAndUpdate({ '_id': objectId(thread._id) }, { $inc: { score: 1 } }, { returnOriginal: false }, function(err, result) {
        if (err) throw err;
        db.close();


        let newState = {
          bubbles: [
            {
              _id: thread.bubble_id,
              threads: [
                {
                  _id: thread._id,
                  score: result.value.score
                }
              ]
            },
          ]
        };

        socket.broadcast.to(thread.bubble_id).emit('update state', newState);
      });

    });
  });




});






server.listen(port, function() {
 console.log('Server listening on http://localhost:' + port);
});
