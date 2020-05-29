
const Net = require('net');


class AudioClient {

  constructor(audioEngine) {
    let client = new Net.Socket();

    client.on('error', this.constructor.error.bind(this));
    client.on('connect', this.constructor.clientConnected.bind(this));
    client.on('end', this.constructor.clientDisconnected.bind(this));

    this.engine = audioEngine;
    this.connection = client;
  }

  connect(host, port) {
    this.connection.connect(port, host);
  }

  disconnect() {
    this.engine.quit();

    this.connection.end();
  }

  static clientConnected() {
    // NOTE: executed from within the context of a class instance.
    let host = this.connection.address().address;
    let port = this.connection.address().port;

    console.log('CLIENT: connected to', host, 'via local port', port);

    this.engine.pipe(this.connection);

    this.engine.start();
  }

  static clientDisconnected() {
    // NOTE: executed from within the context of a class instance.
    let host = this.connection.address().address;
    let port = this.connection.address().port;

    console.log('CLIENT: connected to', host, 'on port', port);
  }

  static error(err) {
    // NOTE: executed from within the context of a class instance.
    throw err;
  }

}


module.exports = AudioClient;
