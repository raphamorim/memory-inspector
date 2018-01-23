# memory-inspector

<!-- [START badges] -->
<!-- [END badges] -->

<img src="images/logo.png" height="200" align="right">

> Memory Inspector watchs resident memory size (res) of Web Application.
Currently it runs over Puppeteer, which is an API to control headless Chrome or Chromium over the DevTools Protocol.

#### Installing

```bash
yarn add --dev memory-inspector
```

## Usage

```js
const memoryInspector = require('memory-inspector')

const config = {
  url: 'http://127.0.0.1:8080',
  delay: 300,
  maxMemoryLimit: 20 * 1048576, // 20MB
  maxMemoryPercentThreshold: 20,
}

memoryInspector(config).then((info) => console.log(info))

/*
{ usedJSHeapSize: 10000000,
  totalJSHeapSize: 11900000,
  jsHeapSizeLimit: 2190000000,
  memoryUsagePercent: 438000000,
  timestamp: '2018-01-23T03:05:04.497Z',
  exceededMemoryMaximum: -10971520,
  exceededMemoryUsagePercent: false }
*/

```

## Config

#### url
#### delay

## About

[Raphael Amorim](https://github.com/raphamorim), [MIT License](License)
