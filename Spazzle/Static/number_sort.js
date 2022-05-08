/* File: number_sort.js
 * Author: Troy Scites
 * Date: 04/29/2022
 * Description: Sort the numbered tiles in the correct order.
 */


/*
let gameCanvasID = document.getElementById("canvas");
let context = gameCanvasID.getContext("2d");
const gameCanvas = $("#canvas");
const canvas = gameCanvas.get(0);
//const context = canvas.getContext("2d");
*/

// Global variables for this puzzle
let maxNumberSortLevel = 8;
let numFrameHeight = 85;
let numFrameWidth = 85;
let numTileHeight = 75;
let numTileWidth = 75;
let numFrames = [];
let numOrder = [];
let numTiles = [];
let numTileSelected = null;
//let numFrameSelected = null;
let numSortMousePosition = {x: 0, y: 0};
// Sound for when a user drags and drops
let placeSound = new Howl({src: ['/static/sounds/place.mp3'], mute: muted, volume: 1.0});

/*
canvas.height = gameCanvas.height();
canvas.width = gameCanvas.width();
gameCanvas.show();
*/

// The drawNumSort function draws all of the canvas objects based on
// their current attributes.  It also checks to see if all of the
// tiles are in their appropriate frames.
function drawNumSort() {
  //console.log("Drawing number sort");
  $.each(numFrames, (i, frame) => {
    frame.draw(context);
  });
  $.each(numTiles, (i, tile) => {
    tile.draw(context);
  });
  checkNumOrderIsSolved();
}

// The Build number array function creates a random set of numbers
function buildNumArray(level) {
  let totalNumber = 0;
  if ((level + 2) <= maxNumberSortLevel) {
    totalNumber = level + 2;
  } else {
    totalNumber = maxNumberSortLevel;
  }
  for (let i = 0; i < totalNumber; i++) {
    let x = Math.floor(Math.random() * 100);
    if (numOrder.indexOf(x) === -1 ) {
      numOrder.push(x);
    } else {
      i--;
    }
  }
  numOrder.sort(function(a, b){return a-b});
  //console.log("numOrder length: " + numOrder.length);
  //console.log("numOrder: " + numOrder);
}

// The buildNumTiles function builds the tiles for each letter of the
// selected word with a random canvas location.
function buildNumTiles() {
  for (let i=0; i < numOrder.length; i++) {
    //console.log("Building tile for " + numOrder[i]);
    numTiles[i] = randomNumTile(numOrder[i]);
  }
}

// The buildNumSortFrame function creates the frame of boxes centered
// at the bottom of the canvas.
function buildNumSortFrame() {
  //console.log("Building number sort frame");
  let center = gameCanvas.width / 2;
  //console.log("center = " + center);
  let totalWidth = numFrameWidth * numOrder.length;
  //console.log("totalWidth = " + totalWidth);
  let startX = center - (totalWidth / 2.0);
  let Y = gameCanvas.height - numFrameHeight;
  //console.log("startX:" + startX + "  center:" + center + "  Y:" + Y);
  for (let i = 0; i < numOrder.length; i++) {
    let x = startX + (i * numFrameWidth);
    numFrames[i] = new numFrame(x, Y, numFrameWidth, numFrameWidth);
  }
}

// The randomNumTile function generates the random location for the tile
// and assigns the tile's initial attributes.
function randomNumTile(num) {
  let x = Math.floor(Math.random() * (gameCanvas.width - 80) + 10);
  let y = Math.floor(Math.random() * (gameCanvas.height - 200));
  //console.log(letter + "  x:" + x + "  y:" + y);
  return new numTile(x, y, numTileHeight, numTileWidth, num);
}

// The frame function builds a frame object to hold a letter tile.
// The background color is based on if a letter tile is inside the frame,
// and whether that tile's letter matches the one assigned to the frame.
function numFrame(x, y, h, w) {
  this.x = x;
  this.y = y;
  this.height = h;
  this.width = w;
  this.tile = null;
  this.tileX = x + 5;
  this.tileY = y + 5;
  this.matchNumber = 0;
  this.draw = function(context) {
    context.beginPath();
    context.strokeStyle = "black";
    context.lineWidth = 2;
    context.rect(this.x, this.y, this.height, this.width);
    context.fillStyle = "white";
    context.fill();
    context.closePath();
    context.stroke();
  };
  //console.log("Building frame for x:" + this.x + "  y:" + this.y);
}

// The checkWordIsSolved function loops over each frame to see if all
// have a tile assigned and the tile letter matches the frame's letter.
function checkNumOrderIsSolved() {
  let orderCorrect = true;
  for (let i = 1; i < numOrder.length; i++) {
    if (numFrames[i - 1].tile !== null && numFrames[i].tile !== null) {
      if (numFrames[i - 1].matchNumber > numFrames[i].matchNumber) {
        orderCorrect = false;
      }
    } else {
      orderCorrect = false;
    }
  }
  if (orderCorrect) {
    //console.log("Numbers ordered!");
    clearNumSort();
    turnOffNumSortHandlers();
    return winGame = true;
  }
}

// The tile function creates a tile object with the attributes needed
// to manage the tile, moving it into a frame and how to draw it.
function numTile(x, y, h, w, n) {
  this.x = x;
  this.y = y;
  this.height = h;
  this.width = w;
  this.number = n;
  this.selected = false;
  //console.log("Tile x:" + this.x + "  y:" + this.y + "  h:" + this.height + "  w:" + this.width + "  n:" + this.number);
  this.draw = function(context) {
    context.beginPath();
    context.strokeStyle = (this.selected ? "black" : "blue");
    context.lineWidth = 2;
    context.rect(this.x, this.y, this.height, this.width);
    context.closePath();
    context.fillStyle = getTileFillStyle(this);
    context.font = '60px san-serif';
    context.fillText(this.number, this.x + 10, this.y + 60);
    context.stroke();
  };
  this.move = function(x, y) {
    //clearNumSort();
    this.x = x;
    this.y = y;
    //drawNumSort();
  }
}

function getTileFillStyle(tile) {
  if (tile.selected === true) {
    return "black";
  } else {
    let inFrame = false;
    $.each(numFrames, (i, frame) => {
      if (frame.tile === tile) {
        inFrame = true;
      }
    });
    if (inFrame) {
      return "black";
    } else {
      return "white";
    }
  }
}

// The numTileSelect function identifies if the location a user
// clicks contains a tile.  This is a little buggy for some reason.
function numTileSelect(x, y) {
  let found;

  $.each(numTiles, (i, tile) => {
    if (x > tile.x && x < tile.x + numTileWidth
      && y > tile.y && y < tile.y + numTileHeight) {
      found = tile;
    }
  });
  return (found);
}

function turnOnNumSortHandlers() {
  // Update user selection when boxes are clicked
  gameCanvasID.on("click", function() {
    let found = numTileSelect(numSortMousePosition.x, numSortMousePosition.y);
    clearNumSort();
    // Toggle Selection
    if (found && !numTileSelected) {
      found.selected = true;
      numTileSelected = found;
      removeNumTileFromFrame(found);
    } else if (found === numTileSelected) {
      found.selected = false;
      numTileSelected = null;
    }
    // Move token
    if (!found && numTileSelected) {
      numTileSelected.move(numSortMousePosition.x, numSortMousePosition.y);
      checkIfNumTileInFrame(numSortMousePosition.x, numSortMousePosition.y, numTileSelected);
      numTileSelected.selected = false;
      numTileSelected = null;
    }
    drawNumSort();
  });

  // Get mouse position
  gameCanvasID.on('mousemove', function(event) {
    var rect = gameCanvas.getBoundingClientRect();
    numSortMousePosition.x = event.pageX - rect.left;
    numSortMousePosition.y = event.pageY - rect.top;
  });
}

// This function checks to see if a click would move a tile into
// a frame.  If so, it centers the tile within the frame, links
// the tile to the frame through the frame.tile attribute and
// sets the matched attribute if the numbers match.
function checkIfNumTileInFrame(x, y, t) {
  let found = numSortFrameSelected(x, y);
  if (found) {
    placeSound.play();
    t.x = found.tileX;
    t.y = found.tileY;
    found.tile = t
    found.matchNumber = t.number;
  }
}

// Checks to see if the tile was in a frame and removes it
// if the letter tile is clicked while assigned to a frame.
function removeNumTileFromFrame(t) {
  $.each(numFrames, (i, frame) => {
    if (frame.tile === t) {
      frame.tile = null;
   }
  });
}

// The word_frame_select function identifies if the location a user
// clicks is within a frame.
function numSortFrameSelected(x, y) {
  let found;

  $.each(numFrames, (i, frame) => {
    if (x > frame.x && x < frame.x + numFrameWidth
      && y > frame.y && y < frame.y + numFrameHeight) {
      found = frame;
    }
  });
  return (found);
}

// This function is used to disable the mousemove and click
// functions of the canvas so it does not conflict with another
// puzzle.
function turnOffNumSortHandlers() {
  gameCanvasID.off('click');
  gameCanvasID.off('mousemove');
}

// Need to clear arrays between games.
function resetNumSortArrays() {
  numOrder = [];
  numTiles = [];
  numFrames = [];
}

// This function removes all canvas objects to prepare them to be
// redrawn.
function clearNumSort() {
  context.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
}

// The PlayGame function takes a level argument and starts the game.
/*
async function PlayGame(level) {
  console.log("Playing number sort game for level " + level);
  turnOffNumSortHandlers();
  return winGame = true;
}
*/

// Called from main.js
function startNumberSort(level) {
  gameHeading.text('Sort The Numbered Tiles!');
  gameCanvasID.show();
  resizeCanvas();
  turnOnNumSortHandlers();
  resetNumSortArrays();
  buildNumArray(level);
  buildNumTiles();
  buildNumSortFrame();
  drawNumSort();
  //PlayGame(level);
}

/*
$(document).ready(() => {
  startNumberSort(3);
});
*/
