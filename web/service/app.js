var express = require('express');
var https = require('https');
var http = require('http');
var bodyParser = require('body-parser');
var fs = require('fs');

if (process.env.NODE_ENV != 'development' && 
    process.env.NODE_ENV != 'qa' &&
    process.env.NODE_ENV != 'production') {
    process.exit();
}

// Init configs
var configs = require('./configs');
var riotHandler = require('./models/riot');
var weightHandler = require('./models/weights');
var users = require('./models/users');
var github = require('./models/github');

var app = express();

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', configs.corsAllow);
  res.header('Access-Control-Allow-Methods', 'GET,POST');
  res.header("Access-Control-Allow-Headers", 
          "Origin, X-Requested-With, Content-Type, Accept");
  if ('OPTIONS' == req.method) {
        res.sendStatus(200);
    } else {
        next();
    };
});

app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json());

// Get match history
app.get('/api/preview/matchHistory', function(req, res) {
	console.log('match history request received');
	riotHandler.getMatchHistory(function(err, data) {
		if (err) {
			res.writeHead(500);
			return res.end(err.message);
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
			res.writeHead(500);
			return res.end(err.message);			
		}
		
		console.log('returning weight data!');
		res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
		return res.end(data);
	});
});

// Get most recent commits
app.get('/api/preview/recentGithubActivity', function(req, res) {
	console.log('get recent github activity received');
    
    github.getPublicRepositories(function(err, response) {
        if (err) {
            res.writeHead(500, {"Content-Type": "text/html; charset=utf-8"});
            return res.end(err); 
        }
    
        res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
        return res.end(response); 
    });
});

if (process.env.NODE_ENV != 'development') {
    var options = {
        key : fs.readFileSync(configs.sslCert.key),
        cert : fs.readFileSync(configs.sslCert.cert)
    };

    https.createServer(options, app).listen(3000, function() {
        console.log('Started https server.');
    });
}
else {
    http.createServer(app).listen(3000, function() {
        console.log('Started http server.');
    });
}
