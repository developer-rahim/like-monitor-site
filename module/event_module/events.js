'use strict';

// Must declar with new Keyword

const { Shcool, Shcool2 } = require('./events_export')

const startPeriod = new Shcool();
const startPeriod2 = new Shcool2();
// 🔹 1. Simple string event
startPeriod.on('event', (period) => {
  console.log('Static', period);
});
startPeriod.emit('event', 'Static Event Calling');


// 🔹 2. Object-based event
startPeriod.on('objectEvent', ({ period }) => {
  console.log('Object Event', period);
});
startPeriod.emit('objectEvent', { period: 'Object Event Calling' });




startPeriod.startPeriod();

startPeriod.emit('belling')



startPeriod2.startPeriod2();
startPeriod2.emit('belling2')










