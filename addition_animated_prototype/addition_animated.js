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

// canvas element, canvas html, 2d context
let canvasID = $("#addition_canvas");
let canvas = canvasID.get(0);
let context = canvas.getContext("2d");

// Game starts at level 2 (2 numbers), set font size for numbers
let level = 2;
let fontSize = 50;

// Array for all new number objects
const numbers = [];

// green, yellow, blue, red
const colors = ['#00FF00', '#FFFF00', '#0000FF', '#FF0000'];

// Match canvas html size with canvas element size
function resizeCanvas() {
    canvas.height = canvasID.height();
    canvas.width = canvasID.width();
}

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
function createNumbers(level) {
    for (let i = 0; i < level; i++) {
        // random number 1 - 9
        let randomNumber = Math.floor(Math.random() * 9 + 1);
        let coordX = Math.floor(Math.random() * canvas.width - fontSize);
        // to prevent drawing outside of canvas
        if (coordX < 0) {
            coordX = 0;
        }
        let coordY = Math.floor(Math.random() * canvas.height + fontSize);
        // to prevent drawing outside of canvas
        if (coordY > canvas.height) {
            coordY = canvas.height;
        }
        // there are 4 fixed colors in the colors array, chooses the next color in order
        let colorIndex = i % colors.length;
        let color = colors[colorIndex];
        // random speed between -3 and 3 pixels
        let speedX = Math.floor(Math.random() * 7 - 3);
        let speedY = Math.floor(Math.random() * 7 - 3);
        numbers[i] = new number(randomNumber, coordX, coordY, fontSize, color, speedX, speedY);
    }
}

// draw number function to be called each animation frame
function drawNumbers() {
    // clear canvas before redrawing
    context.clearRect(0, 0, canvas.width, canvas.height);
    // determine each number's new coordinates and redraw them
    for (let i = 0; i < numbers.length; i++) {
        numbers[i].x += numbers[i].speedX;
        numbers[i].y += numbers[i].speedY;
        // check if the number has reached a side of the canvas,
        // then reverse speed positive to negative or negative to positive
        if (numbers[i].x > canvas.width - fontSize) {
            numbers[i].speedX *= -1;
            numbers[i].x = canvas.width - fontSize;
            numbers[i].x += numbers[i].speedX;
        }
        if (numbers[i].x < 0) {
            numbers[i].speedX *= -1;
            numbers[i].x = 0;
            numbers[i].x += numbers[i].speedX;
        }
        if (numbers[i].y > canvas.height) {
            numbers[i].speedY *= -1;
            numbers[i].y = canvas.height;
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
    resizeCanvas();
    createNumbers(level);
    animation = requestAnimationFrame(drawNumbers);
}

// dynamic resizing, and adjusting animation/redrawing
window.onresize = function() {
    resizeCanvas();
    cancelAnimationFrame(animation);
    animation = requestAnimationFrame(drawNumbers);
};

// if answer is correct, clear canvas and start next level
function checkAnswer(guess) {
    let sum = 0;
    for (let i = 0; i < numbers.length; i++) {
        sum += numbers[i].number;
    }
    if (guess === sum) {
        $("#answer_text").text("Correct!").css('color', '#00FF00').show();
        // clear canvas
        context.clearRect(0, 0, canvas.width, canvas.height);
        // start next level with new numbers and animation
        level++;
        createNumbers(level);
        cancelAnimationFrame(animation);
        animation = requestAnimationFrame(drawNumbers);
    } else {
        $("#answer_text").text("Wrong!").css('color', '#FF0000').show();
    }
}

// answer input submission
$("#answer_form").submit(function(event) {
    event.preventDefault();
    let guess = parseInt($("#sum_input").val());
    $("#sum_input").val('');
    checkAnswer(guess);
});