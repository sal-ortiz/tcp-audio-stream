
const Net = require('net');
const Readable = require("stream").Readable;


class AudioServer {

  constructor(audioEngine) {
    let server = new Net.Server();
    let stream = new Readable();

    server.on('connection', this.constructor.initialize.bind(this));
    server.on('listening', this.constructor.up.bind(this));
    server.on('close', this.constructor.down.bind(this));

    this.engine = audioEngine
    this.connection = server;

    this.stream = stream;
    this.socket = undefined;
  }

  start(port, address) {
    this.connection.listen(...arguments);
  }

  stop() {
    this.connection.close();
    this.stream.stop();
  }

  //write(data) {
  //  this.connection.write(data);
  //}

  static up() {
    // NOTE: executed from within the context of a class instance.
    this.engine.start();
  }

  static down() {
    this.engine.quit();
  }

  static initialize(socket) {
    // NOTE: executed from within the context of a class instance.
    socket.on('end', this.constructor.deinitialize.bind(this));
    socket.on('data', this.constructor.input.bind(this));
    socket.on('error', this.constructor.error.bind(this));
  }

  static deinitialize() {
    // NOTE: executed from within the context of a class instance.
    // clean up.


  }

  static input(data) {
    // NOTE: executed from within the context of a class instance.
    this.stream.push(data);
  }

  static error(err) {
    // NOTE: executed from within the context of a class instance.
    throw err;
  }

}


module.exports = AudioServer;
