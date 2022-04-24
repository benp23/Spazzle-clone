// Global variables
let winGame = false;
let level = 1;
// GET MODE FROM SERVER/FLASK (use async/await)
const mode = ''; // 'speed', 'level', 'infinite'
const quitButton = $("#quit_button");
const gameHeading = $("#game_heading");
const levelNumber = $("#level_number");
const gameTimer = $("#game_timer");
const gameCanvasID = $("#game_canvas");
const gameCanvas = gameCanvasID.get(0);
const context = gameCanvas.getContext("2d");
const gameDiv = $("#game_div");
const answerInline = $("#answer_inline");

// Match canvas html size with canvas element size
function resizeCanvas() {
    gameCanvas.height = gameCanvasID.height();
    gameCanvas.width = gameCanvasID.width();
}

// Total game time in seconds - starting number based on game mode;
let totalTime;
if (mode === 'speed') {
    totalTime = 5 * 60;
    gameTimer.text('0:05:00');
} else {
    totalTime = 0;
    gameTimer.text('0:00:00');
}
let seconds;
let minutes;
let hours;
// Add given amount of seconds to timer and format it
function changeTime(amount) {
    if (mode === 'speed') {
        totalTime -= amount;
    } else {
        totalTime += amount;
    }
    seconds = totalTime;
    minutes = 0;
    hours = 0;
    if (seconds >= 60) {
        minutes = Math.floor(seconds / 60);
        seconds %= 60;
    }
    if (seconds < 10) {
        seconds = '0' + seconds;
    }
    if (minutes >= 60) {
        hours = Math.floor(minutes / 60);
        minutes %= 60;
    }
    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    seconds = seconds.toString();
    minutes = minutes.toString();
    hours = hours.toString();
    gameTimerText = hours + ':' + minutes + ':' + seconds;
    gameTimer.text(gameTimerText);
    // For speed mode when timer reaches 0
    if (totalTime <= 0) {
        return gameOver(mode);
    }
    return gameTimerText;
}

// Game Over function
function gameOver(mode) {
    let finalTime = changeTime(0);
    /*
     * FINAL POST TO SERVER
     */
    if (mode === 'speed') {
        alert('Time\'s up! Congratulations, you reached level '
            + level + '! Returning home.');
    } else {
        alert('Game Over! Congratulations, you reached level '
            + level + ' with a time of ' + finalTime + '! Returning home.');
    }
    window.location.href = '/';
}

// End the game
quitButton.click(function() {
    gameOver(mode);
});

// Wait for all scripts to load before calling done()
$.when(
    $.getScript('/static/color_matcher.js'),
    $.getScript('/static/sort_canvas.js'),
    $.getScript('/static/addition_animated.js'),
    $.getScript('/static/image_matching.js')

).done(function() {
    console.log('Done loading game scripts.');

    // Timer variables
    const oneSecond = 1000;
    let expectedTime = Date.now() + oneSecond;
    let drift;
    let numberOfSeconds;
    /* setTimeout/setInterval do not track time accurately.
     * Use the Date object to correct the time.
     */
    function timer() {
        // Find the drift in milliseconds to correct the timer
        drift = Date.now() - expectedTime;
        numberOfSeconds = 1;
        // Correct timer if its off by more than one second
        if (drift > oneSecond) {
            // How many whole seconds off, and remainder?
            numberOfSeconds += Math.floor(drift / oneSecond);
            drift %= oneSecond;
        }
        // Add seconds to timer
        changeTime(numberOfSeconds);
        // Update the expectedTime
        expectedTime += numberOfSeconds * oneSecond;
        // setTimeout time will be 1000 +- any drift, or 0 in case of negative
        setTimeout(timer, Math.max(0, oneSecond - drift));
    }
    setTimeout(timer, oneSecond);

    /* Call this after every game is completed to reset everything. Games can
     * show and/or build their required html/css in the individual game files
     */
    function eraseGame() {
        gameDiv.empty();
        gameDiv.hide();
        context.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
        gameCanvasID.hide();
        answerInline.hide();
    }

    // Set a timeout for the while loop in waitForWin()
    const timeout = async function(time) {
        return new Promise(function(resolve) {
            setTimeout(resolve, time);
        });
    };
    
    // Check if the user won the game every 50 ms
    async function waitForWin() {
        while (winGame === false) {
            await timeout(50);
        }
        winGame = false;
    }

    /* List all the main game functions here. Give game functions a parameter for (level).
     * Use "return winGame = true;" inside where the game file checks for the win condition
     */
    let gameFunctions = [
        startColorGame,
        startSortingGame,
        startImageGame,
        startAdditionGame
    ];

    // Loop through each game, then level up
    async function startLevel(level) {
        levelNumber.text('Level ' + level);
        for (let i = 0; i < gameFunctions.length; i++) {
            gameFunctions[i](level);
            await waitForWin();
            /*
             * POST INDIVIDUAL GAME COMPLETION DATA TO SERVER
             */
            eraseGame();
        }
        /*
         * POST LEVEL COMPLETION DATA TO SERVER
         */
        level++;
        startLevel(level);
    }

    startLevel(level);

}).fail(function() {
    console.log('Failed loading game scripts.');

    alert('Failed loading game scripts. Returning home.');
    window.location.href = '/';
});