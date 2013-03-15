# discrete-stream

`discrete-stream` ensures that the chunks you put in on one end will come out in the same size on the other side.

## Example

Node 1
```js
var en = discrete.Encoder()
en.pipe(socket)
en.write('Hello World')
```

Node 2
```js
var de = discrete.Decoder()
socket.pipe(de)
de.on('readable', function () {
  var message
  while((message = de.read()) !== null)
    console.log(message)
})
```

## Install

    $ npm install discrete-stream

## API

### discrete.Encoder(options)
### discrete.Decoder(options)

Inherits from [transform stream](http://nodejs.org/api/stream.html#stream_class_stream_transform).

The encoder transforms an input stream to the `discrete` protocol.
The decoder transforms a `discrete` stream back to correctly sliced buffers.

`options` (object)

 - `prefixBytes` How many bytes the size prefix header should use. Defaults to `4`
 - `prefixEndian` If we should use big or little endians. Defaults to big endians.
 - Other options in [transform stream](http://nodejs.org/api/stream.html#stream_class_stream_transform)

## License

MIT
