const puppeteer = require('puppeteer')
const createServer = require('./createServer')
const portNumber = 8585

module.exports = async (config) => {
  const {
    evaluate,
    delay,
    maxMemoryLimit,
    maxMemoryPercentThreshold,
    waitUntil,
    formatted,
  } = config || {}

  let { url, server } = config

  if (evaluate) {
    server = createServer(portNumber)
    url = 'http://localhost:' + portNumber
  }

  const browser = await puppeteer.launch({
    slowMo: delay,
    options: {
      args: [
        '--enable-precise-memory-info',
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ]
    }
  })
  const page = await browser.newPage()

  page.once('requestfailed', () => {
    console.log(JSON.parse('{"error": "requestfailed"}'))
    process.exit(1)
  })

  await page.goto(url, {
    timeout: 10000,
    waitUntil: waitUntil || ['domcontentloaded'],
  });

  await page.evaluate(`window.maxMemoryPercentThreshold = ${maxMemoryPercentThreshold}`)
  await page.evaluate(`window.maxMemoryLimit = ${maxMemoryLimit}`)

  if (formatted === false) {
    await page.evaluate(`window.formatted = false`)
  } else {
    await page.evaluate(`window.formatted = true`)
  }

  await page.evaluateHandle(evaluate())

  const memory = await page.evaluate(() => {
    const { usedJSHeapSize, totalJSHeapSize, jsHeapSizeLimit } = window.performance.memory
    const memoryUsagePercent = (window.maxMemoryPercentThreshold / 100) * jsHeapSizeLimit

    function bytesToSize(bytes) {
      if (window.formatted === false) {
        return bytes
      }

      if (bytes == 0) {
        return '0 Bytes'
      }

      var k = 1000,
        decimalpoint = 3,
        sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(decimalpoint)) + ' ' + sizes[i]
    }

    return {
      usedJSHeapSize: bytesToSize(usedJSHeapSize),
      totalJSHeapSize: bytesToSize(totalJSHeapSize),
      jsHeapSizeLimit: bytesToSize(jsHeapSizeLimit),
      memoryUsagePercent: memoryUsagePercent,

      // Check if we've exceeded absolute memory limit
      exceededMemoryMaximum: usedJSHeapSize - window.maxMemoryLimit,
      // Check if we've exceeded relative memory limit for client
      exceededMemoryUsagePercent: usedJSHeapSize > memoryUsagePercent,
    }
  });

  await browser.close()
  await server.close()
  return memory
};
