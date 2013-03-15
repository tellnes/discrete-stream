
var util = require('util')
  , Transform = require('stream').Transform || require('readable-stream/transform')
  , Parser = require('stream-parser')
  , debug = require('debug')('discrete-stream')



function DiscreteState(options) {
  this.headerLength = options.headerBytes || 4
  this.headerType = 'UInt' + (this.headerLength * 8) + (options.headerEndian === 'little' ? 'L' : 'B') + 'E'
}



function DiscreteEncoder  (options) {
  if (!(this instanceof DiscreteEncoder))
    return new DiscreteEncoder(options)

  options = options || {}
  this._discreteState = new DiscreteState(options)

  Transform.call(this, options)
}
util.inherits(DiscreteEncoder, Transform)
exports.Encoder = DiscreteEncoder

DiscreteEncoder.prototype._transform = function (buffer, encoding, cb) {
  debug('writing a %s bytes message', buffer.length)
  var length = new Buffer(this._discreteState.headerLength)
  length['write' + this._discreteState.headerType](buffer.length, 0)
  this.push(length)
  this.push(buffer)
  cb()
}



function DiscreteDecoder(options) {
  if (!(this instanceof DiscreteDecoder))
    return new DiscreteDecoder(options)

  options = options || {}
  this._discreteState = new DiscreteState(options)

  options.objectMode = true
  Transform.call(this, options)

  this._readHeader()
}
util.inherits(DiscreteDecoder, Transform)
Parser(DiscreteDecoder.prototype)
exports.Decoder = DiscreteDecoder

DiscreteDecoder.prototype._readHeader = function () {
  this._bytes(this._discreteState.headerLength, this._onHeader)
}

DiscreteDecoder.prototype._onHeader = function (length) {
  length = length['read' + this._discreteState.headerType](0)
  debug('got message header, body size is %s bytes', length)

  if (length === 0) {
    this._onBody(new Buffer(0))
    return
  }

  this._bytes(length, this._onBody)
}

DiscreteDecoder.prototype._onBody = function (body) {
  debug('got message body')
  this.push(body)
  this._readHeader()
}
