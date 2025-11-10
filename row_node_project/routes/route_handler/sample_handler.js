const handler = {}

handler.sampleHander = (request, callback) => {
    callback(200, { meassge: 'this is sample url' });
    console.log(request);
}

module.exports = handler;