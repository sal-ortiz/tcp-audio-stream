
const Stream = require('stream');
const Path = require('path');

const targPath = Path.join(__dirname, '..', 'lib');
const Client = require(Path.join(targPath, 'client.js'));
const Server = require(Path.join(targPath, 'server.js'));

const supportPath = Path.join(__dirname, 'support');
const Mocks = require(Path.join(supportPath, 'mocks.js'));


describe('the Client class', () => {
  const ClassObj = Client;

  const Host = '127.0.0.1';
  const Port = 29577;

  describe('instance', () => {
    let ClassInst;
    let AudioStream;

    beforeEach(() => {
      AudioStream = new Mocks.AudioInput();
      ClassInst = new ClassObj(AudioStream);
    });

    describe('the connect() function', () => {

      it ('connects to the given endpoint', () => {
        spyOn(ClassInst.connection, 'connect');

        ClassInst.connect(Host, Port);

        expect(ClassInst.connection.connect)
          .toHaveBeenCalledWith(Port, Host);

        ClassInst.disconnect();
      });

      it ('starts the audio input stream', (done) => {
        spyOn(ClassInst.engine, 'start');
        spyOn(ClassInst.engine, 'pipe');

        let server = new Server(new Mocks.AudioOutput());
        server.start(Host, Port);

        ClassInst.connection.removeAllListeners('connect');

        server.connection.removeAllListeners('close');


        ClassInst.connection.on('connect', () => {
          ClassInst.constructor.clientConnected.call(ClassInst);

          expect(ClassInst.engine.start).toHaveBeenCalled();

          server.stop();

          done();
        });

        ClassInst.connect(Host, Port);
      });

      it ('pipes the audio stream to oubound network stream', (done) => {
        spyOn(ClassInst.engine, 'pipe');

        let server = new Server(new Mocks.AudioOutput());

        server.connection.removeAllListeners('close');
        server.start(Host, Port);

        ClassInst.connection.removeAllListeners('connect');

        ClassInst.connection.on('connect', () => {
          ClassInst.constructor.clientConnected.call(ClassInst);

          expect(ClassInst.engine.pipe)
            .toHaveBeenCalledWith(ClassInst.connection);

          server.stop();

          done();
        });

        ClassInst.connect(Host, Port);
      });

    });

    describe('the disconnect() function', () => {

      it ('disconnects the current connection', () => {
        spyOn(ClassInst.connection, 'end');

        ClassInst.disconnect();

        expect(ClassInst.connection.end)
          .toHaveBeenCalled();
      });

      it ('stops the audio input stream', () => {
        spyOn(ClassInst.engine, 'quit');

        ClassInst.disconnect();

        expect(ClassInst.engine.quit)
          .toHaveBeenCalled();
      });

    });

  });

});
