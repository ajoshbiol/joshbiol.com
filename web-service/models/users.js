var mysql = require('mysql');
var configs = require('../configs.js').getConfigs();


module.exports = {
    
    isValidUser : function(username, password, callback) {
        try {
            // To avoid sql injection
            username = mysql.escape(username);
            password = mysql.escape(password);
            
            var connection = mysql.createConnection(configs.mysqlConn);
            var query = 'CALL sp_is_valid_user (' + username + ', ' + password + 
                ');';
            
            connection.query(query, function(err, rows) {
                if (err)
                    return callback(err);

                console.log('rows[0] ' + JSON.stringify(rows[0]));
                console.log('rows[0][0] ' + JSON.stringify(rows[0][0]));

                if (rows[0][0] == undefined)
                    return callback('Invalid user!');
                    
                var token = rows[0][0].token;
                console.log(token);
                return callback(null, token);
            });
            
            connection.end(function(err) {
                if (err)
                    console.log(err);
            });
        }
        catch (err) {
            callback(err);
        }
    }
}