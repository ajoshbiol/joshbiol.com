var mysql = require('mysql');
var configs = require('../configs.js');

module.exports = {
	
	getRecentWeights : function(callback) {
		var connection = mysql.createConnection(configs.mysqlConn);
		var query = 'SELECT * FROM weights ORDER BY datetime DESC LIMIT 5;';
		
		connection.query(query, function(err, rows, fields) {
			if (err)
				return callback(err);
			
			var records = [];
			
			for (var i = rows.length - 1; i > -1; i--) {
				var record = {};
				
				record['weight'] = rows[i].weightInLbs;
				record['datetime'] = rows[i].datetime;
				
				records.push(JSON.stringify(record, null, 2));
			}
			
			var json = '{"data" : [' + records.join(',') + ']}'
			
			return callback(null, json);
		});
		
		connection.end(function(err) {
			if (err)
				console.log(err);
		});
	}
}
