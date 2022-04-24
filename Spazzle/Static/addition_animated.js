/* Author: Ben Paul
 * Date: 03/29/22
 * 
 * Description: The user must find the sum of the numbers while
 * they bounce around the screen in random directions. Each 
 * level adds one additional number to increase the difficulty.
 * This minigame demonstrates the requestAnimationFrame()
 * method to animate objects on an HTML canvas. This game also
 * demonstrates the ability for the game to adapt when the user
 * loads or resizes to any size window. (needs testing across
 * different browsers.)
 */

// Game starts at level 2 (2 numbers), set font size for numbers
// let level = 2;
let fontSize = 50;

// Array for all new number objects
let numbers = [];

// Boolean for when addition game is running
let addition = false;

// green, yellow, blue, red
const colors = ['#00FF00', '#FFFF00', '#0000FF', '#FF0000'];

// Constructor for new numbers
function number(number, x, y, fs, c, sx, sy) {
    this.number = number;
    this.x = x;
    this.y = y;
    this.fontsize = fs;
    this.color = c;
    this.speedX = sx;
    this.speedY = sy;
}

// Create random numbers between 1-9, with random coordinates, fixed color, and random speed
function startAdditionGame(level) {
    addition = true;
    gameHeading.text('Find the sum!');
    gameCanvasID.show();
    answerInline.show();
    resizeCanvas();
    numbers = [];
    for (let i = 0; i < level + 1; i++) {
        // random number 1 - 9
        let randomNumber = Math.floor(Math.random() * 9 + 1);
        let coordX = Math.floor(Math.random() * gameCanvas.width - fontSize);
        // to prevent drawing outside of canvas
        if (coordX < 0) {
            coordX = 0;
        }
        let coordY = Math.floor(Math.random() * gameCanvas.height + fontSize);
        // to prevent drawing outside of canvas
        if (coordY > gameCanvas.height) {
            coordY = gameCanvas.height;
        }
        // there are 4 fixed colors in the colors array, chooses the next color in order
        let colorIndex = i % colors.length;
        let color = colors[colorIndex];
        // random speed between -3 and 3 pixels
        let speedX = Math.floor(Math.random() * 7 - 3);
        let speedY = Math.floor(Math.random() * 7 - 3);
        numbers[i] = new number(randomNumber, coordX, coordY, fontSize, color, speedX, speedY);
    }
    animation = requestAnimationFrame(drawNumbers);
}

// draw number function to be called each animation frame
function drawNumbers() {
    // clear canvas before redrawing
    context.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    // determine each number's new coordinates and redraw them
    for (let i = 0; i < numbers.length; i++) {
        numbers[i].x += numbers[i].speedX;
        numbers[i].y += numbers[i].speedY;
        // check if the number has reached a side of the canvas,
        // then reverse speed positive to negative or negative to positive
        if (numbers[i].x > gameCanvas.width - fontSize) {
            numbers[i].speedX *= -1;
            numbers[i].x = gameCanvas.width - fontSize;
            numbers[i].x += numbers[i].speedX;
        }
        if (numbers[i].x < 0) {
            numbers[i].speedX *= -1;
            numbers[i].x = 0;
            numbers[i].x += numbers[i].speedX;
        }
        if (numbers[i].y > gameCanvas.height) {
            numbers[i].speedY *= -1;
            numbers[i].y = gameCanvas.height;
            numbers[i].y += numbers[i].speedY;
        }
        if (numbers[i].y < fontSize) {
            numbers[i].speedY *= -1;
            numbers[i].y = fontSize;
            numbers[i].y += numbers[i].speedY;
        }
        // draw the number
        context.fillStyle = numbers[i].color;
        context.font = numbers[i].fontsize + "px Arial";
        context.fillText(numbers[i].number, numbers[i].x, numbers[i].y);
    }
    // recursive animation request
    animation = requestAnimationFrame(drawNumbers);
}

// initial loading
window.onload = function() {
    // resizeCanvas();
    // createNumbers(level);
    // animation = requestAnimationFrame(drawNumbers);
}

// dynamic resizing, and adjusting animation/redrawing
window.onresize = function() {
    if (gameCanvasID.is(":visible") && addition) {
        resizeCanvas();
        cancelAnimationFrame(animation);
        animation = requestAnimationFrame(drawNumbers);
    }
};

// if answer is correct, clear canvas and start next level
function checkAnswer(guess) {
    let sum = 0;
    for (let i = 0; i < numbers.length; i++) {
        sum += numbers[i].number;
    }
    if (guess === sum) {
        $("#answer_text").text("Correct!").css('color', '#00FF00').show();
        addition = false;
        cancelAnimationFrame(animation);
        return winGame = true;
    } else {
        $("#answer_text").text("Wrong!").css('color', '#FF0000').show();
        if (mode !== 'infinite') {
            gameOver(mode);
        }
    }
}

// answer input submission
$("#answer_form").submit(function(event) {
    event.preventDefault();
    let guess = parseInt($("#answer_input").val());
    $("#answer_input").val('');
    checkAnswer(guess);
});