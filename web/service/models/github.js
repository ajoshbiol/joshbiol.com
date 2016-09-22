var https = require('https')
var configs = require('../configs');

module.exports = {

    getPublicRepositories : function(callback) {
    
        var query = 'https://api.github.com/users/ajoshbiol/repos';

        https.request(query, function(response) {
        
            console.log(response);
        });
    }
    
}
