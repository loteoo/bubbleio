var express = require("express");
var app = express();
var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;
var mongo_url = "mongodb://localhost:27017/bubbleio";
var port = 3000;



app.use(express.static(__dirname + '/public'));
app.get('/', function(req,res){
  res.sendFile(path.join(__dirname+'/public/index.html'));
});


app.get('/get-data', function(req, res) {
  mongo.connect(mongo_url, function(err, db) {


    res.send('Hello, World!');
  });
});

app.post('/insert', function(req, res){

});

app.listen(port, function() {
 console.log('Server listening on http://localhost:' + port);
});
