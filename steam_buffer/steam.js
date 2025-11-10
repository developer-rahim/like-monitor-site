const httpRes = require('http')



const httpServer = httpRes.createServer((req, res) => {


    if (req.url === '/') {
        res.writeHead(200, ({ 'content-type': 'text/html' }))
        res.write('Root url')

        const homeHtml = `
      <html>
        <head>
          <title>Home Page</title>
        </head>
        <body style="font-family: Arial; text-align: center; margin-top: 50px;">
          <h1>Welcome to My Node.js Server</h1>
          <p>This is the <b>root</b> URL.</p>
          <a href="/process">Go to About Page</a>

          <form method='post' action='/process'> <input name='message'></input></form>
        </body>
      </html>
    `;
        res.write(homeHtml);
        res.end();
    } else if (req.url === '/process' && req.method === 'POST') {
        const body = [];
        req.on('data', ((chunk) => {
            body.push(chunk);
            //  res.write('Thank you for submitting') //Never write in res.on when calls end
        }));

        req.on('end', () => {
            const parseData = Buffer.concat(body).toString();
            res.write('<h2>Thank you for submitting!</h2>');
            res.write(`<p>You sent: ${parseData}</p>`);
            res.end();
        })


        //res.write(parseData);
    } else {
        res.write('Not found')
    }


})

const port = 3000

httpServer.listen(port)