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
    dbo.collection("bubbles").aggregate([
      {
        $lookup: {
          from: 'threads',
          localField: '_id',
          foreignField: 'bubble_id',
          as: 'threads'
        }
      }
    ]).toArray(function(err, result) {
      if (err) throw err;
      db.close();
      res.render(__dirname + '/src/index', { userBubbles: JSON.stringify(result) });
    });
  });
});





app.get('/:bubbleName', function(req, res) {
  mongo.connect(mongo_url, function(err, db) {
    if (err) throw err;

    // TODO: only load first 30 posts from only the requested bubble

    var dbo = db.db(db_name);
    dbo.collection("bubbles").aggregate([
      {
        $lookup: {
          from: 'threads',
          localField: '_id',
          foreignField: 'bubble_id',
          as: 'threads'
        }
      }
    ]).toArray(function(err, result) {
      if (err) throw err;
      db.close();
      res.render(__dirname + '/src/index', { userBubbles: JSON.stringify(result) });
    });
  });
});





app.get('/get/:bubbleName', function(req, res) {
  mongo.connect(mongo_url, function(err, db) {
    if (err) throw err;

    // TODO: only load 30 posts from only the requested bubble

    var dbo = db.db(db_name);
    dbo.collection("bubbles").aggregate([
      {
        $lookup: {
          from: 'threads',
          localField: '_id',
          foreignField: 'bubble_id',
          as: 'threads'
        }
      }
    ]).toArray(function(err, result) {
      if (err) throw err;
      db.close();
      res.send(JSON.stringify(result));
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

    console.log(message);

    // TODO: only emit message to clients that have the thread loaded (in bubble view)
    // SEE: https://socket.io/docs/rooms-and-namespaces/
    socket.broadcast.emit('new message', message);
  });




  // Pass all received thread to all clients
  socket.on('new thread', function (thread) {



    console.log(thread);

    // TODO: only emit thread to clients that have the bubble opened and visible
    socket.broadcast.emit('new thread', thread);
  });






  // Pass all received message to all clients
  socket.on('thread upvote', function (upvoteData) {
    mongo.connect(mongo_url, function(err, db) {
      if (err) throw err;

      var dbo = db.db(db_name);


      dbo.collection("threads").findOneAndUpdate({ '_id': objectId(upvoteData.threadId) }, { $inc: { score: 1 } }, { returnOriginal: false }, function(err, result) {
        if (err) throw err;
        db.close();
        console.log(result.value);
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
