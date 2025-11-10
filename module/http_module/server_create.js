// const http= require('http');

// const dataServer=http.createServer((req,res)=>{
//       res.writeHead(200, { 'Content-Type': 'text/plain' });
// res.write('Hello Programmer');
// res.end();
// });
// dataServer.listen(3000)

// console.log('Server run on ${serverPort}');



'use strict';

const http = require('http');

// Create and handle requests
const dataServer = http.createServer((req, res) => {
  // ✅ Always send headers first
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write('Hello Programmer!rrrrrrrrrrrrrrr');
  res.end();
});

// Server port
const serverPort = 3000;

// Start listening
dataServer.listen(serverPort,);
