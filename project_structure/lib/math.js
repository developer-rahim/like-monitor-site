const math ={}

math.generateRanNum=function(min,max){
let minium=min;
let maximun=max;

minium = typeof minium==='number'?minium:0;
maximun =typeof maximun==='number'?maximun:0;
return Math.floor(Math.random()*(maximun-minium+1)+min);

}
module.exports=math;