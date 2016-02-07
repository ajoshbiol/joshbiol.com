var express = require('express');
var https = require('https');
var http = require('http');
var fs = require('fs');

// Init configs
require('./configs.js').initConfigs(process.argv[2]);

var configs = require('./configs.js').getConfigs();

if (configs == undefined)
    process.exit();

var options = {};

if (configs.type != 'dev') {
    options = {
        key : fs.readFileSync(configs.sslCert.key),
        cert : fs.readFileSync(configs.sslCert.cert)
    };
}

var riotHandler = require('./models/riotHandler.js');
var weightHandler = require('./models/weights.js');
var users = require('./models/weights.js');

var app = express();

app.use(express.static(__dirname + '/views'));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://joshbiol.com");
  res.header('Access-Control-Allow-Methods', 'GET,POST');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  if ('OPTIONS' == req.method) {
        res.sendStatus(200);
    } else {
        next();
    };
});

// Authenticate
app.post('/api/authenticate', function(req, res) {
    console.log('authenticate received');
    console.log(req.body);
    
    //users.isValidUser();
    res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});	
	return res.end('{ "test" : "msg" }');
});

// Get match history
app.get('/api/preview/matchHistory', function(req, res) {
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
app.get('/api/preview/recentWeights', function(req, res) {
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

if (configs.type != 'dev') {
    https.createServer(options, app).listen(3000, function() {
        console.log('Started https server.');
    });
}
else {
    http.createServer(app).listen(3000, function() {
        console.log('Started http server.');
    });
}