// Global variables
let winGame = false;
let endGame = false;
let level = 1;
let totalTime;
const quitButton = $("#quit_button");
const gameHeading = $("#game_heading");
const levelNumber = $("#level_number");
const gameTimer = $("#game_timer");
const gameCanvasID = $("#game_canvas");
const gameCanvas = gameCanvasID.get(0);
const context = gameCanvas.getContext("2d");
const gameDiv = $("#game_div");
const answerInline = $("#answer_inline");
const errorText = $("#error_text");
const leaderboardModal = $("#leaderboard_modal");
const finalMessage = $("#final_message");
const returnButton = $("#return_button");
let colorMatchOrder = [];

// Match canvas html size with canvas element size
function resizeCanvas() {
    gameCanvas.height = gameCanvasID.height();
    gameCanvas.width = gameCanvasID.width();
}

// Get and show leaderboard at the end of game
function showLeaderboard(mode, message) {
    finalMessage.text(message);
    /*
     * GET LEADERBOARD REQUEST
     */
    leaderboardModal.show();
    returnButton.click(function() {
        window.location.href = '/';
    });
}

// Add given amount of seconds to timer and format it
function changeTime(amount) {
    if (mode === 'speed') {
        totalTime -= amount;
    } else {
        totalTime += amount;
    }
    let seconds = totalTime;
    let minutes = 0;
    let hours = 0;
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
    if (totalTime <= 0 && mode === 'speed') {
        return gameOver(mode);
    }
    return gameTimerText;
}

// Display API call error message to user
let errorMessage = setTimeout(function(){}, 0);
function failMessage(response) {
    clearTimeout(errorMessage);
    errorText.text('⚠ Connection error: '
        + response.status + ' - ' + response.statusText + '. Your stats failed to save.');
    errorText.fadeIn(800);
    errorMessage = setTimeout(function() {
        errorText.fadeOut(800);
    }, 4000);
}

// Post game data
async function postData(url, method, data) {
    let response = await fetch(url, {
        method: method,
        body: JSON.stringify(data),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    }).then(function(response) {
        // Throw error
        if (!response.ok) {
            throw response;
        }
        return response;
    }).catch(function(error) {
        // Handle different types of errors
        if (typeof error.json !== 'function') {
            return {
                ok: false,
                status: error.name,
                statusText: error.message
            }
        } else {
            return error;
        }
    });
    if (!response.ok) {
        // Notify the user of any API errors
        failMessage(response);
    } else {
        // Log data
        await response.json().then(function(data) {
            console.log(data);
        });
    }
    return response;
}

// Game Over function
async function gameOver(mode) {
    // Stop game win condition and timer
    endGame = true;
    let finalMessage = '';
    // Final POST to server
    if (mode !== 'error') {
        let finalResponse = await postData('/game/total', 'POST',
            {username: username, game_run: 1, game_mode: mode, total_game_time: totalTime});
        if (!finalResponse.ok) {
            finalMessage = '⚠ Connection error: '
                + finalResponse.status + ' - ' + finalResponse.statusText + '. Your final stats failed to save.';
        }
    }
    // Return to home if there is an error reading from cookies
    if (mode === 'error') {
        alert('⚠ Oops, something went wrong. Unable to read username and/or game mode from cookies.'
            + finalMessage + ' Returning home.');
        window.location.href = '/';
    }
    if (mode === 'speed') {
        finalMessage = 'Game Over! Congratulations, you reached level ' + level + '!' + finalMessage;
        showLeaderboard(mode, finalMessage);
    }
    if (mode === 'level' || mode === 'infinite') {
        let finalTime = changeTime(0);
        finalMessage = 'Game Over! Congratulations, you reached level ' + level + ' with a time of '
            + finalTime + '!' + finalMessage;
        showLeaderboard(mode, finalMessage);
    }
    return;
}

// Read username from cookies
function readUser() {
    let getCookies = decodeURIComponent(document.cookie);
    if (getCookies === '') {
        gameOver('error');
        return '';
    }
    let userMatch = getCookies.match(/username=(.*?)(;|$)/);
    if (userMatch !== null && userMatch[1] !== undefined && userMatch[1] !== '') {
        return userMatch[1];
    } else {
        gameOver('error');
        return '';
    }
}
// Set username
const username = readUser();

// Read game mode from cookies
function readMode() {
    let getCookies = decodeURIComponent(document.cookie);
    if (getCookies === '') {
        gameOver('error');
        return 'error';
    }
    let modeMatch = getCookies.match(/gamemode=(.*?)(;|$)/);
    if (modeMatch !== null && modeMatch[1] !== undefined && modeMatch[1] !== '') {
        // Total game time in seconds - starting number based on game mode;
        if (modeMatch[1] === 'speed') {
            totalTime = 5 * 60;
            gameTimer.text('0:05:00');
        } else {
            totalTime = 0;
            gameTimer.text('0:00:00');
        }
        return modeMatch[1];
    } else {
        gameOver('error');
        return 'error';
    }
}
// Set the game mode
const mode = readMode();

// End the game
quitButton.click(function() {
    gameOver(mode);
});

// Wait for all scripts to load before calling done()
$.when(
    $.getScript('/static/color_matcher.js'),
    $.getScript('/static/sort_canvas.js'),
    $.getScript('/static/addition_animated.js'),
    $.getScript('/static/image_matching.js'),
    $.getScript('/static/word_scramble.js')

).done(function() {
    console.log('Done loading game scripts.');

    // Timer variables
    const oneSecond = 1000;
    let expectedTime = Date.now() + oneSecond;
    /* setTimeout/setInterval do not track time accurately.
     * Use the Date object to correct the time.
     */
    function timer() {
        if (endGame) {
            return;
        }
        // Find the drift in milliseconds to correct the timer
        let drift = Date.now() - expectedTime;
        let numberOfSeconds = 1;
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
        while (winGame === false && !endGame) {
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
        startAdditionGame,
        startWordScramble,
    ];

    // The time an individual game starts
    let startTime = Date.now();
    // Time an individual game ends
    let endTime;
    // Time it took to finish an individual game
    let gameTime;
    // Time it took to finish the level
    let levelTime = 0;
    // Loop through each game, then level up
    async function startLevel(currentLevel) {
        levelNumber.text('Level ' + currentLevel);
        for (let i = 0; i < gameFunctions.length; i++) {
            gameFunctions[i](currentLevel);
            await waitForWin();
            if (endGame) {
                return;
            }
            // Post game data
            endTime = Date.now();
            gameTime = endTime - startTime;
            levelTime += gameTime;
            startTime = endTime;
            postData('/game/time', 'POST', {username: username, game_run: 1, game_type: i + 1, game_time: gameTime});
            eraseGame();
        }
        /*
         * POST LEVEL COMPLETION DATA TO SERVER
         */
        //postData();
        levelTime = 0;
        level++;
        startLevel(level);
    }

    startLevel(level);

}).fail(function() {
    console.log('Failed loading game scripts.');

    alert('Failed loading game scripts. Returning home.');
    window.location.href = '/';
});
