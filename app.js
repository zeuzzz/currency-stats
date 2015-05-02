var express = require('express');

var app = module.exports = express();

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});
app.use(express.static('public'));