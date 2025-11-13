const dataBase = require('../../data_crud/data')
const { parseJson, randomStringGenerate } = require('../../helper/utiles')
const tokenHandeler = require('./token_handaler');
const { maxChecks } = require('../../helper/env_setup')
const handler = {}

handler.checkHandler = (requestPropertise, callback) => {
    const acceptMethod = ['get', 'post', 'put', 'delete'];
    if (acceptMethod.indexOf(requestPropertise.reqMethod) > -1) {
        handler._check[requestPropertise.reqMethod](requestPropertise, callback);
    } else {
        callback(405, { error: 'Method not allowed' });
    }
}
handler._check = {};
handler._check.get = (requestPropertise, callback) => {
    const id =
        typeof requestPropertise.quaryStringObject.id === 'string' &&
            requestPropertise.quaryStringObject.id.trim().length > 0
            ? requestPropertise.quaryStringObject.id.trim()
            : false;

    if (!id) {
        callback(400, { error: 'Check id required' });
        return;
    }

    const token = requestPropertise.headersObject.token;
    if (!token) {
        callback(403, { error: 'Token required' });
        return;
    }
    dataBase.read('checks', id, (erro, checkData) => {
        if (!erro && checkData) {
            // ✅ Verify token first
            tokenHandeler._token.verify(token, parseJson(checkData).phone, (isValid, tokenData) => {
                if (!isValid) {
                    callback(403, { error: 'Unauthenticated' });
                    return;
                }

                // ✅ tokenData available here (you can use it internally)
                console.log('Verified token data:', tokenData);

                // For example: you can check expiration, log user, etc.
                if (Date.now() > tokenData.expireData) {
                    callback(403, { error: 'Token expired' });
                    return;
                }
                callback(200, parseJson(checkData));
            });

        } else {
            callback(500, { "error": "check not found" })
        }
    })


}
handler._check.post = (requestPropertise, callback) => {
    let protocal = typeof requestPropertise.body.protocal === 'string' &&
        ['http', 'https'].indexOf(requestPropertise.body.protocal) > -1
        ? requestPropertise.body.protocal
        : false;

    let url = typeof requestPropertise.body.url === 'string' &&
        requestPropertise.body.url.trim().length > 0
        ? requestPropertise.body.url
        : false;

    let method = typeof requestPropertise.body.method === 'string' &&
        ['GET', 'PUT', 'POST', 'DELETE'].indexOf(requestPropertise.body.method) > -1
        ? requestPropertise.body.method
        : false;

    let successCode = Array.isArray(requestPropertise.body.successCode)
        ? requestPropertise.body.successCode
        : false;

    let timeoutSecond =
        typeof requestPropertise.body.timeoutSecond === 'number' &&
            requestPropertise.body.timeoutSecond >= 1 &&
            requestPropertise.body.timeoutSecond <= 5
            ? requestPropertise.body.timeoutSecond
            : false;

    if (protocal && url && method && successCode && timeoutSecond) {
        const token = requestPropertise.headersObject.token;
        if (!token) {
            callback(403, { error: 'Token required' });
            return;
        }

        dataBase.read('tokens', token, (err, tokenData) => {
            if (!err && tokenData) {
                const userPhone = parseJson(tokenData).phone;

                dataBase.read('users', userPhone, (err, userData) => {
                    if (!err && userData) {
                        let userObject = parseJson(userData);

                        tokenHandeler._token.verify(token, userObject.phone, (isValid, tokenData) => {
                            if (!isValid) {
                                callback(403, { error: 'Unauthorized' });
                                return;
                            }

                            if (Date.now() > tokenData.expireData) {
                                callback(403, { error: 'Token expired' });
                                return;
                            }

                            // ✅ Ensure userObject.checks is an array
                            let checkArray = Array.isArray(userObject.checks) ? userObject.checks : [];
                            const maxChecks = 5; // for example
                            console.log(checkArray.length);
                            if (checkArray.length < maxChecks) {
                                const checkId = randomStringGenerate(20);
                                const checkObject = {
                                    id: checkId,
                                    phone: userObject.phone,
                                    timeoutSeconds: timeoutSecond,
                                    method: method,
                                    url: url,
                                    protocal: protocal,
                                    successCodes: successCode,
                                };

                                dataBase.create('checks', checkId, checkObject, (err4) => {
                                    if (!err4) {
                                        // ✅ Push new check id to user's checks array
                                        userObject.checks = [...checkArray, checkId];

                                        // ✅ Save updated user data
                                        dataBase.update('users', userPhone, userObject, (err5) => {
                                            if (!err5) {
                                                callback(200, {
                                                    message: 'Check created successfully',
                                                    checkId: checkId,
                                                });
                                            } else {
                                                callback(500, { error: 'Could not update user checks' });
                                            }
                                        });
                                    } else {
                                        callback(500, { error: 'Could not create check' });
                                    }
                                });
                            } else {
                                callback(400, { error: 'Reached max 5 checks' });
                            }
                        });
                    } else {
                        callback(400, { error: 'User not found' });
                    }
                });
            } else {
                callback(403, { error: 'Invalid token' });
            }
        });
    } else {
        callback(422, { error: 'Enter required data' });
    }
};


handler._check.put = (requestPropertise, callback) => {
    const id =
        typeof requestPropertise.quaryStringObject.id === 'string' &&
            requestPropertise.quaryStringObject.id.trim().length > 0
            ? requestPropertise.quaryStringObject.id.trim()
            : false;
    let protocal = typeof (requestPropertise.body.protocal) === 'string' && ['http', 'https'].indexOf(requestPropertise.body.protocal) > -1 ? requestPropertise.body.protocal : false;
    let url = typeof (requestPropertise.body.url) === 'string' && requestPropertise.body.url.trim().length > 0 ? requestPropertise.body.url : false;
    let method = typeof (requestPropertise.body.method) === 'string' && ['GET', 'PUT', 'POST', 'DELETE'].indexOf(requestPropertise.body.method) > -1 ? requestPropertise.body.method : false;
    let successCode = typeof (requestPropertise.body.successCode) === 'object' && requestPropertise.body.successCode instanceof Array ? requestPropertise.body.successCode : false;
    let timeoutSecond = typeof (requestPropertise.body.timeoutSecond) === 'number' && requestPropertise.body.timeoutSecond >= 1 && requestPropertise.body.timeoutSecond <= 5 ? requestPropertise.body.timeoutSecond : false;
    console.log(timeoutSecond);

    if (!id) {
        callback(400, { error: 'Check id required' });
        return;
    }

    const token = requestPropertise.headersObject.token;
    if (!token) {
        callback(403, { error: 'Token required' });
        return;
    }
    dataBase.read('checks', id, (erro, checkData) => {
        if (!erro && checkData) {
            // ✅ Verify token first
            let checkObject = parseJson(checkData)
            tokenHandeler._token.verify(token, parseJson(checkData).phone, (isValid, tokenData) => {
                if (!isValid) {
                    callback(403, { error: 'Unauthenticated' });
                    return;
                }

                // ✅ tokenData available here (you can use it internally)
                console.log('Verified token data:', tokenData);

                // For example: you can check expiration, log user, etc.
                if (Date.now() > tokenData.expireData) {
                    callback(403, { error: 'Token expired' });
                    return;
                }
                if (url || method || timeoutSecond || successCode || protocal) {

                    if (url) {
                        checkObject.url = url;
                    }
                    if (method) {
                        checkObject.method = method;
                    }
                    if (protocal) {
                        checkObject.protocal = protocal;
                    }
                    if (timeoutSecond) {
                        checkObject.timeoutSecond = timeoutSecond;
                    }
                    if (successCode) {
                        checkObject.successCodes = successCode;
                    }
                    dataBase.update('checks', id, checkObject, (err) => {
                        if (!err) {
                            callback(200, checkObject)
                        } else {
                            callback(500, { "error": "Not able to check" })
                        }
                    })

                } else {
                    callback(500, { "error": "Nothing change for update" })
                }
            });

        } else {
            callback(500, { "error": "check not found" })
        }
    })

}
handler._check.delete = (requestPropertise, callback) => {
    const phone = typeof requestPropertise.quaryStringObject.phone === 'string' && requestPropertise.quaryStringObject.phone.trim().length > 0 ? requestPropertise.quaryStringObject.phone : false;

};

module.exports = handler;