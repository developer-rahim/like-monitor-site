
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
utiles.randomStringGenerate = (stringLength) => {
  if (typeof stringLength === 'number' && stringLength > 0) {
    const possibleCharacters = 'abcdefghijklmnopqrstuvwxyz1234567890';
    let output = '';

    for (let i = 0; i < stringLength; i++) {
      const randomChar = possibleCharacters.charAt(
        Math.floor(Math.random() * possibleCharacters.length)
      );
      output += randomChar;
    }

    return output;
  } else {
    return false;
  }
};

module.exports = utiles;