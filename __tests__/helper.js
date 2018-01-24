import http from 'http'
import fs from 'fs'
import path from 'path'

export function startServer(page, port) {
  const app = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'})
    const pagePath = path.resolve(__dirname, 'fixtures', page + '.html')
    res.end(fs.readFileSync(pagePath), 'utf-8')
  })

  app.listen(port)
  return app
}
