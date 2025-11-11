const userData = require('../../data_crud/data')
const { hasingPassword } = require('../../helper/utiles')
const { parseJson } = require('../../helper/utiles')
const tokenHandeler = require('./token_handaler');
const handler = {}

handler.userHander = (requestPropertise, callback) => {
    const acceptMethod = ['get', 'post', 'put', 'delete'];
    if (acceptMethod.indexOf(requestPropertise.reqMethod) > -1) {
        handler._user[requestPropertise.reqMethod](requestPropertise, callback);
    } else {
        callback(405, { error: 'Method not allowed' });
    }
}
handler._user = {};
handler._user.get = (requestPropertise, callback) => {

    const phone = typeof requestPropertise.quaryStringObject.phone === 'string' && requestPropertise.quaryStringObject.phone.trim().length > 0 ? requestPropertise.quaryStringObject.phone : false;
    if (phone) {
        if (!requestPropertise.headersObject.token) {
           callback(403,{"error":"token need"}) ;
           return;
        }
        tokenHandeler._token.verify(requestPropertise.headersObject.token, phone, (err) => {
            if (!err) {
                callback(403, { "error": "Unauthenticated" })
                return;
            }
        })
        userData.read('users', phone, (err, data) => {
            const user = { ...parseJson(data) }
            if (!err && data) {
                delete user.password;
                callback(200, user)
            }
        })
    } else {
        callback(400, { "error": 'Not found user' })
    }

}
handler._user.post = (requestPropertise, callback) => {
    const firstName = typeof requestPropertise.body.firstName === 'string' && requestPropertise.body.firstName.trim().length > 0 ? requestPropertise.body.firstName : false;
    const lastName = typeof requestPropertise.body.lastName === 'string' && requestPropertise.body.lastName.trim().length > 0 ? requestPropertise.body.lastName : false;
    const phone = typeof requestPropertise.body.phone === 'string' && requestPropertise.body.phone.trim().length > 0 ? requestPropertise.body.phone : false;
    const password = typeof requestPropertise.body.password === 'string' && requestPropertise.body.password.trim().length >= 6 ? requestPropertise.body.password : false;
    const tosAgreement = typeof requestPropertise.body.tosAgreement === 'boolean' ? requestPropertise.body.tosAgreement : false;

    if (firstName && lastName && phone && password && tosAgreement) {
        // check if user already exists
        userData.read('users', phone, (err, user) => {
            if (!err && user) {
                // user exists
                callback(400, { error: 'User already exists' });
            } else {
                // user does not exist, create
                const userObject = {
                    firstName,
                    lastName,
                    phone,
                    password: hasingPassword(password),
                    tosAgreement
                };

                userData.create('users', phone, userObject, (err2) => {
                    if (!err2) {
                        callback(200, { message: 'User created successfully' });
                    } else {
                        // real error
                        callback(500, { error: `User not created: ${err2}` });
                    }
                });
            }
        });
    } else {
        callback(400, { error: 'Please input all data' });
    }
};

handler._user.put = (requestPropertise, callback) => {
    const firstName = typeof requestPropertise.body.firstName === 'string' && requestPropertise.body.firstName.trim().length > 0 ? requestPropertise.body.firstName : false;
    const lastName = typeof requestPropertise.body.lastName === 'string' && requestPropertise.body.lastName.trim().length > 0 ? requestPropertise.body.lastName : false;


    const password = typeof requestPropertise.body.password === 'string' && requestPropertise.body.password.trim().length >= 6 ? requestPropertise.body.password : false;

    if (phone) {
            if (!requestPropertise.headersObject.token) {
           callback(403,{"error":"token need"}) ;
           return;
        }
        tokenHandeler._token.verify(requestPropertise.headersObject.token, phone, (err) => {
            if (!err) {
                callback(403, { "error": "Unauthenticated" })
                return;
            }
        })
        if (lastName || firstName || phone) {
            userData.read('users', phone, (err, udata) => {
                const data = { ...parseJson(udata) }
                if (!err && data) {

                    if (firstName) {
                        data.firstName = firstName
                    }
                    if (lastName) {
                        data.lastName = lastName
                    }
                    if (password) {
                        data.password = hasingPassword(password)
                    }
                    userData.update('users', phone, data, (err2) => {
                        if (!err2) {
                            callback(200, { message: "User updated successfully" });
                        } else {
                            callback(500, { error: err2 }); // actual error
                        }
                    });


                } else {
                    callback(404, { 'error': "Error to pput" })
                }
            })
        } else {
            callback(404, { 'error': "Nothing to change" })
        }
    } else {
        callback(404, { 'error': "your not the author of this acount" })
    }
}
handler._user.delete = (requestPropertise, callback) => {
    const phone = typeof requestPropertise.quaryStringObject.phone === 'string' && requestPropertise.quaryStringObject.phone.trim().length > 0 ? requestPropertise.quaryStringObject.phone : false;

    if (phone) {
            if (!requestPropertise.headersObject.token) {
           callback(403,{"error":"token need"}) ;
           return;
        }
        tokenHandeler._token.verify(requestPropertise.headersObject.token, phone, (err) => {
            if (!err) {
                callback(403, { "error": "Unauthenticated" })
                return;
            }
        })
        userData.read('users', phone, (err, data) => {
            if (!err && data) {
                userData.delete('users', phone, (error) => {
                    if (!error) {
                        callback(200, { "message": "User deleted successfully" });
                    } else {
                        callback(500, { "error": error });
                    }
                });
            } else {
                callback(404, { "error": "User not found" });
            }
        });
    } else {
        callback(400, { "error": "Invalid phone number" });
    }
};

module.exports = handler;