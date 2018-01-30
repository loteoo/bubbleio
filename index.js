var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;
var mongo_url = "mongodb://localhost:27017/";
var mongo_db = "bubbleio";
var port = 80;



app.set('view engine', 'ejs');
app.use(express.static('build'));

app.get('/', function (req, res) {
  mongo.connect(mongo_url, function(err, db) {
    if (err) throw err;

    // TODO: only load first 6 posts from all bubbles

    var dbo = db.db(mongo_db);
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

    var dbo = db.db(mongo_db);
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




app.get('/:bubbleName/:threadId', function(req, res) {
   res.redirect('/' + req.params.bubbleName);
});








app.get('/get/:bubbleName', function(req, res) {
  mongo.connect(mongo_url, function(err, db) {
    if (err) throw err;

    // TODO: only load 30 posts from only the requested bubble

    var dbo = db.db(mongo_db);
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












// Manage socket connections
io.on('connection', function (socket) {
  // socket.emit('news', { hello: 'world' });




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
  socket.on('thread upvote', function (threadId) {

    console.log(threadId);


    // socket.broadcast.emit('thread score update', data);
  });




});






server.listen(port, function() {
 console.log('Server listening on http://localhost:' + port);
});
