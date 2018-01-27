var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;
var mongo_url = "mongodb://localhost:27017/bubbleio";
var port = 80;



app.use(express.static('public'))
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/public/index.html');
});

io.on('connection', function (socket) {
  // socket.emit('news', { hello: 'world' });




  // Pass all received message to all clients
  socket.on('new message', function (data) {

    console.log(data);

    // TODO: only emit message to clients that have the thread loaded (in bubble view)
    // SEE: https://socket.io/docs/rooms-and-namespaces/
    socket.broadcast.emit('new message', data);
  });




  // Pass all received thread to all clients
  socket.on('new thread', function (data) {

    console.log(data);

    // TODO: only emit thread to clients that have the bubble opened and visible
    socket.broadcast.emit('new thread', data);
  });



});





// app.get('/get-data', function(req, res) {
//   mongo.connect(mongo_url, function(err, db) {
//
//
//     res.send('Hello, World!');
//   });
// });
//
// app.post('/insert', function(req, res){
//
// });



server.listen(port, function() {
 console.log('Server listening on http://localhost:' + port);
});
