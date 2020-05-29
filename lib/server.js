
const Net = require('net');


class AudioServer {

  constructor(audioEngine) {
    let server = new Net.Server();

    let constr = this.constructor;
    server.on('connection', constr.serverConn.bind(this));
    server.on('listening', constr.serverListening.bind(this));
    server.on('close', constr.serverClose.bind(this));
    server.on('error', constr.serverError.bind(this));

    this.engine = audioEngine
    this.connection = server;

    this.sockets = [];
  }

  start(address, port) {
    this.connection.listen(port, address);
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

  static serverConn(socket) {
    // NOTE: executed from within the context of a class instance.
    let host = socket.remoteAddress;
    let port = this.connection.address().port;

    console.log('SERVER: client connected on port', port, 'from', host);

    let sockId = Identifier.generate();

    let constr = this.constructor;
    let disconnCallback = constr.sockDisconnect.bind(this, sockId);
    let errorCallback = constr.sockError.bind(this, sockId);

    socket.on('close', disconnCallback);
    socket.on('error', errorCallback);

    socket.setNoDelay(true);  // unoptimized, low-latency, traffic
    socket.pipe(this.engine);

    this.engine.start();

    this.sockets.push(socket);
  }


  static serverListening() {
    // NOTE: executed from within the context of a class instance.
    let host = this.connection.address().address;
    let port = this.connection.address().port;

    console.log('SERVER: listening on', host, 'port', port);
  }

  static serverClose() {
    // NOTE: executed from within the context of a class instance.
    let port = this.connection.address().port;

    console.log('SERVER: shutting down port', port);
  }

  static serverError(err) {
    // NOTE: executed from within the context of a class instance.
    throw err;
  }

  static sockDisconnect(sockId, hadErr) {
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
