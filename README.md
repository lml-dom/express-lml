# express-lml
Express view engine for [LML](https://github.com/lml-dom/lml-js) - an HTML alternative

## Install
In your express.js project directory:
`npm install express-lml --save-dev`

## Usage
use the exported loader and pass your express app instance:
`loadViewEngine(app);`

You can also pass options for parsing and output (to minify, order attributes etc):
`loadViewEngine(app, {parse: parseConfig, output: outputConfig});`
See [LML README](https://github.com/lml-dom/lml-js) for available options.

## Example
`views/index.lml`:
```lml
!DOCTYPE html
html
  head
    title ; hello
  body
    h1 ; hello world!
```

`app.js`:
```javascript
const express = require('express');
const expressLML = require('express-lml');

const app = express();
const port = 3000;

expressLML.loadViewEngine(app);

// default folder for your LML files
app.set('views', './views');

app.get('/', function (req, res) {
  res.render('index');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
```
