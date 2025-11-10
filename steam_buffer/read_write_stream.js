const fileSys = require('fs')
const server=require('http')
const ourSteamRead = fileSys.createReadStream(`${__dirname}/big_data.txt`);
const ourSteamWrite = fileSys.createWriteStream(`${__dirname}/output_data.txt`);
// ourSteamRead.on('data', (textData) => {
//      console.log(textData.toString());
// });
const dataServer =server.createServer((req, res)=>{
ourSteamRead.pipe(res)
})

const port=3000;
dataServer.listen(port)