const EventEmitterClasss = require('events')

//const evenVariable=new EventEmitterClasss()

class Shcool extends EventEmitterClasss {
    startPeriod() {
        this.on('belling', function () {
            console.log('School class called belling')
        })
    }
}
class Shcool2 extends EventEmitterClasss {
    startPeriod2() {
        this.on('belling2', function () {
            console.log('School2 class called belling')
        })
    }
}

module.exports = { Shcool, Shcool2 };
