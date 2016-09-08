var mailer = require('nodemailer');
var forever = require('forever-monitor')
var configs = require('./configs')

// email configs
var options = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use ssl
    auth: {
        user: configs.smtp.user,
        pass: configs.smtp.pass
    }
}

// reusable transporter object
var transporter = mailer.createTransport(options);

var mailData = {
    from: configs.smtp.emailTo,
    to: configs.smtp.emailFrom,
    subject: process.env.NODE_ENV + ' joshbiol.com service restart',
    text: 'If this was unintentional please look into this restart.',
}

function sendMail() {
    // send mail with defined transport object
    transporter.sendMail(mailData, function(err, info) {
        if (err)
            return console.log(err);
        
        console.log('Message sent: ' + info.response);
    });
}

// forever process configs
var child = new (forever.Monitor)('./app.js', {
    max: 3,
    args: [],
    watch: true,
    watchDirectory: '.',
    
    //
    // Log files and associated logging options for this instance
    //
    'logFile': './forever.out', // Path to log output from forever process (when daemonized)
    'outFile': './out.log', // Path to log output from child stdout
    'errFile': './err.log', // Path to log output from child stderr
});

child.on('exit', function() {
    console.log('Service has exited.');
    // modify mail data subject and text
    sendMail();
});

child.on('watch:restart', function(info) {
    console.log('Restarting script because ' + info.file + ' changed.');
});

child.on('restart', function() {
    console.log('Service has restarted.');
    // modify mail data subject and text
    sendMail();
});

// start our process
child.start();

process.stdin.resume();//so the program will not close instantly

function exitHandler(options, err) {
    if (options.cleanup) {
        console.log('Cleaning up.');
        child.kill();
    };
    if (err) console.log(err.stack);
    if (options.exit) {
        console.log('Exiting');
        process.exit();
    };
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));
