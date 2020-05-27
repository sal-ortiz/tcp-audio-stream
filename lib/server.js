
const Net = require('net');


class AudioServer {

  constructor(audioEngine) {
    let server = new Net.Server();

    server.on('connection', this.constructor.connection.bind(this));
    server.on('listening', this.constructor.initialize.bind(this));
    server.on('close', this.constructor.deinitialize.bind(this));
    server.on('error', this.constructor.error.bind(this));

    this.engine = audioEngine
    this.connection = server;

    this.sockets = [];
  }

  start(port, address) {
    this.connection.listen(...arguments);
  }

  stop() {
    this.connection.close();
    this.engine.quit();

    for (let idx = 0; idx < this.sockets.length; idx++) {
      let socket = this.sockets[idx];

      socket.end();
      //socket.destroy();
    }

  }

  static connection(socket) {
    // NOTE: executed from within the context of a class instance.
    let host = socket.remoteAddress;
    let port = this.connection.address().port;

    console.log('SERVER: client connected on port', port, 'from', host);

    socket.on('close', this.constructor.disconnection.bind(this));
    socket.on('error', this.constructor.error.bind(this));

    socket.setNoDelay(true);  // unoptimized, low-latency, traffic

    //socket.pipe(this.engine);

    socket.on('data', ((chunk) => {
      this.engine.write(chunk);
    }).bind(this));

    this.engine.on('drain', (() => {
      // audio buffer ready for more data!
    }).bind(this));

    this.engine.start();

    this.sockets.push(socket);
  }

  static disconnection() {
    // NOTE: executed from within the context of a class instance.
    let port = this.connection.address().port;

    console.log('SERVER: client disconnected from port', port);
  }

  static initialize() {
    // NOTE: executed from within the context of a class instance.
    let host = this.connection.address().address;
    let port = this.connection.address().port;

    console.log('SERVER: listening on', host, 'port', port);
  }

  static deinitialize() {
    // NOTE: executed from within the context of a class instance.
    let port = this.connection.address().port;

    console.log('SERVER: shutting down port', port);
  }

  static error(err) {
    // NOTE: executed from within the context of a class instance.
    throw err;
  }

}


module.exports = AudioServer;
