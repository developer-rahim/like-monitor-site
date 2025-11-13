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

    let protocal = typeof (requestPropertise.body.protocal) === 'string' && ['http', 'https'].indexOf(requestPropertise.body.protocal) > -1 ? requestPropertise.body.protocal : false;
    let url = typeof (requestPropertise.body.url) === 'string' && requestPropertise.body.url.trim().length > 0 ? requestPropertise.body.url : false;
    let method = typeof (requestPropertise.body.method) === 'string' && ['GET', 'PUT', 'POST', 'DELETE'].indexOf(requestPropertise.body.method) > -1 ? requestPropertise.body.method : false;
    let successCode = typeof (requestPropertise.body.successCode) === 'object' && requestPropertise.body.successCode instanceof Array ? requestPropertise.body.successCode : false;
    let timeoutSecond = typeof (requestPropertise.body.timeoutSecond) === 'number' && requestPropertise.body.timeoutSecond >= 1 && requestPropertise.body.timeoutSecond <= 5 ? requestPropertise.body.timeoutSecond : false;
    console.log(timeoutSecond);
    if (protocal && url && method && successCode && timeoutSecond) {
        const token = requestPropertise.headersObject.token;
        if (!token) {
            callback(403, { error: 'Token required' });
            return;
        }
        dataBase.read('tokens', token, (err, tokenData) => {
            if (!err && tokenData) {
                let userphone = parseJson(tokenData).phone;
                dataBase.read('users', userphone, (err, userData) => {
                    if (!err, userData) {
                        let userObject = parseJson(userData)
                        tokenHandeler._token.verify(token, userObject.phone, (isValid, tokenData) => {
                            if (!isValid) {
                                callback(403, { error: 'Unauthorized' });
                                return;
                            }

                            // ✅ tokenData available here (you can use it internally)
                            console.log('Verified token data:', tokenData);

                            // For example: you can check expiration, log user, etc.
                            if (Date.now() > tokenData.expireData) {
                                callback(403, { error: 'Token expired' });
                                return;
                            }
                            let checkArray = typeof userObject.checks === 'object' && userObject.checks === userObject.checks instanceof Array ? userObject.checks : [];
                            if (checkArray < maxChecks) {
                                let checkId = randomStringGenerate(20);
                                let checkObject = {
                                    "id": checkId,
                                    "phone": userObject.phone,
                                    "timeoutSeconds": timeoutSecond,
                                    "method": method,
                                    "url": url,
                                    "protocal": protocal,
                                    "seccessCodes": successCode,
                                }
                                dataBase.create('checks', checkId, checkObject, (err4) => {
                                    if (!err4) {
                                        callback(200, { "message": "successfully create checks" })
                                    } else {
                                        callback(500, { "error": "Does not create checks" })
                                    }
                                })
                            } else {
                                callback(500, { "error": "Reached max 5 checks" })
                            }


                        });
                    } else {
                        callback(400, { "error": "User not found" })
                    }
                })

            } else {

            }
        })

    } else {
        callback(422, { "error": "Enter required data" });
    }


};

handler._check.put = (requestPropertise, callback) => {
    const firstName = typeof requestPropertise.body.firstName === 'string' && requestPropertise.body.firstName.trim().length > 0 ? requestPropertise.body.firstName : false;
    const lastName = typeof requestPropertise.body.lastName === 'string' && requestPropertise.body.lastName.trim().length > 0 ? requestPropertise.body.lastName : false;
    const password = typeof requestPropertise.body.password === 'string' && requestPropertise.body.password.trim().length >= 6 ? requestPropertise.body.password : false;


}
handler._check.delete = (requestPropertise, callback) => {
    const phone = typeof requestPropertise.quaryStringObject.phone === 'string' && requestPropertise.quaryStringObject.phone.trim().length > 0 ? requestPropertise.quaryStringObject.phone : false;

};

module.exports = handler;