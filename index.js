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

      // Inject user counts to bubbles
      for (var i = 0; i < bubbles.length; i++) {
        if (bubbles[i].name) {
          bubbles[i].userCount = getConnectionsInRoom(bubbles[i].name);
        }
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
    dbo.collection("bubbles").find({}).toArray(function(err, bubbles) {
      if (err) throw err;

      for (var i = 0; i < bubbles.length; i++) {
        if (bubbles[i].name == req.params.bubbleName) {

          dbo.collection("threads").find({ bubble_id: objectId(bubbles[i]._id) }).toArray(function(err, threads) {
            if (err) throw err;
            db.close();


            // Inject user counts to threads
            for (var i = 0; i < threads.length; i++) {
              if (threads[i]._id) {
                threads[i].userCount = getConnectionsInRoom(threads[i]._id);
              }
            }



            let threadsData = {
              bubbleName: req.params.bubbleName,
              threads: threads
            }
            res.render(__dirname + '/src/index', {
              bubblesData: JSON.stringify(bubbles).replace(/'/g, "\\'"),
              threadsData: JSON.stringify(threadsData).replace(/'/g, "\\'"),
              joinBubble: req.params.bubbleName
            });
          });

        }
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
          let threadsData = {
            bubbleName: bubble.name,
            threads: threads
          }
          res.send(JSON.stringify(threadsData));
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

    // If user was in an other room before this
    if (navData.prevRoom) {

      // Leaves connection to the previous room
      socket.leave(navData.prevRoom);

    }


    // Join connection to the new room
    socket.join(navData.nextRoom);


    // Tell clients about the new user count in the room

    // TODO: send to all users who have this bubble or the previous one IN THEIR LIST
    let newState = {
      bubbles: [
        {
          _id: navData.nextRoom,
          userCount: getConnectionsInRoom(navData.nextRoom)
        },
        {
          _id: navData.prevRoom,
          userCount: getConnectionsInRoom(navData.prevRoom)
        }
      ]
    };

    socket.broadcast.emit("update bubble user counts", newState);
    io.to(navData.nextRoom).emit("update bubble user counts", newState);
  });



  // TODO: Refresh thread user counts on load in bubble view (like bubble countds on load)


  // Handle thread user counts
  socket.on('join thread', function (threadData) {

    // Join connection to the new room
    socket.join(threadData.threadId);


    // Tell clients about the new user count in the thread
    io.to(threadData.bubbleName).emit("update thread data", {
      bubbleName: threadData.bubbleName,
      threadId: threadData.threadId,
      userCount: getConnectionsInRoom(threadData.threadId)
    });

  });





  // Handle thread user counts
  socket.on('leave thread', function (threadData) {


    // Join connection to the new room
    socket.leave(threadData.threadId);

    // Tell clients about the new user count in the thread
    io.to(threadData.bubbleName).emit("update thread data", {
      bubbleName: threadData.bubbleName,
      threadId: threadData.threadId,
      userCount: getConnectionsInRoom(threadData.threadId)
    });


  });




  // Pass all received message to all clients
  socket.on('new message', function (message) {

    // TODO: only emit message to clients that have the thread loaded (in bubble view)
    // SEE: https://socket.io/docs/rooms-and-namespaces/
    socket.broadcast.to(message.bubbleName).emit('new message', message);
  });




  // Pass all received thread to all clients
  socket.on('new thread', function (threadData) {
    mongo.connect(mongo_url, function(err, db) {
      if (err) throw err;

      console.log(threadData.thread._id);

      var newThread = {
        _id: objectId(threadData.thread._id),
        title: threadData.thread.title,
        score: 0,
        created: new Date().getTime(),
        author: threadData.thread.author,
        type: threadData.thread.type,
        bubble_id: objectId(threadData.bubble._id)
      };

      var dbo = db.db(db_name);
      dbo.collection("threads").insert(newThread, function(err, result) {
        if (err) throw err;



        socket.broadcast.to(threadData.bubble.name).emit('new thread', {
          bubbleName: threadData.bubble.name,
          threads: [
            result["ops"][0]
          ]
        });



        db.close();
      });
    });
  });






  // Pass all received message to all clients
  socket.on('thread upvote', function (upvoteData) {
    mongo.connect(mongo_url, function(err, db) {
      if (err) throw err;

      var dbo = db.db(db_name);


      dbo.collection("threads").findOneAndUpdate({ '_id': objectId(upvoteData.threadId) }, { $inc: { score: 1 } }, { returnOriginal: false }, function(err, result) {
        if (err) throw err;
        db.close();

        socket.broadcast.to(upvoteData.bubbleName).emit('update thread data', {
          bubbleName: upvoteData.bubbleName,
          threadId: upvoteData.threadId,
          score: result.value.score
        });
      });

    });
  });




});






server.listen(port, function() {
 console.log('Server listening on http://localhost:' + port);
});
