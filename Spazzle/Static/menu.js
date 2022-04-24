/* Title: Spazzle Menu Homepage
 * Author: Ben Paul
 * Date: 04/08/22
 * Description: Adds event listeners and animations/effects to menu.html 
 */

(function() {

    $("#github_button").click(function() {
        window.open('https://github.com/Wheels17/Spazzle', '_blank').focus();
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
                menuDescriptionText = 'Race against the clock. Reach the highest level you can in the alloted time.'
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

    // Show/hide modal window
    $("#speed_mode, #level_mode, #infinite_mode").click(function() {
        $("#username_modal").show();
    });
    $("#close_modal").click(function() {
        $("#username_modal").hide();
    });
    $(window).click(function(event) {
        if (event.target.id === 'username_modal') {
            $("#username_modal").hide();
        }
    });

    // Fetch API error handler
    function errorHandler(response) {
        if (!response.ok) {
            throw Error (response);
        }
        return response;
    }

    // Fetch API call function
    async function fetchData(url, method, data) {
        let response = await fetch(url, {
            method: method,
            body: JSON.stringify(data),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        }).then(errorHandler)
        .then(function(response) {
            console.log(response);
            return response;
        }).catch(function(error) {
            console.log(error)
            return error;
        });
        return response;
    }

    // Get username saved in cookies and display it
    function getUser() {
        let getCookies = decodeURIComponent(document.cookie);
        console.log(getCookies);
        if (getCookies === '') return;
        let userCookie = getCookies.split('username=')[1];
        console.log(userCookie);
        if (userCookie !== 'undefined') {
            $("#username_input").val(userCookie);
        }
    }
    getUser();

    // Overwrite username cookie
    function overwriteUser(username) {
        let usernameCookie = encodeURIComponent(username);
        console.log(usernameCookie);
        document.cookie = "username=" + usernameCookie + "; expires=Wed, 16 Jan 2030 12:00:00 UTC";
        console.log(document.cookie);
    }

    // Submit username
    $("#username_form").submit(async function(event) {
        event.preventDefault();
        let username = $("#username_input").val();
        // Prevent blank username
        if (username === '') {
            $("#username_message").text('Username Invalid').css('color', '#FF0000').show();
            return;
        }
        // Register username
        let usernameResponse = await fetchData('/users/register', 'POST', {username: username});
        console.log(usernameResponse);
        if (usernameResponse.ok) {
            overwriteUser(username);
            $("#username_message").text('Username Accepted').css('color', '#00FF00').show();
            // Comment out below line to prevent redirect and view console.log information
            window.location.href = '/game';
        } else {
            $("#username_message").text('Something went wrong. Please try again later.').css('color', '#FF0000').show();
        }
    });

    $("#statistics").click(function() {
        window.location.href = '/stats';
    });

})();

