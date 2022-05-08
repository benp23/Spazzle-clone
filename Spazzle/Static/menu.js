/* Title: Spazzle Menu Homepage
 * Author: Ben Paul
 * Date: 04/08/22
 * Description: Adds event listeners and animations/effects to menu.html. Sets username/game_mode/muted cookies.
 * Makes an API call to register a username.
 */

(function() {

    // Set cookie expiration date
    let cookieExpire = "expires=Wed, 16 Jan 2030 12:00:00 UTC";

    $("#github_button").click(function() {
        window.open('https://github.com/Wheels17/Spazzle', '_blank').focus();
    });

    // Read whether sound is true/false from cookies
    function readSound() {
        let getCookies = decodeURIComponent(document.cookie);
        let mutedMatch = getCookies.match(/muted=(.*?)(;|$)/);
        if (mutedMatch !== null && mutedMatch[1] !== undefined && mutedMatch[1] !== '') {
            if (mutedMatch[1] === 'true') {
                $("#OFF").css('background-color', '#add8e6');
            } else {
                $("#ON").css('background-color', '#add8e6');
            }
        } else {
            $("#ON").css('background-color', '#add8e6');
        }
    }
    readSound();
    
    // Change sound to true/false in cookies
    $("#ON, #OFF").click(function() {
        $("#ON, #OFF").css('background-color', '#eeeeee');
        $(this).css('background-color', '#add8e6');
        let muted;
        if ($(this).attr('id') == 'OFF') {
            muted = true;
        } else {
            muted = false;
        }
        document.cookie = "muted=" + muted + "; " + cookieExpire;
    });

    // Menu selection animations/effects
    let lastMenuIndex = -1;
    $('.menu_item').mouseover(function() {
        let thisMenuItem = $(this);
        $('.menu_item').each(function() {
            $(this).attr('style', '');
        });
        thisMenuItem.attr('style', 'transform: translate(1px, -1px); text-shadow: 1px 1px 1px #333333;');
        let menuIndex = thisMenuItem.parent().index();
        let menuDescription = $("#menu_description");
        if (lastMenuIndex !== menuIndex) {
            menuDescription.hide();
        }
        let menuDescriptionText = '';
        switch (menuIndex) {
            case 0:
                // Speed mode description
                menuDescriptionText = 'Race against the clock. Reach the highest level you can in the allotted time.'
                    + ' If you fail a puzzle, it\'s gameover.';
                break;
            case 1:
                // Level mode description
                menuDescriptionText = 'How far can you go? With no set time limit, keep climbing until you fail.';
                break;
            case 2:
                // Infinite mode description
                menuDescriptionText = 'There\'s no time limit and you can\'t lose. This is a great way to practice.';
                break;
            case 3:
                // Statistics description
                menuDescriptionText = 'View your game statistics.';
                break;
        }
        menuDescription.text(menuDescriptionText);
        menuDescription.fadeIn(400);
        lastMenuIndex = menuIndex;
    });

    // Show/hide modal window functions
    let thisMode;
    $("#speed_mode, #level_mode, #infinite_mode").click(function() {
        // Set the mode depending on what was clicked
        switch ($(this).attr('id')) {
            case "speed_mode":
                thisMode = 'speed';
                break;
            case "level_mode":
                thisMode = 'level';
                break;
            case "infinite_mode":
                thisMode = 'infinite';
                break;
        }
        $("#username_modal").show();
    });
    // Close the modal window
    $("#close_modal").click(function() {
        $("#username_modal").hide();
    });
    $(window).click(function(event) {
        if (event.target.id === 'username_modal') {
            $("#username_modal").hide();
        }
    });

    // Fetch API call function
    async function fetchData(url, method, data) {
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
        return response;
    }

    // Whenever cookie storage or API call doesn't go as expected
    function registerError(message) {
        $('#username_input').prop('disabled', false);
        $("#username_message").text('Something went wrong. Make sure cookies are enabled and please try again.')
            .css('color', '#FF0000').show();
        console.log('Something went wrong - Cookies: ' + document.cookie + ' | Message: ' + message);
    }

    // Get username saved in cookies and display it
    function verifyUser() {
        let getCookies = decodeURIComponent(document.cookie);
        if (getCookies === '') return undefined;
        let userMatch = getCookies.match(/username=(.*?)(;|$)/);
        if (userMatch !== null && userMatch[1] !== undefined && userMatch[1] !== '') {
            $("#username_input").val(userMatch[1]);
            $('#username_input').prop('disabled', true);
        } else {
            registerError(userMatch[1]);
        }
        return userMatch[1];
    }
    verifyUser();

    // Overwrite username cookie and game mode cookies
    function overwriteUser(username) {
        let usernameCookie = encodeURIComponent(username);
        document.cookie = "username=" + usernameCookie + "; " + cookieExpire;
    }
    function overwriteMode(mode) {
        let modeCookie = encodeURIComponent(mode);
        document.cookie = "gamemode=" + modeCookie + "; " + cookieExpire;
    }

    // Submit username
    $("#username_form").submit(async function(event) {
        event.preventDefault();
        let username = $("#username_input").val();
        $("#username_input").val('');
        // Prevent blank username
        if (username === '') {
            $("#username_message").text('Username Invalid').css('color', '#FF0000').show();
            return;
        }
        // Register username
        let usernameResponse = await fetchData('/users/register', 'POST', {username: username});
        if (usernameResponse.ok) {
            // Read the username that was just posted
            await usernameResponse.json().then(function(data) {
                postedUsername = data.message.split(' ')[0];
            });
            // Set cookies
            overwriteUser(postedUsername);
            overwriteMode(thisMode);
            // Verify that the written cookie username is the same as the server username
            if (verifyUser() === postedUsername) {
                $("#username_message").text('Username Accepted').css('color', '#00FF00').show();
                console.log('Cookies: ' + document.cookie + ' | Posted Username: ' + postedUsername);
                // Comment out below line to prevent redirect and view console.log information
                window.location.href = '/game';
            } else {
                registerError('Posted Username - ' + postedUsername);
            }
        } else {
            registerError(usernameResponse.status + ' - ' + usernameResponse.statusText);
        }
    });

    $("#statistics").click(function() {
        window.location.href = '/stats';
    });

})();