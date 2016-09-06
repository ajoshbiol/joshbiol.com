var mysql = require('mysql');
var crypto = require('crypto');
var configs = require('../configs.js');

module.exports = {
    
    isValidUser : function(username, password, callback) {
        try {

            // To avoid sql injection
            username = mysql.escape(username);

            var connection = mysql.createConnection(configs.mysqlConn);
            var query = 'CALL sp_is_valid_user (' + username + ');';
            
            connection.query(query, function(err, rows) {
                if (err)
                    return callback(err);

                if (rows[0][0] == undefined)
                    return callback('Invalid user!');
                    
                var user = rows[0][0];

                var hmac = crypto.createHmac('sha1', configs.hashSecret);
                hmac.update(password);
                var digest = hmac.digest('hex');

                if (digest == user.password) {
                
                    var validUser = {
                        username : username,
                        valid : 1
                    }

                    return callback(null, validUser); 
                
                }
                else return callback('Invalid user!');
            });
            
            connection.end(function(err) {
                if (err)
                    console.log(err);
            });
        }
        catch (err) {
            console.error(err.message);
            callback(err);
        }
    }
}
