/* Title: Spazzle Menu Homepage
 * Author: Ben Paul
 * Date: 04/08/22
 * Description: Adds event listeners and animations/effects to menu.html 
 */

(function(){

    $("#github_button").click(function(){
        window.location.href = 'https://github.com/Wheels17/Spazzle';
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
        let menuDescription = $("#menu_description")
        if (lastMenuIndex !== menuIndex) {
            menuDescription.hide();
        }
        let menuDescriptionText = '';
        switch (menuIndex) {
            case 0:
                // Speed mode description
                menuDescriptionText = 'Race against the clock. Reach the highest level you can in the alloted time. If you fail a puzzle, it\'s gameover.';
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
        /*
            Retrieve previously used usernames from cookies
        */
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

    $("#start_button").click(function() {
        let username = $("#username_input").val();
        /*
            POST/PUT selected username to API
                on success = redirect to game
                on error = error handling
        */
        window.location.href += 'game';
    });

    $("#username_form").submit(function(event) {
        event.preventDefault();
        let username = $("#username_input").val();
        /*
            POST/PUT selected username to API
                on success = redirect to game
                on error = error handling
        */
        window.location.href += 'game';
    });

    $("#statistics").click(function() {
        window.location.href += 'stats';
    });

})();

