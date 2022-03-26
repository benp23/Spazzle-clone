/*
 * References
 *
 * https://www.javascripttutorial.net/sample/webapis/canvas/
 * https://stackoverflow.com/questions/51792020/selecting-and-deselecting-drawn-objects-on-canvas-and-moving-to-mouse-x-and-y
 *
 */
let context = $("canvas")[0].getContext("2d");
let canvas = document.getElementById("canvas");
let level = 4;

const goals = [];
const tokens = [];
// Build the goals and tokens
goals[0] = new token(0, 100, 50, 100, 'green', false, false);
goals[1] = new token(450, 100, 50, 100, 'blue', false, false);
for (let i = 0; i < level; i++) {
	tokens[i] = randomSquare('green');
}
for (let i = level; i < (level + level); i++) {
	tokens[i] = randomSquare('blue');
}

let mousePosition = {
    x: 0,
    y: 0
};
let selected;

// Randomly choose location of token
function randomSquare(color) {
	// random start between 52 and 428 for x
	let x = Math.floor(Math.random() * (428 - 52)) + 52;
	// random start between 2 and 278 for y
	let y = Math.floor(Math.random() * 276) + 2;
	return new token(x, y, 20, 20, color, true, true);
}

function checkAllTokensAreInGoals() {
    console.log("Checking if all tokens are in their goals.");
    let blueTokensCleared = 0;
    let greenTokensCleared = 0;
    $.each(tokens, (i, token) => {
        switch(token.color) {
            case 'green':
                // check all boxes are in green goal
                if (token.x < 50 && token.y > 101 && token.y < 180) {
                    greenTokensCleared++;
		        }
                break;
            case 'blue':
                // check all boxes are in blue goal
                if (token.x > 450 && token.y > 101 && token.y < 180) {
                    greenTokensCleared++;
		        }
        }
    });
    if ((greenTokensCleared + blueTokensCleared) === tokens.length) {
        console.log("All cleared!");
        Clear();
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
function get_select(x, y) {
    let found;

    $.each(tokens, (i, token) => {
        if (x > token.x && x < token.x + token.width
	    && y > token.y && y < token.y + token.height) {
		found = token;
	}
    });
    return (found);
}

// Select and move token
$("canvas").click(function() {
    let found = get_select(mousePosition.x, mousePosition.y);

    Clear();
    // Toggle Selection
    if (found && !selected) {
        found.selected = true;
        selected = found;
    } else if (found === selected) {
        found.selected = false;
        selected = null;
    }

    // Move token
    if (!found && selected) {
        selected.move(mousePosition.x, mousePosition.y);
        //TODO Figure out how to unselect when token is moved
        selected.selected = false;
        selected = null;
    }
    Draw();
});

// Get mouse position
$("canvas").mousemove((event) => {
    var rect = canvas.getBoundingClientRect();
    mousePosition.x = event.pageX - rect.left;
    mousePosition.y = event.pageY - rect.top;
});

// Draw the tokens
function Draw() {
    $.each(tokens, (i, token) => {
        token.draw(context);
    });
    $.each(goals, (i, goal) => {
        goal.draw(context);
    });
    checkAllTokensAreInGoals();
}

function Clear() {
    context.clearRect(0, 0, $("canvas")[0].width, $("canvas")[0].height);
}

// Run
$(document).ready(() => {
    Draw();
});

