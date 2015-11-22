var express = require('express');

var configs = require('./configs.js');
var riotHandler = require('./handlers/riotHandler.js');

var app = express();

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 
  	'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Get match history
app.get('/riot/matchHistory', function(req, res) {
	console.log('match history request received');
	riotHandler.getMatchHistory(function(err, data) {
		if (err)
			console.log(err);
		
		console.log('sending match history!');
		
		res.writeHead(200);	
		return res.end(data);
	});
});

// Get champions
app.get('/riot/champions', function(req, res) {
	console.log('champion request received');
	riotHandler.getChampionsData(function(err, data) {
		if (err)
			console.log(err);
		
		console.log('sending champion data!');
		
		res.writeHead(200);
		return res.end(data);
	});
});

var server = app.listen(configs.serverListener.port,
	configs.serverListener.host);

console.log('Listening at http://' + configs.serverListener.host + ':' +
	configs.serverListener.port);