const memoryInspector = require('./src');

// memoryInspector({
//   url: 'http://127.0.0.1:8080',
//   delay: 300,
//   maxMemoryLimit: 20 * 1048576, // should not pass of 20MB
//   maxMemoryPercentThreshold: 90, // should not pass 90% of total memory
// }).then((info) => {
//   console.log(info)
// })

module.exports = memoryInspector.default ? memoryInspector.default : memoryInspector
