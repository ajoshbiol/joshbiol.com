var https = require('https')
var configs = require('../configs');

module.exports = {

    getPublicRepositories : function(callback) {
    
        var query = 'https://api.github.com/users/ajoshbiol/repos';
        // TODO add header

        https.request(query, function(response) {
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
