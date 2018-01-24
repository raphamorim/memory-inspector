import MemoryInspector from '../index'
import { startServer, finishServer } from './helper'

describe('Inspect operations', () => {
  it('should inspect lighter', (done) => {
    const port = 3002
    const app = startServer('simple', port)

    const report = MemoryInspector({
      url: 'http://127.0.0.1:' + port,
      delay: 0,
      maxMemoryLimit: 20 * 1048576,
      maxMemoryPercentThreshold: 90,
    }).then((info) => {
      expect(typeof info).toEqual('object')
      expect(info).toEqual({
        "exceededMemoryMaximum": -10971520,
        "exceededMemoryUsagePercent": false,
        "jsHeapSizeLimit": 2190000000,
        "memoryUsagePercent": 1971000000,
        "totalJSHeapSize": 10000000,
        "usedJSHeapSize": 10000000
      })
      app.close()
      done()
    })
  })

  it('should inspect heavy memory usage', (done) => {
    const port = 3003
    const app = startServer('heavy-memory', port)

    const report = MemoryInspector({
      url: 'http://127.0.0.1:' + port,
      delay: 0,
      maxMemoryLimit: 1 * 1048576, // 1MB
      maxMemoryPercentThreshold: 1, // 1% of 1MB
    }).then((info) => {
      expect(typeof info).toEqual('object')
      expect(info).toEqual({
        "exceededMemoryMaximum": 1528951424,
        "exceededMemoryUsagePercent": true,
        "jsHeapSizeLimit": 2190000000,
        "memoryUsagePercent": 21900000,
        "totalJSHeapSize": 1530000000,
        "usedJSHeapSize": 1530000000
      })

      app.close()
      done()
    })
  })
})
