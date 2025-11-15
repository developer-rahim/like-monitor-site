const { twilio } = require('./env_setup');
const https = require('https');
const querystring = require('querystring');

const notifications = {};

notifications.sendTwiloSms = (phone, sms, callback) => {
    const userPhone = typeof phone === 'string' && phone.trim().length === 11 ? phone.trim() : false;
    const message = typeof sms === 'string' && sms.trim().length > 0 ? sms.trim() : false;

    if (!userPhone || !message) {
        return callback('Invalid phone or message');
    }

    const payload = {
        MessagingServiceSid: twilio.messagingServiceSID,
        To: `+88${userPhone}`,
        Body: message,
    };

    const stringifiedPayload = querystring.stringify(payload);

    const options = {
        hostname: 'api.twilio.com',
        path: `/2010-04-01/Accounts/${twilio.accountSID}/Messages.json`,
        method: 'POST',
        auth: `${twilio.accountSID}:${twilio.accountToken}`,  // FIXED
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(stringifiedPayload),
        },
    };

    const req = https.request(options, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
            if (res.statusCode === 200 || res.statusCode === 201) {
                callback(false);
            } else {
                callback(`Twilio Error: ${res.statusCode} | ${body}`);
            }
        });
    });

    req.on('error', (err) => callback(err));
    req.write(stringifiedPayload);
    req.end();
};

module.exports = notifications;
