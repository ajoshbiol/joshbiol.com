var express = require('express');
var https = require('https');
var fs = require('fs');

var configs = require('./configs.js');

var options = {
    key : fs.readFileSync(configs.sslCert.key),
    cert : fs.readFileSync(configs.sslCert.cert)
};

var riotHandler = require('./handlers/riotHandler.js');
var weightHandler = require('./handlers/weightHandler.js');

var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

// Get match history
app.get('/riot/matchHistory', function(req, res) {
	console.log('match history request received');
	riotHandler.getMatchHistory(function(err, data) {
		if (err) {
			res.writeHead(400);
			return res.end(err);
		}	
		
		console.log('sending match history!');
		
		res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});	
		return res.end(data);
	});
});

// Get recent weights
app.get('/health/weight/recentWeights', function(req, res) {
	console.log('get recent weights request received');
	
	weightHandler.getRecentWeights(function(err, data) {
		if (err) {
			res.writeHead(400);
			return res.end(err);			
		}
		
		console.log('returning weight data!');
		res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
		return res.end(data);
	});
});

https.createServer(options, app).listen(3000, function() {
    console.log('Started');
});