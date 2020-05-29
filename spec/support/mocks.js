
const Path = require('path');

const libPath = Path.join(__dirname, 'mocks');
const AudioInputStream = require(Path.join(libPath, 'audio_input_stream.js'));
const AudioOutputStream = require(Path.join(libPath, 'audio_output_stream.js'));


class Mocks {

  static get AudioInput() {
    return AudioInputStream;
  }

  static get AudioOutput() {
    return AudioOutputStream;
  }

}


module.exports = Mocks;
