

const { StringDecoder } = require('node:string_decoder');

const { routesPath } = require('../routes/routes_name/routes_file')
const { notFoundHandler } = require('../routes/route_handler/not_found_handler');
const { STATUS_CODES } = require('node:http');
const { parseJson } = require('../helper/utiles')
const reqResHandler = {};

reqResHandler.handleReqRes = ((req, res) => {
    // get the full path and parse it
    const parseUrl = new URL(req.url, `http://${req.headers.host}`);

    const pathName = parseUrl.pathname;
    const trimedPath = pathName.replace(/^\/+|\/+$/g, '')
    // console.log(trimedPath);

    // Get request method
    const reqMethod = req.method.toLowerCase();
    //console.log(reqMethod);

    // Request url Quary perameter
    const quaryStringObject = Object.fromEntries(parseUrl.searchParams);
    // console.log(quaryStringObject)

    /// get header
    const headersObject = req.headers;
   
    // console.log(headersObject);

    const requestPropertise = {
        parseUrl, pathName, trimedPath, reqMethod, quaryStringObject, headersObject,
    }

    console.log(routesPath[trimedPath]);
    const chossenHandeler = routesPath[trimedPath] ? routesPath[trimedPath] : notFoundHandler;


    // Post request body parse
    const strigndecorder = new StringDecoder('utf-8');
    let realData = '';
    req.on('data', (buffer) => {
        realData += strigndecorder.write(buffer);
    })

    req.on('end', () => {
        realData += strigndecorder.end();
        requestPropertise.body=parseJson(realData);
        //called chossen handler
        chossenHandeler(requestPropertise, (statusCode, playload) => {
            statusCode = typeof (statusCode) === 'number' ? statusCode : 500;
            playload = typeof (playload) === 'object' ? playload : {};
            playloadStirng = JSON.stringify(playload);

            
            res.writeHeader(statusCode, { 'Content-Type': 'application/json' });
            res.end(playloadStirng);
        });
        //console.log(realData);
        // res.end('Hello Progremmner Check ');
    })

});

module.exports = reqResHandler;