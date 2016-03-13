var crypto = require('crypto');

var pw = '';
var notPw = 'not'

var hashSecret = 'imHopingThisIsConsistent';

var hmac = crypto.createHmac('sha1', hashSecret);
console.log('secret: ' + hashSecret);

hmac.update(pw);
var hash1 = hmac.digest('hex');

console.log(hash1);

var hmac2 = crypto.createHmac('sha1', hashSecret);
hmac2.update(notPw);
console.log(hmac2.digest('hex'));

var hmac3 = crypto.createHmac('sha1', hashSecret);
hmac3.update(pw);
console.log(hmac3.digest('hex'));
