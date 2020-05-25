
const Net = require('net');
const Writable = require("stream").Writable;


class AudioClient {

  constructor(audioEngine) {
    let client = new Net.Socket();
    let stream = new Writable();

    client.on('error', this.constructor.error.bind(this));
    client.on('connect', this.constructor.initialize.bind(this));
    client.on('end', this.constructor.deinitialize.bind(this));

    audioEngine.on('data', this.constructor.input.bind(this));

    this.engine = audioEngine;
    this.connection = client;

    this.stream = stream;
    this.socket = undefined;
  }

  connect(host, port) {
    let socket = this.connection.connect(port, host);

    this.socket = socket;
  }

  disconnect() {
    this.connection.end();
  }

  static initialize() {
    // NOTE: executed from within the context of a class instance.

    this.engine.start();
  }

  static deinitialize() {
    // NOTE: executed from within the context of a class instance.
    this.engine.quit();
  }

  static input(data) {
    // NOTE: executed from within the context of a class instance.
    this.stream.write(data);
  }

  static error(err) {
    // NOTE: executed from within the context of a class instance.
    throw err;
  }

}


module.exports = AudioClient;
