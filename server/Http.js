
// HTTP dependency
const fs = require('fs');

// HTTP handler
const handler = (req, res) => {
  fs.readFile(__dirname + '/public/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

// Http server
const app = require('http').createServer(handler);

// Start listening http
app.listen(80);

console.log('HTTP server started');


module.exports = app;