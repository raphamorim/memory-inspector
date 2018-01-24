const puppeteer = require('puppeteer')

module.exports = async (config) => {
  const {
    delay,
    url,
    maxMemoryLimit,
    maxMemoryPercentThreshold,
    waitUntil,
    formatted,
  } = config || {}

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

  const memory = await page.evaluate(() => {
    const { usedJSHeapSize, totalJSHeapSize, jsHeapSizeLimit } = window.performance.memory
    const memoryUsagePercent = (window.maxMemoryPercentThreshold / 100) * jsHeapSizeLimit

    function bytesToSize(bytes) {
      if (window.formatted === false) {
        return bytes
      }

      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
      if (bytes === 0) return '0 Byte'
      const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10)
      if (i === 0) return `${bytes} ${sizes[i]})`
      return `${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`
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
  return memory
};
