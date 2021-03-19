# tcp-audio-stream

A TCP-based low-latency client/server audio stream library utilizing the native [PortAudio](http://portaudio.com/) library.

This library uses the [NodeJS _Net_ API](https://nodejs.org/api/net.html) and the [_Naudiodon_ package](https://www.npmjs.com/package/naudiodon)'s PortAudio bindings.

## setup
To install install, run:<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;```npm install --save-prod tcp-audio-stream```

Be sure to import the _Naudiodon_ library as well:<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;```npm install --save-prod naudiodon```

## components
The library has two main components, a [client](https://github.com/sal-ortiz/tcp-audio-stream/blob/master/lib/client.js) and a [server](https://github.com/sal-ortiz/tcp-audio-stream/blob/master/lib/server.js).

The single _tcp-audio-stream_ library contains both components.
```
const TcpAudioStream = require('tcp-audio-stream);

let Server = TcpAudioStream.Server;
let Client = TcpAudioStream.Client;
```
## usage
Import the [_Naudiodon_](https://www.npmjs.com/package/naudiodon) library from [_NPM_](https://www.npmjs.com/). This dependency was excluded from this package to allow for unique audio configurations. The _tcp-audio-stream_ library takes the configured _Naudiondon_ instance as it's input.

a basic implementation for receiving and playing back audio from a client:
```
const PortAudio = require('naudiodon');
const TcpAudioStream = require('tcp-audio-stream);

const outpEngine = new PortAudio.AudioIO({
    outOptions: {
        channelCount: 2,
        sampleFormat: PortAudio.SampleFormat16Bit,
        sampleRate: 22000,
        deviceId: -1,
        closeOnError: false,
        highWaterMark: 1024,
        framesPerBuffer: 16
    }
});

const server = new TcpAudioStream.Server(outpEngine);

server.start(127.0.0.1, 3000);
```

a basic implementation for sending live audio to a server:
```
const PortAudio = require('naudiodon');
const TcpAudioStream = require('tcp-audio-stream);

const inpEngine = new PortAudio.AudioIO({
    inOptions: {
        channelCount: 2,
        sampleFormat: PortAudio.SampleFormat16Bit,
        sampleRate: 22000,
        deviceId: -1,
        highWaterMark: 1024,
        framesPerBuffer: 16,
    }
});

const client = new TcpAudioStream.Client(inpEngine);

client.connect(127.0.0.1, 3000);
```


A _tcp-audio-stream_ server example can be found [here](https://github.com/sal-ortiz/tcp-audio-stream/blob/master/test_server.js).<br/>
A _tcp-audio-stream_ client example can be found [here](https://github.com/sal-ortiz/tcp-audio-stream/blob/master/test_client.js).

Further details regarding the use of the _Naudiodon_ package can be found [here](https://github.com/Streampunk/naudiodon).
