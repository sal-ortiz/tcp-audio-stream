
const Net = require('net');
const Stream = require('stream');
const Path = require('path');

const targPath = Path.join(__dirname, '..', 'lib');
const Server = require(Path.join(targPath, 'server.js'));

const supportPath = Path.join(__dirname, 'support');
const Mocks = require(Path.join(supportPath, 'mocks.js'));


describe('the Server class', () => {
  const ClassObj = Server;

  const Host = '127.0.0.1';
  const Port = 29577;


  describe('instance', () => {
    let ClassInst;
    let AudioStream;

    beforeEach(() => {
      AudioStream = new Mocks.AudioOutput();
      ClassInst = new ClassObj(AudioStream);
    });

    describe('the start() function', () => {

      it ('starts the network server', () => {
        spyOn(ClassInst.connection, 'listen');

        ClassInst.start(Host, Port);

        expect(ClassInst.connection.listen)
          .toHaveBeenCalledWith(Port, Host);
      });


      it ('pipes the audio stream to oubound network stream', (done) => {
        ClassInst.connection.removeAllListeners('connection');

        ClassInst.connection.on('connection', () => {
          let sock = new Net.Socket();

          spyOn(sock, 'pipe');  // one connection.

          ClassInst.constructor.serverConn.call(ClassInst, sock);

          expect(sock.pipe)
            .toHaveBeenCalledWith(ClassInst.engine);

          ClassInst.stop();

          done();
        });

        ClassInst.start(Host, Port);

        Net.createConnection(Port, Host);
      });


    });

    describe('the stop() function', () => {

      it ('instructs the server to stop listening', () => {
        spyOn(ClassInst.connection, 'close');

        ClassInst.connection.removeAllListeners('close');

        ClassInst.stop();

        expect(ClassInst.connection.close).toHaveBeenCalled();

      });

      it ('ends the instance\'s audio stream', () => {
        spyOn(ClassInst.engine, 'quit');
        ClassInst.connection.removeAllListeners("close");

        ClassInst.stop();

        expect(ClassInst.engine.quit).toHaveBeenCalled();

      });

    });

    describe('on incoming connection', () => {

      it ('starts the instance\'s audio stream', (done) => {
        spyOn(ClassInst.engine, 'start');

        ClassInst.connection.removeAllListeners('connection');

        ClassInst.connection.on('connection', () => {
          let sock = new Net.Socket();


          ClassInst.constructor.serverConn.call(ClassInst, sock);

          sock.removeAllListeners('close');

          expect(ClassInst.engine.start).toHaveBeenCalled();

          ClassInst.stop();

          done();
        });

        ClassInst.start(Host, Port);

        Net.createConnection(Port, Host);
      });

    });

  });

});
