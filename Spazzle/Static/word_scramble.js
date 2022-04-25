/* File: word_scramble.js
 * Author: Troy Scites
 * Date: 04/20/2022
 * Description: Scrambles letters of a word the user has to put back in the right order.
 */

/*
let gameCanvasID = document.getElementById("canvas");
let context = gameCanvasID.getContext("2d");
*/

// Global variables for this puzzle
let gameWord = "";
let maxWordScrambleLevel = 7;
let wordFrameHeight = 85;
let wordTileHeight = 75;
let wordFrameWidth = 85;
let wordTileWidth = 75;
let tiles = [];
let frames = [];
let wordArray = [];
let wordSelected = null;
let frameSelected = null;
let wordMousePosition = {x: 0, y: 0};
const wordsLevel1 = [ "mean", "curl", "turn", "cafe", "mold", "lose", "slow", "vain", "bark", "sign", "folk", "read", "core", "seem", "lift", "beam", "eaux", "tone", "knee", "clue", "soul", "name", "wash", "game", "feel", "boat", "inch", "idea", "calm", "bake", "wine", "burn", "give", "joke", "sock", "huge", "stir", "hill", "chew", "palm" ];
const wordsLevel2 = [ "space", "union", "curve", "prove", "cream", "spoil", "patch", "graze", "study", "plane", "bowel", "title", "final", "fleet", "slide", "ideal", "thumb", "staff", "cycle", "voice", "prize", "swarm", "budge", "acute", "lemon", "honor", "creep", "bland", "cower", "shout", "carve", "build", "stool", "chief", "ferry", "strip", "break", "drama", "slant", "owner" ];
const wordsLevel3 = [ "symbol", "runner", "meadow", "circle", "castle", "spirit", "quaint", "marble", "couple", "ethnic", "absent", "burial", "jockey", "reveal", "palace", "aspect", "credit", "borrow", "ground", "member", "empire", "church", "facade", "endure", "hotdog", "cereal", "secure", "useful", "parade", "devote", "outfit", "apathy", "drawer", "center", "vessel", "prefer", "hiccup", "sailor", "column", "demand" ];
const wordsLevel4 = [ "extract", "bargain", "descent", "cabinet", "harvest", "episode", "stadium", "officer", "stretch", "ceiling", "fixture", "pyramid", "reactor", "certain", "pumpkin", "wedding", "soldier", "glasses", "chapter", "biology", "penalty", "release", "royalty", "grimace", "account", "freedom", "curtain", "grounds", "retreat", "crevice", "fantasy", "illness", "summary", "ecstasy", "digress", "squeeze", "abolish", "formula", "husband", "overeat" ];
const wordsLevel5 = [ "conceive", "dedicate", "aviation", "fragrant", "pressure", "specimen", "omission", "decrease", "designer", "epicalyx", "fraction", "assembly", "buttocks", "congress", "economic", "restrain", "prestige", "joystick", "question", "surprise", "building", "flourish", "recovery", "personal", "mourning", "champion", "campaign", "folklore", "ordinary", "feminine", "disorder", "analysis", "birthday", "suppress", "scenario", "complain", "category", "prospect", "conflict", "audience" ];
const wordsLevel6 = [ "mechanism", "volunteer", "recommend", "violation", "hierarchy", "waterfall", "principle", "strategic", "dimension", "intensify", "horseshoe", "secretion", "rebellion", "ignorance", "vegetable", "offspring", "policeman", "interrupt", "privilege", "intention", "modernize", "eliminate", "parameter", "ostracize", "favourite", "cigarette", "isolation", "colleague", "formulate", "chocolate", "relevance", "publisher", "highlight", "undermine", "directory", "tradition", "transport", "criticism", "automatic", "admission" ];
const wordsLevel7 = [ "depression", "excitement", "researcher", "unpleasant", "girlfriend", "mechanical", "mastermind", "curriculum", "possession", "censorship", "reasonable", "protection", "gregarious", "background", "motivation", "connection", "productive", "indication", "continuous", "repetition", "exhibition", "attraction", "allocation", "helicopter", "instrument", "reluctance", "difference", "enthusiasm", "prevalence", "conspiracy", "perception", "management", "negligence", "chimpanzee", "corruption", "generation", "confession", "basketball", "exaggerate", "relaxation" ];

// This function uses the arrays of words to build a list based on the level.
// Once the word is selected, it is set in a global variable
function getWordsForLevel(level) {
  //console.log("Opening words for level " + level);
  let gameWordScrambleLevel = level;
  if (level > maxWordScrambleLevel) {
    gameWordScrambleLevel = maxWordScrambleLevel;
  }

  switch (level) {
    case 1:
      wordArray = wordArray.concat(wordsLevel1);
      break;
    case 2:
      wordArray = wordArray.concat(wordsLevel1, wordsLevel2);
      break;
    case 3:
      wordArray = wordArray.concat(wordsLevel1, wordsLevel2, wordsLevel3);
      break;
    case 4:
      wordArray = wordArray.concat(wordsLevel2, wordsLevel3, wordsLevel4);
      break;
    case 5:
      wordArray = wordArray.concat(wordsLevel3, wordsLevel4, wordsLevel5);
      break;
    case 6:
      wordArray = wordArray.concat(wordsLevel4, wordsLevel5, wordsLevel6);
      break;
    case 7:
      wordArray = wordArray.concat(wordsLevel5, wordsLevel6, wordsLevel7);
      break;
    default:
      wordArray = wordArray.concat(wordsLevel6, wordsLevel7);
  }
  gameWord = wordArray[Math.floor(Math.random() * wordArray.length)];
  //console.log("Length of wordsLevel1: " + wordsLevel1.length);
  //console.log("Length of wordArray: " + wordArray.length);
  //console.log("Choose game word: " + gameWord);
}

// The drawWord function draws all of the canvas objects based on
// their current attributes.  It also checks to see if all of the
// tiles are in their appropriate frames.
function drawWord() {
  //console.log("Drawing word scramble");
  //console.log(gameWord);
  //console.log(gameWord.length);
  //console.log(gameWord[0]);
  $.each(frames, (i, frame) => {
    frame.draw(context);
  });
  $.each(tiles, (i, tile) => {
    tile.draw(context);
  });
  checkWordIsSolved();
}

// The buildTiles function builds the tiles for each letter of the
// selected word with a random canvas location.
function buildTiles() {
  //console.log("gameCanvasID width: " + gameCanvas.width);
  //console.log("gameCanvasID height: " + gameCanvas.height);
  for (let i=0; i < gameWord.length; i++) {
    tiles[i] = randomTile(gameWord[i]);
  }
}

// The buildWordFrame function creates the frame of boxes centered
// at the bottom of the canvas.
function buildWordFrame() {
  //console.log("Building word frame");
  let center = gameCanvas.width / 2;
  let totalWidth = wordFrameWidth * gameWord.length;
  let startX = center - (totalWidth / 2.0);
  let Y = gameCanvas.height - 85;
  //console.log("startX:" + startX + "  center:" + center + "  Y:" + Y);
  for (let i = 0; i < gameWord.length; i++) {
    let x = startX + (i * wordFrameWidth);
    frames[i] = new frame(x, Y, wordFrameHeight, wordFrameWidth, tiles[i].letter);
  }
}

// The randomTile function generates the random location for the tile
// and assigns the tile's initial attributes.
function randomTile(letter) {
  let x = Math.floor(Math.random() * (gameCanvas.width - 80) + 10);
  let y = Math.floor(Math.random() * (gameCanvas.height - 200));
  //console.log(letter + "  x:" + x + "  y:" + y);
  return new tile(x, y, wordTileHeight, wordTileWidth, letter);
}

// The frame function builds a frame object to hold a letter tile.
// The background color is based on if a letter tile is inside the frame,
// and whether that tile's letter matches the one assigned to the frame.
function frame(x, y, h, w, l) {
  this.x = x;
  this.y = y;
  this.height = h;
  this.width = w;
  this.matchLetter = l;
  this.tile = null;
  this.matched = false;
  this.tileX = x + 5;
  this.tileY = y + 5;
  this.draw = function(context) {
    context.beginPath();
    context.strokeStyle = "black";
    context.lineWidth = 2;
    context.rect(this.x, this.y, this.height, this.width);
    context.fillStyle = isLetterInRightFrame(this.matchLetter, this.tile);
    context.fill();
    context.closePath();
    context.stroke();
  };
}

// Compares the frame assigned letter with the passed tile
function isLetterInRightFrame(l, t) {
  if (t === null) {
    return "white";
  }
  //console.log("isLetterInRightFrame l:" + l + " t:" + t.letter);
  if (t.letter === l) {
    return "green";
  }
  return "gold";
}

// The checkWordIsSolved function loops over each frame to see if all
// have a tile assigned and the tile letter matches the frame's letter.
function checkWordIsSolved() {
  let framesWithMatchingTiles = 0;
  $.each(frames, (i, frame) => {
    //console.log("Checking matched:" + frame.matched);
    //console.log("Checking tile:" + frame.tile);
    if (frame.matched === true && frame.tile !== null) {
      framesWithMatchingTiles++;
    }
  });
  //console.log("Matching frames: " + framesWithMatchingTiles);
  if (framesWithMatchingTiles === frames.length) {
    //console.log("Word unscrambled!");
    clearWord();
    turnOffWordHandlers();
    return winGame = true;
  }
}

// The tile function creates a tile object with the attributes needed
// to manage the tile, moving it into a frame and how to draw it.
function tile(x, y, h, w, l) {
  this.x = x;
  this.y = y;
  this.height = h;
  this.width = w;
  this.letter = l;
  this.selected = false;
  this.draw = function(context) {
    context.beginPath();
    context.strokeStyle = (this.selected ? "black" : "blue");
    context.lineWidth = 2;
    context.rect(this.x, this.y, this.height, this.width);
    context.closePath();
    context.fillStyle = "black";
    context.font = '60px san-serif';
    context.fillText(this.letter, this.x + 25, this.y + 50);
    context.stroke();
  };
  this.move = function(x, y) {
    this.x = x;
    this.y = y;
  }
}

// The word_tile_select function identifies if the location a user
// clicks contains a tile.  This is a little buggy for some reason.
function word_tile_select(x, y) {
  let found;

  $.each(tiles, (i, tile) => {
    if (x > tile.x && x < tile.x + wordTileWidth
      && y > tile.y && y < tile.y + wordTileHeight) {
      found = tile;
    }
  });
  return (found);
}

function turnOnWordHandlers() {
  // Update user selection when boxes are clicked
  gameCanvasID.on("click", function() {
    let found = word_tile_select(wordMousePosition.x, wordMousePosition.y);
    clearWord();
    // Toggle Selection
    if (found && !wordSelected) {
      found.selected = true;
      wordSelected = found;
      removeFromFrame(found);
    } else if (found === wordSelected) {
      found.selected = false;
      wordSelected = null;
    }
    // Move token
    if (!found && wordSelected) {
      wordSelected.move(wordMousePosition.x, wordMousePosition.y);
      checkIfTileInFrame(wordMousePosition.x, wordMousePosition.y, wordSelected);
      wordSelected.selected = false;
      wordSelected = null;
    }
    drawWord();
  });

  // Get mouse position
  gameCanvasID.on('mousemove', function(event) {
    var rect = gameCanvas.getBoundingClientRect();
    wordMousePosition.x = event.pageX - rect.left;
    wordMousePosition.y = event.pageY - rect.top;
  });
}

// This function checks to see if a click would move a tile into
// a frame.  If so, it centers the tile within the frame, links
// the tile to the frame through the frame.tile attribute and
// sets the matched attribute if the letters match.
function checkIfTileInFrame(x, y, t) {
  let found = word_frame_selected(x, y);
  if (found) {
    t.x = found.tileX;
    t.y = found.tileY;
    found.tile = t
    if (found.matchLetter === t.letter) {
      found.matched = true;
    }
  }
}

// Checks to see if the tile was in a frame and removes it
// if the letter tile is clicked while assigned to a frame.
function removeFromFrame(t) {
  $.each(frames, (i, frame) => {
    if (frame.tile === t) {
      frame.tile = null;
   }
  });
}

// The word_frame_select function identifies if the location a user
// clicks is within a frame.
function word_frame_selected(x, y) {
  let found;

  $.each(frames, (i, frame) => {
    if (x > frame.x && x < frame.x + wordFrameWidth
      && y > frame.y && y < frame.y + wordFrameHeight) {
      found = frame;
    }
  });
  return (found);
}

// This function is used to disable the mousemove and click
// functions of the canvas so it does not conflict with another
// puzzle.
function turnOffWordHandlers() {
  gameCanvasID.off('click');
  gameCanvasID.off('mousemove');
}

// Need to clear arrays between games.
function resetArrays() {
  tiles = [];
  frames = [];
  wordArray = [];
}

// This function removes all canvas objects to prepare them to be
// redrawn.
function clearWord() {
  context.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
}

// Called from main.js
function startWordScramble(level) {
  gameHeading.text('Unscramble The Word!');
  gameCanvasID.show();
  // Calling this global function from main.js
  resizeCanvas();
  turnOnWordHandlers();
  getWordsForLevel(level);
  resetArrays();
  buildTiles();
  buildWordFrame();
  drawWord();
}

/*
// Local testing
$(document).ready(() => {
  startWordScramble(4);
});
*/
