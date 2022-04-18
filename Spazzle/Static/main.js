// Global variables
let winGame = false;
let level = 1;
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
    
// End the game
quitButton.click(function() {
    window.location.href = '/';
});

/* Found this online to load multiple scripts then execute function when done.
 * Not 100% sure how the Deferred method works here but it works.
 */
$.when(
    $.getScript('/static/color_matcher.js'),
    $.getScript('/static/sort_canvas.js'),
    $.getScript('/static/addition_animated.js'),
    $.getScript('/static/image_matching.js'),
    $.Deferred(function(deferred) {
        $(deferred.resolve);
    })
).done(function() {
    console.log('done');

    /* Found this async/await idea online that waits for a user input.
     * It uses a while loop that checks a boolean every 50 ms.
     */

    // sets a timeout for the while loop in waitForWin()
    const timeout = async time => new Promise(resolve => setTimeout(resolve, time));

    async function waitForWin() {
        // Checks if user won the game every 50 ms
        while (winGame === false) {
            await timeout(50);
            // console.log('winGame = ' + winGame);
        }
        winGame = false;
    }

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

    /* List all the main game functions here.
     * Use "return winGame = true;" inside where the game file checks for the win condition
     */
    async function startLevel(level) {
        levelNumber.text('Level ' + level);
        // Begin timer function and display it
        gameTimer.text('0:00');
        startColorGame(level);
        await waitForWin();
        eraseGame();
        startSortingGame(level);
        await waitForWin();
        eraseGame();
        startImageGame(level);
        await waitForWin();
        eraseGame();
        startAdditionGame(level);
        await waitForWin();
        eraseGame();
        level++;
        startLevel(level);
    }

    startLevel(level);

}).fail(function() {
    console.log('failed');
});