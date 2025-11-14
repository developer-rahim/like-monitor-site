const { twilio } = require('./env_setup')
const notifications = {};

const https = require('https');
const querystring = require('querystring');

notifications.sendTwiloSms = (phone, sms, callback) => {
    const userPhone = typeof phone === 'string' && phone.trim().length === 11 ? phone.trim() : false;
    const message =
        typeof sms === 'string' && sms.trim().length > 0 && sms.trim().length <= 1600
            ? sms.trim()
            : false;

    if (userPhone && message) {
        const payload = {
            MessagingServiceSid: twilio.messagingServiceSid,
            To: `+88${userPhone}`,
            Body: message,
        };

        const stringifiedPayload = querystring.stringify(payload);

        const options = {
            hostname: 'api.twilio.com',
            path: `/2010-04-01/Accounts/${twilio.accountSSd}/Messages.json`,
            method: 'POST',
            auth: `${twilio.accountSSd}:${twilio.accountToken}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(stringifiedPayload),
            },
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', () => {
                if (res.statusCode === 200 || res.statusCode === 201) {
                    callback(false);
                } else {
                    callback(`Status code returned: ${res.statusCode}, body: ${body}`);
                }
            });
        });

        req.on('error', (e) => {
            callback(e);
        });

        req.write(stringifiedPayload);
        req.end();
    } else {
        callback(403, { error: 'Invalid input data' });
    }
};


module.exports = notifications;