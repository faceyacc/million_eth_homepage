pragma solidity ^0.4.11;

contract MillionEtherPage {
  bytes3[1000][1000] public pixels;
  event PixelChanged(
    uint x,
    uint y,
    bytes3 color
  );

  function colorPixel(uint x, uint y, bytes3 color) {
    pixels[x][y] = color;
    PixelChanged(x, y, color);
  }
}