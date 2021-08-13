const getPixels = require('get-pixels');
const Web3 = require('web3');
const web3 = new Web3();

web3.setProvider(
  new web3.providers.HttpProvider('http://localhost:8545')
);

let imagePath = process.argv[2];
let xPos = parseInt(process.argv[3]);
let yPos = parseInt(process.argv[4]);
console.log(imagePath, xPos, yPos);

const abi = require('../src/MillionEtherPage.abi.json');
const mepAddress = '';
let mep = new web3.eth.Contract(abi, mepAddress);

const fromAccount = '';

function dec2hex(dec) {
  return ('00' + parseInt(dec, 10).toString(16)).slice(-2);
}

getPixels(imagePath, function(err, pixels) {

  let [
    frames,
    width,
    height,
    channels
  ] = pixels.shape.slice();

  console.log(
    `Shape: ${width}x${height} (${width *
      height} total pixels)`
  );

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let r = pixels.get(0, x, y, 0);
      let g = pixels.get(0, x, y, 1);
      let b = pixels.get(0, x, y, 2);

      console.log(
        { x: x, y: y },
        ['0x', dec2hex(r), dec2hex(g), dec2hex(b)].join('')
      );

      console.log()

      let original = ['0x', dec2hex(r), dec2hex(g), dec2hex(b)].join('')
      console.log('Original:', original)
      console.log(typeof(original))

      console.log()

      let modified = [['0x', dec2hex(r)].join(''), ['0x', dec2hex(g)].join(''), ['0x', dec2hex(b)].join('')]
      console.log('Modified:', modified)
      console.log(typeof(modified))

      console.log()

      mep.methods.colorPixel(xPos + x, yPos + y, modified)
      .send({ from: fromAccount, value: 1000000000000 })
    }
  }
});