var https = require('https')
var configs = require('../configs');

module.exports = {

    getPublicRepositories : function(callback) {
    
        var options = {
            hostname : 'api.github.com',
            path: '/users/ajoshbiol/repos',
            method : 'GET',
            headers : {
                'user-agent' : 'ajoshbiol'
            }
        }

        var agent = new https.Agent({ KeepAlive : false });
        options.agent = agent;

        https.request(options, function(response) {
            var dataCollected = [];
            
            response.on('data', function(data) {
                dataCollected.push(data);
            });
            
            response.on('end', function(data) {
                dataCollected.push(data);
                return callback(null, dataCollected.join(''));
            });

            response.on('error', function(err) {
                console.log(err);
                return callback(err);
            });
        }).end();
    }
}
