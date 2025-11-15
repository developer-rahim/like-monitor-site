/*
Title : Up time monitoring application
*/

const http = require('http');
const https = require('https');
const { handleReqRes } = require('../helper/handle_req_res');
const environment = require('../helper/env_setup');
const crudFile = require('../data_crud/data');
const { parseJson } = require('../helper/utiles');
const notifications = require('../helper/notification');
const url = require('url');

// Scaffolding
const worker = {};


// -----------------------------------------------------------------------------
// 1. Process each check data
// -----------------------------------------------------------------------------
worker.checkIndividulaCheckdata = (originalCheck) => {
    let originalCheckObj = parseJson(originalCheck);

    if (originalCheckObj && originalCheckObj.id) {
        originalCheckObj.state =
            typeof originalCheckObj.state === 'string' &&
                ['up', 'down'].includes(originalCheckObj.state)
                ? originalCheckObj.state
                : 'down';

        originalCheckObj.lastChecked =
            typeof originalCheckObj.lastChecked === 'number' &&
                originalCheckObj.lastChecked > 0
                ? originalCheckObj.lastChecked
                : false;

        console.log(`State : ${originalCheckObj.state}`);
        worker.performance(originalCheckObj);

    } else {
        console.log('Invalid check id');
    }
};


// -----------------------------------------------------------------------------
// 2. Perform the request to check uptime
// -----------------------------------------------------------------------------
worker.performance = (originalCheckObj) => {
    let checkOutCome = {
        error: false,
        value: false,
    };

    let outComeSent = false;

    // FIXED: Correct URL parsing
    const parsedUrl = new URL(`${originalCheckObj.protocal}://${originalCheckObj.url}`);

    const hostname = parsedUrl.hostname;
    const path = parsedUrl.pathname + parsedUrl.search;

    // FIXED: Correct request details
    const requestDetails = {
        protocol: originalCheckObj.protocal + ':',
        hostname: hostname,
        method: originalCheckObj.method.toUpperCase(),
        path: path,
        timeout: originalCheckObj.timeoutSeconds * 1000,
    };

    // FIXED: Correct protocol selection
    const protocolToUse = originalCheckObj.protocal === 'http' ? http : https;

    const req = protocolToUse.request(requestDetails, (res) => {
        console.log(`Response Code: ${res.statusCode}`);

        checkOutCome.responseCode = res.statusCode;

        if (!outComeSent) {
            worker.progressCheckoutCome(originalCheckObj, checkOutCome);
            outComeSent = true;
        }
    });

    // Handle request error
    req.on('error', (e) => {
        checkOutCome = {
            error: true,
            value: e.message,
        };

        if (!outComeSent) {
            worker.progressCheckoutCome(originalCheckObj, checkOutCome);
            outComeSent = true;
        }
    });

    // Handle timeout
    req.on('timeout', () => {
        checkOutCome = {
            error: true,
            value: 'Timeout',
        };

        if (!outComeSent) {
            worker.progressCheckoutCome(originalCheckObj, checkOutCome);
            outComeSent = true;
        }
    });

    req.end();
};


// -----------------------------------------------------------------------------
// 3. Decide check outcome and update data
// -----------------------------------------------------------------------------
worker.progressCheckoutCome = (originalCheckObj, checkOutCome) => {
    console.log(`Final Response Code: ${checkOutCome.responseCode}`);

    const isSuccess =
        !checkOutCome.error &&
        checkOutCome.responseCode &&
        Array.isArray(originalCheckObj.successCodes) &&
        originalCheckObj.successCodes.includes(checkOutCome.responseCode);

    const state = isSuccess ? 'up' : 'down';

    const alertWanted =
        !!originalCheckObj.lastChecked &&
        originalCheckObj.state !== state;

    const newCheckData = {
        ...originalCheckObj,
        state,
        lastChecked: Date.now(),
    };

    crudFile.update('checks', newCheckData.id, newCheckData, (err) => {
        if (!err) {
            if (alertWanted) {
                worker.sendAlertToUser(newCheckData);
            } else {
                console.log('No state change — no alert needed.');
            }
        } else {
            console.log('Failed to update checks');
        }
    });
};


// -----------------------------------------------------------------------------
// 4. Send SMS alert
// -----------------------------------------------------------------------------
worker.sendAlertToUser = (newCheckData) => {
    const msg = `Alert: Your ${newCheckData.protocal.toUpperCase()} ${newCheckData.url} (${newCheckData.method}) is now ${newCheckData.state}.`;

    notifications.sendTwiloSms(newCheckData.phone, msg, (err) => {
        if (!err) {
            console.log("SMS sent:", msg);
        } else {
            console.log("Failed to send SMS:", err);
        }
    });
};


// -----------------------------------------------------------------------------
// 5. Get all checks and run them
// -----------------------------------------------------------------------------
worker.getAllChecks = () => {
    crudFile.listData('checks', (error, filenames) => {
        if (!error && filenames?.length) {
            filenames.forEach((check) => {
                crudFile.read('checks', check, (err, originalCheck) => {
                    if (!err && originalCheck) {
                        worker.checkIndividulaCheckdata(originalCheck);
                    } else {
                        console.log('Could not read check');
                    }
                });
            });
        } else {
            console.log('No checks found');
        }
    });
};


// -----------------------------------------------------------------------------
// 6. Loop every 9 seconds
// -----------------------------------------------------------------------------
worker.loopCheckes = () => {
    setInterval(() => worker.getAllChecks(), 9000);
};


// -----------------------------------------------------------------------------
// 7. Init
// -----------------------------------------------------------------------------
worker.init = () => {
    worker.getAllChecks();
    worker.loopCheckes();
};


// Export worker
module.exports = worker;
