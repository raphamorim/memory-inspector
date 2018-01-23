const memoryInspector = require('./src');

memoryInspector({
  url: 'http://127.0.0.1:8080',
  delay: 300,
  maxMemoryLimit: 20 * 1048576, // 20MB
  maxMemoryPercentThreshold: 20,
}).then((info) => {
  console.log(info)
})
