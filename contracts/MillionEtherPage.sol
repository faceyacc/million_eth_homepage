// SPDX-License-Identifier: MIT
pragma solidity >=0.4.11;

contract MillionEtherPage {
    
    
    bytes3[1000][1000] public pixels;


    function colorPixel(uint256 x, uint256 y, bytes3 color) public {
        pixels[x][y] = color;
        
  }
}