/*
Title : Up time monitoring application
*/

const http = require('http');
const { handleReqRes } = require('./helper/handle_req_res')
const environment = require('./helper/env_setup')
const crudFile = require('./data_crud/data')
const twilio = require('./helper/notification')
const server = require('./data_crud/server')
const worker = require('./data_crud/worker')
// Scaffolding
const app = {};


app._init = () => {
    server.init();
    worker.init()
}
app._init()