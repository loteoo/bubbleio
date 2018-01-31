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

app.get('/', function (req, res) {
  mongo.connect(mongo_url, function(err, db) {
    if (err) throw err;

    // TODO: only load first 6 posts from all bubbles

    var dbo = db.db(db_name);
    dbo.collection("bubbles").find({}).toArray(function(err, bubbles) {
      if (err) throw err;
      db.close();
      res.render(__dirname + '/src/index', { bubblesData: JSON.stringify(bubbles) });
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


            let threadsData = {
              bubbleName: req.params.bubbleName,
              threads: threads
            }
            res.render(__dirname + '/src/index', {
              bubblesData: JSON.stringify(bubbles),
              threadsData: JSON.stringify(threadsData)
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












// ================================
// Manage socket connections
// ================================


var rooms = {}; // Each bubble has a room.
// Rooms help to group revelent sockets together and contain temporary data such as user counts



io.on('connection', function (socket) {





  // Handle rooms user counts
  socket.on('switch room', function (navData) {

    // If user was in an other room before this
    if (navData.prevRoom) {

      // Leaves connection to the previous room
      this.leave(navData.prevRoom);

      // Calculate previous room user count
      if (rooms[navData.prevRoom]) {
        rooms[navData.prevRoom].userCount--;
      } else {
        rooms[navData.prevRoom] = {
          userCount: 0
        }
      }
    }


    // Join connection to the new room
    this.join(navData.nextRoom);

    // Initialize the room if it doesn't exist
    if (typeof rooms[navData.nextRoom] === "undefined") rooms[navData.nextRoom] = {
      userCount: 0
    };

    // Calculate total users in room
    rooms[navData.nextRoom].userCount++;


    // Tell clients about the new user count in the room

    // TODO: send to all users who have this bubble or the previous one IN THEIR LIST
    let newData = {};
    newData[navData.nextRoom] = rooms[navData.nextRoom];
    newData[navData.prevRoom] = rooms[navData.prevRoom];
    socket.broadcast.emit("update bubble user counts", newData);
    io.to(navData.nextRoom).emit("update bubble user counts", newData);
  });





  // Handle thread user counts
  socket.on('join thread', function (threadData) {

    // Initialize the room if it doesn't exist
    if (typeof rooms[threadData.bubbleName] === "undefined") rooms[threadData.bubbleName] = {
      userCount: 0
    };
    // Initialize the thread if it doesn't exist in the room
    if (typeof rooms[threadData.bubbleName][threadData.threadId] === "undefined") rooms[threadData.bubbleName][threadData.threadId] = {
      userCount: 0
    };


    // Calculate user count
    rooms[threadData.bubbleName][threadData.threadId].userCount++;

    // Tell clients about the new user count in the thread
    io.to(threadData.bubbleName).emit("update thread data", {
      bubbleName: threadData.bubbleName,
      threadId: threadData.threadId,
      userCount: rooms[threadData.bubbleName][threadData.threadId].userCount
    });
  });





  // Handle thread user counts
  socket.on('left thread', function (threadData) {

    if (rooms[threadData.bubbleName][threadData.threadId]) { // If room exists

      // Calculate user count
      rooms[threadData.bubbleName][threadData.threadId].userCount--;

      // Tell clients about the new user count in the thread
      io.to(threadData.bubbleName).emit("update thread data", {
        bubbleName: threadData.bubbleName,
        threadId: threadData.threadId,
        userCount: rooms[threadData.bubbleName][threadData.threadId].userCount
      });
    }
  });




  // Pass all received message to all clients
  socket.on('new message', function (message) {

    // TODO: only emit message to clients that have the thread loaded (in bubble view)
    // SEE: https://socket.io/docs/rooms-and-namespaces/
    socket.broadcast.emit('new message', message);
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

        socket.broadcast.emit('update thread data', {
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
