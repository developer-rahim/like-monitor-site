const handler = {}

handler.notFoundHandler = (requesPropertise, callback) => {
    callback(404, { meaasge: 'Url not found' })
    console.log('no found  Handler');
}

module.exports = handler;