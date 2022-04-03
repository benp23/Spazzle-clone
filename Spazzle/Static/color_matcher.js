/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const width = 75;
const height = 75;
let allowUserInput = false;
let level = 4;
let order = [];
let userOrder = [];
let matched = true;
let mousePosition = { x: 0, y: 0 };
let selected;
let wedges = [];


// Build wedges
wedges[0] = new wedge(173, 73, "blue", "#00ccff", "blue", 0);
wedges[1] = new wedge(252, 73, "green", "#66ff33", "green", 1);
wedges[2] = new wedge(173, 152, "red", "#ff00ff", "red", 2);
wedges[3] = new wedge(252, 152, "yellow", "#ff9900", "yellow", 3);

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
function sleep(x) {
    let timeout = 600;  // Shortest time when showing user the pattern
    if (x === "short") {
        timeout = 400;  // Delay while redrawing in case same color is chosen
    } else if (x === "poll") {
        timeout = 100;  // Make delay shortest during user polling
    } else {
        // Progressively shorten the time between colors
        if (level <= 15) {
            timeout = (2100 - (100 * level));
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

// Get mouse position
$("canvas").mousemove((event) => {
    var rect = canvas.getBoundingClientRect();
    mousePosition.x = event.pageX - rect.left;
    mousePosition.y = event.pageY - rect.top;
});

// Update user selection when boxes are clicked
$("canvas").click(function() {
    if (allowUserInput) {    
        let found = get_select(mousePosition.x, mousePosition.y);
        if (found) {
            userOrder.push(found.value);
        }
    }
});

// Clear the canvas of any drawn objects
function Clear() {
    context.clearRect(0, 0, $("canvas")[0].width, $("canvas")[0].height);
}

// Draw all objects on the canvas
function Draw() {
    $.each(wedges, (i, wedge) => {
        wedge.draw(context);
    });
}

// Loop over the sequence of highlighting the colors for the user to repeat
async function PlayGame() {
    console.log("Playing game");
    while (matched === true && order.length < level) {
        for (let i = 0; i < level; i++) {
            Clear();
            let current = Math.floor(Math.random() * 4);
            order.push(current);
            console.log("Randomly selected wedge " + current);
            wedge = wedges[current];
            wedge.selected = true;
            Draw();
            await sleep();
            Clear();
            wedge.selected = false;
            Draw();
            await sleep("short");
        }
    }
    allowUserInput = true;
    while (userOrder.length < order.length) {
        console.log("Polling for user input");
        await sleep("poll");
    }
    allowUserInput = false;
    // Compare the random order to the user input
    for (let i = 0; i < order.length; i++) {
        if (order[i] !== userOrder[i]) {
            matched = false;  // Set to false if user input doesn't match
            i = order.length; // End the loop on first false match
        }
    }
    if (matched) {
        // Draw a checkmark for success
        context.strokeStyle = "black";
        context.lineWidth = 10;
        context.beginPath();
        context.moveTo(173, 150);
        context.lineTo(210, 227);
        context.lineTo(327, 73);
        context.stroke();
        context.closePath();
    } else {
        // Draw an 'X' for failure
        context.strokeStyle = "black";
        context.lineWidth = 10;
        context.beginPath();
        context.moveTo(173, 73);
        context.lineTo(327, 225);
        context.stroke();
        context.closePath();
        context.beginPath();
        context.moveTo(173, 225);
        context.lineTo(327, 73);
        context.stroke();
        context.closePath();
    }
}

// Run
$(document).ready(() => {
    Clear();
    Draw();
    PlayGame();
});
