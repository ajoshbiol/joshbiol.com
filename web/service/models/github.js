var https = require('https')
var configs = require('../configs');

module.exports = {

    getPublicRepositories : function(callback) {
    
        var options = {
            hostname : 'api.github.com',
            path: '/users/' + configs.github.username + '/repos',
            method : 'GET',
            headers : {
                'user-agent' : configs.github.username
            }
        }

        https.request(options, function(response) {
            var dataCollected = [];
            
            response.on('data', function(data) {
                dataCollected.push(data);
            });
            
            response.on('end', function(data) {
                dataCollected.push(data);

                var githubInfo = JSON.parse(dataCollected.join(''));

                var retInfo = {};
                retInfo["repos"] = []
                for (var i = 0; i < githubInfo.length; i++) {
                    var info = {};
                    info["name"] = githubInfo[i]["name"];
                    info["url"] = githubInfo[i]["html_url"];
                    info["desc"] = githubInfo[i]["description"];
                    info["language"] = githubInfo[i]["language"];
                    info["created_at"] = githubInfo[i]["created_at"];
                    info["updated_at"] = githubInfo[i]["updated_at"];
                    info["pushed_at"] = githubInfo[i]["pushed_at"];
                    info["watchers"] = githubInfo[i]["watchers_count"];
                    info["stars"] = githubInfo[i]["stargazers_count"];
                    retInfo["repos"].push(info);
                }

                return callback(null, JSON.stringify(retInfo));
            });

            response.on('error', function(err) {
                console.log(err);
                return callback(err);
            });
        }).end();
    }
}
