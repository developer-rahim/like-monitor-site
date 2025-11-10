const mathLibery=require('./math')
const quoatedLibery=require('./quaote')

const app ={};
app.config={
    intervelTime:1000
}

app.printAQuoate=function (){

const  allQuoated=quoatedLibery.getQuoates();

const specifiqNumbwe=mathLibery.generateRanNum(1,allQuoated.length) 

console.log(allQuoated[specifiqNumbwe])

}

app.printAQuoate();