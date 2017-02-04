var mongoUrl = 'mongodb://localhost:27017/board';

var express = require('express')
var path = require('path')
var app = express()
var bodyParser = require('body-parser')

var MongoClient = require('mongodb').MongoClient
var assert = require('assert')

app.use(bodyParser.json());

app.use('/node_modules', express.static('node_modules'))
app.use('/js', express.static('js'))
app.use('/img', express.static('img'))

app.get('/', function (req, res) {
  res.sendFile('index.html', { root : __dirname})
})

app.get('/item', function (req, res) {
  query(res, {
    x: Number(req.query.x),
    y: Number(req.query.y),
    width: Number(req.query.width),
    height: Number(req.query.height)
  })
})

function query(res, bounds) {
  mongoConnect(function (db) {
    var coll = db.collection('coordinates')
    coll.find(
      {
        pos: { $geoWithin: { $box: [
          [ bounds.x, bounds.y ],
          [ bounds.x + bounds.width, bounds.y + bounds.width ]
        ] } }
      }, { obj: 1, _id: 0 }
    ).map(function (o) { return o.obj })
    .toArray(function (err, itemIds) {
      queryDetails(res, db, itemIds)
    })
  })
}

function queryDetails(res, db, itemIds) {
  var coll = db.collection('items')
  coll.find({ _id: { $in: itemIds } }, { _id: 0 })
    .toArray(function (err, data) {
      db.close()
      res.send(data)
    })
}

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
  ], function() { db.close(); })
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
