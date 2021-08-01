var Web3 = require('web3');

var web3 = new Web3();

web3.setProvider(
  new Web3.providers.WebsocketProvider(
    'ws://localhost:8546'
  )
);

const abi = require('./MillionEtherPage.abi.json');
const mepAddress = '';

let mep = new web3.eth.Contract(abi, mepAddress);

function draw() {
  let canvas = document.getElementById('canvas');
  if (canvas.getContext) {
    let ctx = canvas.getContext('2d');

    let imageData = ctx.getImageData(
      0,
      0,
      canvas.width,
      canvas.height
    );
    let data = imageData.data;
    console.log(canvas.width, canvas.height, data.length);

    function writePixelWithEvent(event) {
      let { x, y, color } = event.returnValues;
      writePixel(
        parseInt(x),
        parseInt(y),
        parseColor(color)
      );
    }

    function parseColor(rawColor) {
      let rgb = [];
      for (let i = 0; i < rawColor.length; i += 2) {
        let chunk = rawColor.substring(i, i + 2);
        if (chunk !== '0x') {
          rgb.push(parseInt(chunk, 16).toString(10));
        }
      }
      return rgb;
    }

    function writePixel(x, y, color) { 
      console.log(x, y, color);
      let data = imageData.data;
    
      let columns = canvas.width;
      let rows = canvas.height;
    
      let i = (y * columns + x) * 4;
      data[i] = color[0];
      data[i + 1] = color[1];
      data[i + 2] = color[2];
    
      data[i + 3] = 255;
    
      ctx.putImageData(imageData, 0, 0);
    }

    mep.events.PixelChanged(
      {
        fromBlock: 0
      },
      function(error, event) {
        console.log('new event : ', event);
        writePixelWithEvent(event);
      }
    );
    
    mep.getPastEvents(
      'PixelChanged',
      {
        fromBlock: 3
      },
      function(error, events) {
        console.log('event : ', events);
        events.map(e => writePixelWithEvent(e));
      }
    );

  }
}

document.body.onload = function() {
  draw();
  checkBalance();
};