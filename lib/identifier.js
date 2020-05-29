
const MD5 = require('nano-md5');


class Identifier {

  static generate(input) {
    let seed = input;

    if (!seed) {
      let radix = parseInt(Math.random() * 35) + 2;
      let timestamp = Date.now();

      seed = MD5.fromBytes(this.name)
        + MD5.fromBytes(timestamp.toString(radix));

    }

    return MD5.fromBytes(seed).toHex();
  }

}


module.exports = Identifier;
