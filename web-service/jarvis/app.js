var express = require('express');
var https = require('https');
var http = require('http');
var bodyParser = require('body-parser');
var fs = require('fs');
var jwt = require('jsonwebtoken');

if (process.env.NODE_ENV != 'development' && process.env.NODE_ENV != 'qa' &&
    process.env.NODE_ENV != 'production') {
    process.exit();
}

// Init configs
var configs = require('./configs.js');
var riotHandler = require('./models/riot.js');
var weightHandler = require('./models/weights.js');
var users = require('./models/users.js');

var app = express();

// For our jsonwebtoken
app.set('superSecret', configs.jwtSecret);

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

app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json());

// Authenticate
app.post('/api/authenticate', function(req, res) {
    console.log('authenticate received');
    console.log(JSON.stringify(req.body, null, 2));

    var body = req.body;

    if (JSON.stringify(body) === '{}' || body == null || body == undefined) {
        return res.status(401).send({ message : 'Missing body.' });
    }

    if (body.email == undefined || body.password == undefined) {
        res.writeHead(401);
        return res.end('Error');
    }

    users.isValidUser(body.email, body.password, function(err, user) {
        
        if (err) {
            res.writeHead(401);
            return res.end(err);
        }
        else {

            // We have a valid user, let us give them a token!
            var token = jwt.sign(user, app.get('superSecret'), 
                { expiresIn : '1h' }, function(token) {
                             
                console.log('jwtoken: ' + token);                       
                return res.status(200).json({ success: true, 
                    message: 'Welcome Josh!', token: token});
            });
        }    
    });
});

// Get match history
app.get('/api/preview/matchHistory', function(req, res) {
	console.log('match history request received');
	riotHandler.getMatchHistory(function(err, data) {
		if (err) {
			res.writeHead(400);
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
			res.writeHead(400);
			return res.end({ Error : err });			
		}
		
		console.log('returning weight data!');
		res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
		return res.end(data);
	});
});

/* All calls below needs to have the proper token to work */

app.use(function(req, res, next) {

    var token = req.body.token || req.query.token || 
        req.headers['x-access-token'];

    if (token) {

        jwt.verify(token, app.get('superSecret'), function(err, decoded) {
            
            if (err)
                return res.json({ success : false, message : 'Failed to ' + 
                    'authenticate token.'});
            else {
                req.decoded = decoded;
                next();
            }
        });
    
    }
    else {
        // There is no token
        return res.status(403).send({
            success : false,
            message : 'No token provided.'
        });
    }
});

app.get('/test', function(req, res) {

    res.send('you rock!');
});

var options = {
    key : fs.readFileSync(configs.sslCert.key),
    cert : fs.readFileSync(configs.sslCert.cert)
};

https.createServer(options, app).listen(3000, function() {
    console.log('Started https server.');
});
