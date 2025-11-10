/*
Title : Up time monitoring application
*/

const http = require('http');
const { handleReqRes } = require('./helper/handle_req_res')
const environment=require('./helper/env_setup')
const crudFile=require('./data_crud/data')
// Scaffolding
const app = {};

// Data create
// crudFile.create('file_crud','write_file',{'name':'Addul Rahim','Age':29},(err)=>{
// console.log(err);
// })

/// Read file
// crudFile.read('file_crud','write_file',(err,data)=>{
// console.log(err,data);
// })


// Update file
// crudFile.update('file_crud','write_file',{'name':'Addul Rahim Update','Age':30},(err)=>{
// console.log(err);
// })

// delete file
// crudFile.delete('file_crud','write_file',(err)=>{
// console.log(err);
// })

app.createServer = () => {
    const server = http.createServer(app.handleReqRes);

    server.listen(environment.port, () => {
        console.log(`Environment variable is : ${process.env.NODE_ENV}`)
        console.log(`Lising to port number ${environment .port}`)
    })
}

app.handleReqRes = handleReqRes;
// Server function call

app.createServer();