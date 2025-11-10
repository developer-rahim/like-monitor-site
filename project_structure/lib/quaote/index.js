const fileSys=require('fs');
const quoates={};

quoates.getQuoates=function(){
    const fileContent=fileSys.readFileSync(`${__dirname}/quaotes.txt`,'utf8');
    const arrayOfQuates=fileContent.split(/\r?\n/); 
    return arrayOfQuates;
}
module.exports=quoates;