/* 
 * File: color_matcher.js
 * Author: Troy Scites
 * Date: 04/03/2022
 * Description: Match the color pattern given by clicking the colored boxes.
 */
/*
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
*/
// Calling this global function from main.js
resizeCanvas();

const width = 75;
const height = 75;
let allowUserInput = false;
// let level = 4;
// Using colorMatchOrder from main.js instead
//let order = [];
let userOrder = [];
let matched = true;
let mousePosition = { x: 0, y: 0 };
let selected;
let wedges = [];

canvasCenter = gameCanvas.width / 2.0
// Build wedges
function buildWedges() {
    // Clear wedges array
    wedges = [];
    wedges[0] = new wedge((canvasCenter - width - 5), 70, "blue", "#00ccff", "blue", 0);
    wedges[1] = new wedge((canvasCenter + 5), 70, "green", "#66ff33", "green", 1);
    wedges[2] = new wedge((canvasCenter - width - 5), 155, "red", "#ff00ff", "red", 2);
    wedges[3] = new wedge((canvasCenter + 5), 155, "yellow", "#ff9900", "yellow", 3);
};

// Find the wedge where the user clicks
function get_select(x, y) {
    let found;
    
    $.each(wedges, (i, wedge) => {
        if (x > wedge.x && x < wedge.x + width
	    && y > wedge.y && y < wedge.y + height) {
            found = wedge;
        }
    });
    return (found);
}

// The sleep function pauses so the user can see the highlighted color wedge
function sleep(level, x) {
    let timeout = 800;  // Shortest time when showing user the pattern
    if (x === "short") {
        timeout = 400;  // Delay while redrawing in case same color is chosen
    } else if (x === "poll") {
        timeout = 100;  // Make delay shortest during user polling
    } else {
        // Progressively shorten the time between colors
        if (level <= 15) {
            timeout = (1100 - (50 * level));
        }
    }
    return new Promise(resolve => setTimeout(resolve, timeout));
}

// The wedge function maintains the state of each colored area
function wedge(x, y, c, sc, n, v) {
    this.x = x;
    this.y = y;
    this.color = c;
    this.strokeColor = sc;
    this.name = n;
    this.value = v;
    this.selected = false;
    this.draw = function(context) {
        context.beginPath();
        context.strokeStyle = (this.selected ? this.strokeColor : this.color);
        context.fillStyle = (this.selected ? "#ffffff" : this.color);
        context.lineWidth = 2;
        context.rect(this.x, this.y, width, height);
        context.fill();
        context.stroke();
        context.closePath();
    };
}

function turnOnColorHandlers() {
    // Get mouse position
    gameCanvasID.on('mousemove', function(event) {
        var rect = gameCanvas.getBoundingClientRect();
        mousePosition.x = event.pageX - rect.left;
        mousePosition.y = event.pageY - rect.top;
    });

    // Update user selection when boxes are clicked
    gameCanvasID.on("click", function() {
        if (allowUserInput) {
            let found = get_select(mousePosition.x, mousePosition.y);
            if (found) {
                userOrder.push(found.value);
            }
        }
    });
};

function turnOffColorHandlers() {
    gameCanvasID.off('mousemove');
    gameCanvasID.off('click');
}

// Clear the canvas of any drawn objects
function Clear() {
    context.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
}

// Draw all objects on the canvas
function Draw() {
    $.each(wedges, (i, wedge) => {
        wedge.draw(context);
    });
}

// Loop over the sequence of highlighting the colors for the user to repeat
async function PlayGame(level) {
    //console.log("Playing game");
    // Empty the arrays before starting
    //order = [];
    //console.log("Using colorMatchOrder: " + colorMatchOrder);
    userOrder = [];
    // Display colors from previous levels
    if (colorMatchOrder.length !== 0) {
        //console.log("colorMatchOrder is populated.");
        for (let i = 0; i < colorMatchOrder.length; i++) {
            Clear();
            let currentWedge = wedges[colorMatchOrder[i]];
            currentWedge.selected = true;
            Draw();
            await sleep(level);
            Clear();
            currentWedge.selected = false;
            Draw();
            await sleep(level, "short");
        }
    }
    // Add colors to the sequence to match the level
    while (matched === true && colorMatchOrder.length < level) {
        for (let i = 0; i < (level - colorMatchOrder.length); i++) {
            Clear();
            let current = Math.floor(Math.random() * 4);
            colorMatchOrder.push(current);
            console.log("Randomly selected wedge " + current);
            currentWedge = wedges[current];
            currentWedge.selected = true;
            Draw();
            await sleep(level);
            Clear();
            currentWedge.selected = false;
            Draw();
            await sleep(level, "short");
        }
    }
    allowUserInput = true;
    while (userOrder.length < colorMatchOrder.length) {
        //console.log("Polling for user input");
        await sleep(level, "poll");
    }
    allowUserInput = false;
    // Compare the random order to the user input
    for (let i = 0; i < colorMatchOrder.length; i++) {
        if (colorMatchOrder[i] !== userOrder[i]) {
            matched = false;  // Set to false if user input doesn't match
            i = colorMatchOrder.length; // End the loop on first false match
        }
    }
    if (matched) {
        // Draw a checkmark for success
        context.strokeStyle = "black";
        context.lineWidth = 10;
        context.beginPath();
        context.moveTo(wedges[2].x, wedges[2].y);
        context.lineTo((wedges[2].x + (width / 2)), (wedges[2].y + height));
        context.lineTo((wedges[1].x + width), wedges[1].y);
        context.stroke();
        context.closePath();
        // Turn off any event handlers to prevent them from interfering in other games
        turnOffColorHandlers();
        return winGame = true;
    } else {
        // Draw an 'X' for failure
        context.strokeStyle = "black";
        context.lineWidth = 10;
        context.beginPath();
        context.moveTo(wedges[0].x, wedges[0].y);
        context.lineTo((wedges[3].x + width), (wedges[3].y + height));
        context.stroke();
        context.closePath();
        context.beginPath();
        context.moveTo((wedges[1].x + width), wedges[1].y);
        context.lineTo(wedges[2].x, (wedges[2].y + height));
        context.stroke();
        context.closePath();
        if (mode !== 'infinite') {
            gameOver(mode);
        }
    }
}

// Called from main.js
function startColorGame(level) {
    // Starts at level 1 in main.js but change it to 4 to make this game start with a pattern of 4
    let newLevel = level + 3;
    gameHeading.text('Remember This Pattern!');
    gameCanvasID.show();
    // Functions to start the game
    turnOnColorHandlers();
    buildWedges();
    Draw();
    PlayGame(newLevel);
}

// Run
/*
$(document).ready(() => {
    Clear();
    startColorGame();
    PlayGame();
});
*/
