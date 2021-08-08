// SPDX-License-Identifier: MIT
pragma solidity >=0.4.11;

contract MillionEtherPage {
    struct Pixel {
    address owner;
    uint soldPrice;
    uint[] color;
    }
    
    Pixel[1000][1000] public pixels;
    
    mapping(address => uint) public pendingRefunds;
    
    event PixelChanged(
        uint x, 
        uint y,
        address owner, 
        uint soldPrice, 
        uint[] color
    );
        
  function colorPixel(uint x, uint y, uint[] memory color) payable public {
    Pixel storage pixel = pixels[x][y];
    require(msg.value > pixel.soldPrice);
    
    if(pixel.owner != address(0x0)) {
        pendingRefunds[pixel.owner] += pixel.soldPrice;
    }
    
    pixel.owner = msg.sender;
    pixel.soldPrice = msg.value;
    pixel.color = color;
    
    emit PixelChanged(x, y, pixel.owner, pixel.soldPrice, pixel.color);
  }
    
  function withdrawRefunds() public {
      address payable payee = payable(msg.sender);
      uint payment = pendingRefunds[payee];
      
      require(payment != 0);
      require(address(this).balance >= payment);
      
      pendingRefunds[payee] = 0;
      require(payee.send(payment));
  }
}
