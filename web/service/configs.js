var configs = {}

configs.corsAllow = 'https://joshbiol.com';

configs.jwtSecret = 'myTestSecret';

configs.mysqlConn = {
    host : '45.55.55.13',
    user : 'service_secure',
    password : ')yK3>FHS:2i#t8rc@H'
}

configs.matchHistoryUrl = 'https://na.api.pvp.net/api/lol/na/v1.3/game/' + 
    'by-summoner/41798816/recent?api_key=0972299d-4f17-4eb0-bfc9-3849b4acb5aa';

configs.smtp = {
    emailTo : 'ajbiol@gmail.com',
    emailFrom : 'ajbiol@gmail.com',
    user : 'ajbiol@gmail.com',
    pass : 'iwyeuwrbjgscmvst'
};

module.exports = configs;
