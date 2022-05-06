/*
 * File: sort_canvas.js
 * Author: Troy Scites
 * Date: 04/03/2022
 * Description: Creates green and blue goals and tokens on a
 * canvas. Tokens have to be moved to their respective goals.
 *
 * References
 *
 * https://www.javascripttutorial.net/sample/webapis/canvas/
 * https://stackoverflow.com/questions/51792020/selecting-and-deselecting-drawn-objects-on-canvas-and-moving-to-mouse-x-and-y
 *
 */
/*
let context = $("canvas")[0].getContext("2d");
let canvas = document.getElementById("canvas");
let level = 4;
*/

// Calling this global function from main.js
resizeCanvas();
let halfCanvasHeight = gameCanvas.height / 2;

let goals = [];
let tokens = [];
// Build the goals and tokens
function buildGoalsAndTokens(level) {
    // Empty the arrays
    goals = [];
    tokens = [];
    //goals[0] = new token(0, (halfCanvasHeight - 75), 75, 150, 'green', false, false);
    goals[0] = new token(0, (halfCanvasHeight - 75), 75, 150, 'green', false, false);
    goals[1] = new token((gameCanvas.width - 75), (halfCanvasHeight - 75), 75, 150, 'blue', false, false);
    for (let i = 0; i < level; i++) {
    	tokens[i] = randomSquare('green');
    }
    for (let i = level; i < (level + level); i++) {
    	tokens[i] = randomSquare('blue');
    }
}

let sortMousePosition = {
    x: 0,
    y: 0
};
let sortSelected;

// Randomly choose location of token
function randomSquare(color) {
	// random start between the width of the canvas for x
	let x = Math.floor(Math.random() * (gameCanvas.width - 228)) + 78;
	// random start between the height of the canvas for y
	let y = Math.floor(Math.random() * (gameCanvas.height - 30)) + 2;
	return new token(x, y, 20, 20, color, true, true);
}

function checkAllTokensAreInGoals() {
    //console.log("Checking if all tokens are in their goals.");
    let blueTokensCleared = 0;
    let greenTokensCleared = 0;
    $.each(tokens, (i, token) => {
        switch(token.color) {
            case 'green':
                // check all boxes are in green goal
                if (token.x < 75 && token.y > goals[0].y && token.y < (goals[0].y + 130)) {
                    greenTokensCleared++;
		        }
                break;
            case 'blue':
                // check all boxes are in blue goal
                if (token.x > goals[1].x && token.y > goals[1].y && token.y < (goals[1].y + 130)) {
                    greenTokensCleared++;
		        }
        }
    });
    if ((greenTokensCleared + blueTokensCleared) === tokens.length) {
        console.log("All cleared!");
        clearSort();
        // Turn off any event handlers to prevent them from interfering in other games
        turnOffSortHandlers();
        return winGame = true;
    }
}

//function token(x, y, h, w, c) {
function token(x, y, h, w, c, f, m) {
    this.x = x;
    this.y = y;
    this.height = h;
    this.width = w;
    this.color = c;
    this.selected = false;
    this.moveable = m;
    this.draw = function(context) {
        context.strokeStyle = (this.selected ? "black" : this.color);
        context.fillStyle = this.color;
        context.beginPath();
        context.lineWidth = 2;
        context.rect(this.x, this.y, this.height, this.width);
        if (f) {
            context.fill();
	}
        context.stroke();
    };
    this.move = function(x, y) {
        this.x = x;
        this.y = y;
    };
}

// Select the token on the canvas
function sort_get_select(x, y) {
    let found = false;

    $.each(tokens, (i, token) => {
        if (x > token.x && x < token.x + token.width
	    && y > token.y && y < token.y + token.height) {
		found = token;
	}
    });
    return (found);
}

function turnOnSortHandlers() {
    // Select and move token
    gameCanvasID.on('click', function() {
        let found = sort_get_select(sortMousePosition.x, sortMousePosition.y);

        clearSort();
        // Toggle Selection
        if (found && !sortSelected) {
            found.selected = true;
            sortSelected = found;
        } else if (found === sortSelected) {
            found.selected = false;
            sortSelected = null;
        }

        // Move token
        if (!found && sortSelected) {
            sortSelected.move(sortMousePosition.x, sortMousePosition.y);
            sortSelected.selected = false;
            sortSelected = null;
        }
        drawSort();
    });

    // Get mouse position
    gameCanvasID.on('mousemove', function(event) {
        var rect = gameCanvas.getBoundingClientRect();
        sortMousePosition.x = event.pageX - rect.left;
        sortMousePosition.y = event.pageY - rect.top;
    });
}

function turnOffSortHandlers() {
    gameCanvasID.off('click');
    gameCanvasID.off('mousemove');
}

// Draw the tokens
function drawSort() {
    $.each(tokens, (i, token) => {
        token.draw(context);
    });
    $.each(goals, (i, goal) => {
        goal.draw(context);
    });
    checkAllTokensAreInGoals();
}

function clearSort() {
    context.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
}

function startSortingGame(level) {
    gameHeading.text('Sort the Colors Into the Goals!');
    gameCanvasID.show();
    // Functions to start the game
    turnOnSortHandlers();
    buildGoalsAndTokens(level);
    drawSort();
}

// Run
/*
$(document).ready(() => {
    drawSort();
});
*/

