var express = require('express')
var path = require('path')
var app = express()

app.use('/node_modules', express.static('node_modules'))
app.use('/js', express.static('js'))

app.get('/', function (req, res) {
  res.sendFile('index.html', { root : __dirname})
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

