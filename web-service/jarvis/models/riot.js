var https = require('https');
var configs = require('../configs.js');

module.exports = {
	
	getMatchHistory : function(callback) {
		https.request(configs.matchHistoryUrl, function(response) {
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
