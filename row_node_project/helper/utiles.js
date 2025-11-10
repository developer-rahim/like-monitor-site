
const cripto = require('crypto')
const environment = require('./env_setup')
const utiles = {};
utiles.parseJson = (parseString) => {
    let outPut = {}
    try {
        outPut = JSON.parse(parseString)
    } catch (error) {
        outPut = {}
    }
    return outPut;
}

utiles.hasingPassword = (passwordHasing) => {
    if (typeof passwordHasing === 'string' && passwordHasing.length > 0) {
        const hash = cripto.createHash('sha256', environment.secretKey)

            .update(passwordHasing)
            .digest('hex');

        return hash;
    } else {
        return false;
    }

}
module.exports = utiles;