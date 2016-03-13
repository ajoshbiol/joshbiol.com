var https = require('https');

var options = {
    hostname : 'joshbiol.com',
    port : 443,
    path : '/api/authenticate',
    method : 'POST',
    header : {
        'Content-Type': 'application/json'
    }
}

var payload = {
    email : '',
    password : ''
};

var response = [];

var req = https.request(options, function(res) {
    res.setEncoding('utf-8');
    res.on('data', function(chunk) {
       response.push(chunk);
    });
    res.on('end', function() {
        console.log(response.join(''));
    });
    res.on('err', function(err) {
        console.log('Error: ' + err);
    });
});

console.log(JSON.stringify(payload, null, 2));

req.write(JSON.stringify(payload, null, 2));
req.end();
