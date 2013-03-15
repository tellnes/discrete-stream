
var discrete = require('./')
  , net = require('net')

var PORT = 1234

net.createServer(function (socket) {
  var stream = new discrete.Decoder()
  socket.pipe(stream)
  stream.on('readable', function () {
    var line
    while((line = stream.read()) !== null)
      process.stdout.write('< ' + line + '\n> ')
  })
  stream.emit('readable')
}).listen(PORT)

process.stdout.write('> ')

var socket = new discrete.Encoder()
socket.pipe(net.connect(PORT))

process.stdin.setEncoding('utf8')
process.stdin.on('data', function (line) {
  line = line.trim() // Removes \n
  socket.write(line)
})
process.stdin.resume()
