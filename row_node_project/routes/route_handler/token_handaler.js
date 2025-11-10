const userData = require('../../data_crud/data')
const { hasingPassword } = require('../../helper/utiles')
const { parseJson } = require('../../helper/utiles')
const { tokenGenerate } = require('../../helper/utiles')
const handler = {}

handler.tokenHander = (requestPropertise, callback) => {
    const acceptMethod = ['get', 'post', 'put', 'delete'];
    if (acceptMethod.indexOf(requestPropertise.reqMethod) > -1) {
        handler._token[requestPropertise.reqMethod](requestPropertise, callback);
    } else {
        callback(405, { error: 'Method not allowed' });
    }
}
handler._token = {};
handler._token.get = (requestPropertise, callback) => {



}
handler._token.post = (requestPropertise, callback) => {
    const phone = typeof requestPropertise.body.phone === 'string' && requestPropertise.body.phone.trim().length > 0 ? requestPropertise.body.phone : false;
    const password = typeof requestPropertise.body.password === 'string' && requestPropertise.body.password.trim().length >= 6 ? requestPropertise.body.password : false;

    if (phone && password) {
        userData.read('users', phone, (err, data) => {
            if (!err) {
                const userdata = { ...parseJson(data) }
                let hasPassword = hasingPassword(password);
                console.log(hasPassword)
                console.log(data.password)
                if (hasPassword === userdata.password) {
                    let tokenId = tokenGenerate(20);
                    let expireData = Date.now() + 60 + 60 * 1000;
                    let tokenObject = {
                        phone, "id": tokenId,
                        expireData
                    }
                    userData.create('tokens', tokenId, tokenObject, (err2) => {
                        if (!err2) {
                            callback(200, tokenObject)
                        } else {
                            callback(500, { "error": "serverside error" })
                        }
                    })

                } else {
                    callback(400, { "error": "passwor/phone not match" })
                }
            } else {
                callback(404, { message: 'User not found' });
            }
        })
    }
}
handler._token.delete = (requestPropertise, callback) => {

};

module.exports = handler;