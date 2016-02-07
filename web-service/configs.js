var configs = undefined;

var lolMatchHistoryUrl = 'https://na.api.pvp.net/api/lol/na/v1.3/game/' + 
	'by-summoner/41798816/recent?api_key=0972299d-4f17-4eb0-bfc9-3849b4acb5aa';

var jarvisConn = {
	host: '45.55.55.13',
	user: 'root',
	password: 'PASSWORD',
	database: 'Jarvis',
	port: 3306
};

var devConfigs = {
    matchHistoryUrl : lolMatchHistoryUrl,
    mysqlConn : jarvisConn,
    sslCert : {
        key : '../certs/joshbiol.crt',
        cert : '../certs/intermediate.crt'
    },
    serverListener : {
        port : 3000,
        host : '0.0.0.0'
    }
}

var qaConfigs = {
    matchHistoryUrl : lolMatchHistoryUrl,
    mysqlConn : jarvisConn,
    sslCert : {
        key : '/home/josh/ssl/joshbiol.com.key',
        cert : '/home/josh/ssl/joshbiol.crt'
    },
    serverListener : {
        port : 3000,
        host : '0.0.0.0'
    }
}

var prodConfigs = {
    matchHistoryUrl : lolMatchHistoryUrl,
    mysqlConn : jarvisConn,
    sslCert : {
        key : '/home/josh/ssl/joshbiol.com.key',
        cert : '/home/josh/ssl/joshbiol.crt'
    },
    serverListener : {
        port : 3000,
        host : '0.0.0.0'
    }
}

module.exports = {
    
    initConfigs : function(env) {
        switch(env) {
            case 'dev':
                return configs = devConfigs;
            case 'qa':
                return configs = qaConfigs;
            case 'prod':
                return configs = prodConfigs;
            default:
                return;
        }
    },
    
    getConfigs : function() {
        return configs;
    }
};