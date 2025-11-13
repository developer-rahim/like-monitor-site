const userData = require('../../data_crud/data')
const { hasingPassword } = require('../../helper/utiles')
const { parseJson } = require('../../helper/utiles')
const { randomStringGenerate: tokenGenerate } = require('../../helper/utiles')
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
  const id = typeof requestPropertise.quaryStringObject.id === 'string' && requestPropertise.quaryStringObject.id.trim().length > 0 ? requestPropertise.quaryStringObject.id : false;
  if (id) {
    userData.read('tokens', id, (err, tokendata) => {
      const user = { ...parseJson(tokendata) }
      if (!err && user) {

        callback(200, user)
      }
    })
  } else {
    callback(400, { "error": 'Not found user' })
  }


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
          let expireData = Date.now() + 60 * 60 * 1000;
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
handler._token.put = (requestPropertise, callback) => {
  const id =
    typeof requestPropertise.body.id === 'string' &&
      requestPropertise.body.id.trim().length === 20
      ? requestPropertise.body.id.trim()
      : false;

  const extend =
    typeof requestPropertise.body.extend === 'boolean' &&
    requestPropertise.body.extend === true;

  if (!extend || !id) {
    return callback(400, { error: 'Invalid token ID or missing extend flag' });
  }

  userData.read('tokens', id, (err, tokenData) => {
    if (err || !tokenData) {
      return callback(404, { error: 'Token not found' });
    }

    let token;
    try {
      token = parseJson(tokenData);
    } catch (parseErr) {
      return callback(500, { error: 'Token data corrupted' });
    }

    if (token.expireData <= Date.now()) {
      return callback(400, { error: 'Token already expired' });
    }

    // Extend expiry 1 hour
    token.expireData = Date.now() + 60 * 60 * 60 * 1000;

    // Update token
    userData.update('tokens', id, token, (err2) => {
      if (!err2) {
        return callback(200, { message: 'Token successfully extended', token });
      } else {
        return callback(500, { error: 'Failed to update token file' });
      }
    });
  });
};

handler._token.delete = (requestPropertise, callback) => {
  const id =
    typeof requestPropertise.body.id === 'string' &&
      requestPropertise.body.id.trim().length === 20
      ? requestPropertise.body.id.trim()
      : false;

  if (id) {
    userData.read('tokens', id, (err, data) => {
      if (!err && data) {
        userData.delete('tokens', id, (error) => {
          if (!error) {
            callback(200, { "message": "Token deleted successfully" });
          } else {
            callback(500, { "error": error });
          }
        });
      } else {
        callback(404, { "error": "Token not found" });
      }
    });
  } else {
    callback(400, { "error": "Invalid Token id" });
  }
};
// callback(success, errorObject)
handler._token.verify = (id, phone, callback) => {
  userData.read('tokens', id, (err, tokenData) => {
    if (!err && tokenData) {
      const data = parseJson(tokenData);
      //  console.log('token Data object',data)
      // console.log('phone is ', data.phone === phone)
      // console.log('token is not  expaired  ', data.expireData > Date.now())
      // console.log('given  token is ', id)
      // console.log('store token is ', data.token)
      //console.log('given and and store token is ', data.token === id)
      if (data.phone === phone && data.expireData > Date.now() && data.id === id) {
        callback(true, data); // ✅ send parsed data instead of raw JSON string
      } else {
        callback(false);
      }
    } else {
      callback(false);
    }
  });
};



module.exports = handler;