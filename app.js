var mongoUrl = 'mongodb://localhost:27017/board';

var express = require('express')
var app = express()
var bodyParser = require('body-parser')

var MongoClient = require('mongodb').MongoClient
var assert = require('assert')

app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.post('/item', function(req, res) {
  // { x: 439.23049, y: 286.64455, width: 68.71089, height: 68.71089 }
  var body = req.body
  var bounds = body.bounds
  var item = body.item
  var posMin = [ bounds.x, bounds.y ]
  var posMax = [ bounds.x + bounds.width, bounds.y + bounds.height ]
  console.log(body)
  store({
    posMin: posMin,
    posMax: posMax,
    item: body
  })
  res.send({'ok': true})
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

function store(item) {
  mongoConnect(function(db) {
    var coll = db.collection('items')
    coll.insertOne(item.item, function(err, result) {
      if (err !== null) return
      var objId = result.insertedId
      storeCoordinates(db, objId, item)
    })
  })
}

function storeCoordinates(db, objId, item) {
  var coll = db.collection('coordinates')
  coll.insertMany([
    { pos: item.posMin, obj: objId },
    { pos: item.posMax, obj: objId, isMax: true }
  ], deferCloseDB(db))
}

function deferCloseDB(db) {
  return function() {
    db.close()
  }
}

function mongoConnect(callback) {
  MongoClient.connect(mongoUrl, function(err, db) {
    assert.equal(null, err)
    //console.log("Connected correctly to server")
    if (err === null) {
      callback(db)
    }
  })
}
