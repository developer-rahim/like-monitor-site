const { sampleHander } = require('../route_handler/sample_handler')
const { userHander } = require('../route_handler/user_handler')

const routesPath = {

    sample: sampleHander,
    user:userHander
};

module.exports = { routesPath };