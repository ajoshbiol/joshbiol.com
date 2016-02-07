var mysql = require('mysql');
var configs = require('../configs.js').getConfigs();

var sessions = {};



module.exports = {
    
    isValidUser : function(username, password, callback) {
        
        // To avoid sql injection
        username = mysql.escape(username);
        password = mysql.escape(password);
        
        var connection = mysql.createConnection(configs.mysqlConn);
        var query = 'CALL sp_is_valid_user (' + username + ', ' + password + 
            ');';
        
        connection.query(query, function(err, rows) {
            if (err)
                return callback(err);
                
            console.log(rows[0]);
        });
        
        connection.end(function(err) {
			if (err)
				console.log(err);
		});
    }
    
}