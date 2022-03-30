/* Author: Ben Paul
 * Date: 03/29/22
 * 
 * Description: The user must perform the random generated calculation.
 * Each level adds a digit to one of the numbers to increase the difficulty.
 * The html canvas is stretched onload to match the browser's dimensions.
 */

// canvas element, canvas html, 2d context
let canvasID = $("#addition_canvas");
let canvas = canvasID.get(0);
let context = canvas.getContext("2d");

// Game starts at level 2 (level = total digits between both numbers), set font size for numbers
let level = 2;
let fontSize = 50;

// Array for all new number objects
const numbers = [];

// Math operators to choose from, can add more
const operators = ['+', '-'];
let operator;

// Match canvas html size with canvas element size
function resizeCanvas() {
    canvas.height = canvasID.height();
    canvas.width = canvasID.width();
}

// Constructor for new numbers
function number(number, x, y, fs) {
    this.number = number;
    this.x = x;
    this.y = y;
    this.fontsize = fs;
}

// Create random numbers, # of digits is based on difficulty level, give them centered coordinates
function createNumbers(level) {
        // select random operator
        operator = operators[Math.floor(Math.random() * operators.length)];
        // Random number between 1 - 9
        let max = 9;
        let min = 1;
        let firstNumber = Math.floor(Math.random() * (max - min + 1) + min);
        let secondNumber = Math.floor(Math.random() * (max - min + 1) + min);
        // Determines # of digits based on level. Maybe there's a more elegant way to write this.
        let digits = Math.ceil(level / 2);
        let remainder = level % 2;
        if (digits > 1) {
            let maxString = max.toString();
            let minString = min.toString();
            // For multiple digits, random number between 10 - 99, 100 - 999, etc.
            for (let i = 2; i <= digits; i++) {
                maxString += '9';
                minString += '0';
            }
            let firstMax = parseInt(maxString);
            let firstMin = parseInt(minString);
            firstNumber = Math.floor(Math.random() * (firstMax - firstMin + 1) + firstMin);
            if (remainder === 1) {
                let secondMax = parseInt(maxString.substring(0, maxString.length - 1));
                let secondMin = parseInt(minString.substring(0, minString.length - 1));
                secondNumber = Math.floor(Math.random() * (secondMax - secondMin + 1) + secondMin);
            } else {
                secondNumber = Math.floor(Math.random() * (firstMax - firstMin + 1) + firstMin);
            }
        }
        // Center screen coordinates
        firstX = (canvas.width - fontSize * digits) / 2;
        firstY = (canvas.height - fontSize) / 2;
        secondX = (canvas.width - fontSize * (digits - remainder)) / 2;
        secondY = (canvas.height + fontSize) / 2;
        numbers[0] = new number(firstNumber, firstX, firstY, fontSize);
        numbers[1] = new number(secondNumber, secondX, secondY, fontSize);
}

function drawNumbers() {
    // clear canvas before redrawing
    context.clearRect(0, 0, canvas.width, canvas.height);
    // Draw numbers
    for (let i = 0; i < 2; i++) {
        context.font = numbers[i].fontsize + "px Arial";
        context.fillText(numbers[i].number, numbers[i].x, numbers[i].y);
    }
    // draw operator
    context.font = fontSize + "px Arial";
    let operatorX = numbers[0].x - fontSize;
    let operatorY = numbers[1].y;
    context.fillText(operator, operatorX, operatorY);
    // draw line
    context.beginPath();
    context.moveTo(operatorX, operatorY + 10);
    context.lineTo(operatorX + (numbers[0].number.toString().length * 25 + fontSize), operatorY + 10);
    context.stroke();
}

// initial loading
window.onload = function() {
    resizeCanvas();
    createNumbers(level);
    drawNumbers();
}

// if answer is correct, clear canvas and start next level
function checkAnswer(guess) {
    let answer;
    switch(operator) {
        case '+':
            answer = numbers[0].number + numbers[1].number;
            break;
        case '-':
            answer = numbers[0].number - numbers[1].number;
            break;
    }
    if (guess === answer) {
        $("#answer_text").text("Correct!").css('color', '#00FF00').show();
        // clear canvas
        context.clearRect(0, 0, canvas.width, canvas.height);
        // start next level with new numbers
        level++;
        createNumbers(level);
        drawNumbers();
    } else {
        $("#answer_text").text("Wrong!").css('color', '#FF0000').show();
    }
}

// answer input submission
$("#answer_form").submit(function(event) {
    event.preventDefault();
    let guess = parseInt($("#answer_input").val());
    $("#answer_input").val('');
    checkAnswer(guess);
});