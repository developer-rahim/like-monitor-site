const { sampleHander } = require('../route_handler/sample_handler')
const { userHander } = require('../route_handler/user_handler')
const { tokenHander } = require('../route_handler/token_handaler')

const routesPath = {

    sample: sampleHander,
    user:userHander,
    token:tokenHander
};

module.exports = { routesPath };