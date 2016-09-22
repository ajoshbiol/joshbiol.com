var https = require('https');
var configs = require('../configs');

module.exports = {
	
	getMatchHistory : function(callback) {

        var query = 'https://na.api.pvp.net/api/lol/na/v1.3/game/' + 
            'by-summoner/41798816/recent?api_key=' + configs.riotKey;

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
