# memory-inspector

> Memory Inspector watchs resident memory size (res) of Web Application.
Currently it runs over Puppeteer, which is an API to control headless Chrome or Chromium over the DevTools Protocol.

```bash
yarn add --dev memory-inspector
```

## Usage

```js
const memoryInspector = require('memory-inspector')

const config = {
  url: 'http://127.0.0.1:8080', 
  delay: 300
}

memoryInspector(config).then((info) => console.log(info))
```

## Config

#### url
#### delay

## About

[Raphael Amorim](https://github.com/raphamorim), [MIT License](License)
