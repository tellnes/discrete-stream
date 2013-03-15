var assert = require('assert')
  , discrete = require('..')
  , Transform = require('stream').Transform || require('readable-stream/transform')

var t = new Transform()
t._transform = function transform(chunk, encoding, cb) {
  process.nextTick(function () {
    if (!chunk.length) return cb()

    t.push(chunk.slice(0, 1))
    transform(chunk.slice(1), encoding, cb)
  })
}

var inp = new discrete.Encoder()
var out = new discrete.Decoder({ objectMode: true })

inp.pipe(t).pipe(out)

var messages =  [ 'hello'
                , 'world'
                , 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
                ]


var sent = []

function write(err) {
  if (err) throw err
  var message = messages.shift()
  if (!message) return

  sent.push(message)
  inp.write(message, write)
}
write()

setTimeout(function () {
  out.on('data', function (chunk) {
    var message = sent.shift()
    assert.equal(chunk.toString(), message)
    console.log(message)
  })
}, 10)
