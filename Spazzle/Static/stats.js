/* Title: Spazzle Stats Page
 * Author: Ben Paul
 * Date: 04/10/22
 * Description: Change stats on the stats page. Makes many API calls to retrieve and display player
 * statistical information.
 */

// Send user back home
$("#back_button").click(function() {
    window.location.href = '/';
});

(async function() {
   
    // Display error message and returns home
    function statsError(error) {
        if (error === 'error') {
            alert('Unable to read username. Please play a game to register a username. Returning home.');
        } else if (error === 'Please Register First') {
            alert('Username doesn\'t exist. Please play a game to register a username. Returning home.');
        } else {
            alert('⚠ Connection error: ' + error.status + ' - ' + error.statusText + '. Returning home.');
        }
        window.location.href = '/';
    }

    // Fetch game data
    async function fetchData(url, method, data) {
        let options = {
            method
        };
        if (method !== 'GET') {
            options.body = JSON.stringify(data);
        }
        options.headers = {"Content-type": "application/json; charset=UTF-8"};
        let response = await fetch(url, options).then(function(response) {
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
        console.log(response);
        if (!response.ok) {
            // Notify the user of any API errors
            statsError(response);
            return '';
        } else {
            // Get data
            response = await response.json().then(function(data) {
                console.log(data);
                return data;
            });
        }
        return response;
    }

    // Read username from cookies
    function readUser() {
        let getCookies = decodeURIComponent(document.cookie);
        if (getCookies === '') {
            statsError('error');
            return '';
        }
        let userMatch = getCookies.match(/username=(.*?)(;|$)/);
        if (userMatch !== null && userMatch[1] !== undefined && userMatch[1] !== '') {
            return userMatch[1];
        } else {
            statsError('error');
            return '';
        }
    }
    // Set username
    const username = readUser();
    $("#user_heading").text(username);

    // Check if the username isn't in the database, then return error
    let registeredResponse = await fetchData('/stats/' + username + '/total_runs/average/total', 'GET');
    let registered = Object.values(registeredResponse)[0];
    if (registered !== undefined && registered.Message === 'Please Register First') {
        statsError(registered.Message);
        return;
    }

    // Turn seconds into time string text
    function formatTime(time) {
        let seconds = time;
        console.log(seconds);
        let minutes = 0;
        let hours = 0;
        // Convert seconds to 0:00:00 format
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
        return hours + ':' + minutes + ':' + seconds;
    }

    // Variables for modifying stats page values
    const highlightsTitles = $(".highlights_title");
    const highlightsNumbers = $(".highlights_number");
    const statsTable = $("#stats_table");
    let statsCells = $(".stats_cell");
    const statsRow = '<tr class="stats_row"><th class="stats_cell">--</th><th class="stats_cell">--</th><th class="stats_cell">--</th></tr>';

    // Modify stat values
    function changeStats(data, labelSelector, labelText, statSelector, type) {
        // Data is empty when fetch returns an error
        if (data === '') {
            return;
        }
        // Get data value from {key: value}
        let dataValue = Object.values(data)[0];
        // Fill value with '--' if not a stat
        if (dataValue === 'Stat not supported' || dataValue === 'Not a supported game type' || dataValue === null) {
            dataValue = '--';
        }
        // If selectors don't exist in the table, create new rows, then assign selectors
        if (labelSelector.length === 0 && statSelector.length === 0) {
            statsTable.append(statsRow);
            statsCells = $(".stats_cell");
            let cellsLength = statsCells.length;
            labelSelector = statsCells.eq(cellsLength - 3);
            if (type === 'count') {
                statSelector = statsCells.eq(cellsLength - 2);
            } else {
                statSelector = statsCells.eq(cellsLength - 1);
            }
        }
        // Highest fetch call returns array as value, get the level and time
        if (labelText === 'HIGHEST LEVEL' && dataValue !== '--') {
            dataValue = dataValue[2];
        }
        if (labelText === 'HIGHEST LEVEL TIME' && dataValue !== '--') {
            dataValue = dataValue[3];
        }
        labelSelector.text(labelText);
        // Format data value based on type
        if (dataValue !== '--') {
            if (type === 'seconds') {
                dataValue = Math.round(dataValue);
                dataValue = formatTime(dataValue);
            }
            if (type === 'milliseconds') {
                dataValue += ' s'
            }
        }
        // Write the stat value to the page
        statSelector.text(dataValue);
    }

    // Gets stats based on mode selected
    async function callStatsForMode(mode) {
        // For if mode is not all modes, offset the index because 'levels' isn't called
        let offset = 0;
        if (mode !== 'total_runs') {
            offset = 3;
        }

        // ************************ API Calls For Stats Highlights *************************
        // Average time of all game runs (seconds)
        changeStats(await fetchData('/stats/' + username + '/' + mode + '/average/total', 'GET'),
            highlightsTitles.eq(0),
            'AVERAGE GAME TIME',
            highlightsNumbers.eq(0),
            'seconds');
        // Number of games played
        changeStats(await fetchData('/stats/' + username + '/' + mode + '/count/total', 'GET'),
            highlightsTitles.eq(1),
            'GAMES PLAYED',
            highlightsNumbers.eq(1),
            'count');
        // Highest level reached - returns {"highest": [game_run, game_mode, level, time]}
        changeStats(await fetchData('/stats/' + username + '/' + mode + '/highest/total', 'GET'),
            highlightsTitles.eq(2),
            'HIGHEST LEVEL',
            highlightsNumbers.eq(2),
            'count');
        // Highest level time - returns {"highest": [game_run, game_mode, level, time]}
        changeStats(await fetchData('/stats/' + username + '/' + mode + '/highest/total', 'GET'),
            highlightsTitles.eq(3),
            'HIGHEST LEVEL TIME',
            highlightsNumbers.eq(3),
            'seconds');

        // ************************ API Calls For Stats Table *************************
        // ********************************** COUNTS **********************************
        if (mode === 'total_runs') {
            changeStats(await fetchData('/stats/' + username + '/' + mode + '/count/levels', 'GET'),
                statsCells.eq(0),
                'Levels',
                statsCells.eq(1),
                'count');
        }
        changeStats(await fetchData('/stats/' + username + '/' + mode + '/count/all_games', 'GET'),
            statsCells.eq(3 - offset),
            'All Puzzles',
            statsCells.eq(4 - offset),
            'count');
        changeStats(await fetchData('/stats/' + username + '/' + mode + '/count/color', 'GET'),
            statsCells.eq(6 - offset),
            'Color Matcher',
            statsCells.eq(7 - offset),
            'count');
        changeStats(await fetchData('/stats/' + username + '/' + mode + '/count/sort', 'GET'),
            statsCells.eq(9 - offset),
            'Token Sorter',
            statsCells.eq(10 - offset),
            'count');
        changeStats(await fetchData('/stats/' + username + '/' + mode + '/count/image', 'GET'),
            statsCells.eq(12 - offset),
            'Image Match',
            statsCells.eq(13 - offset),
            'count');
        changeStats(await fetchData('/stats/' + username + '/' + mode + '/count/addition', 'GET'),
            statsCells.eq(15 - offset),
            'Speed Addition',
            statsCells.eq(16 - offset),
            'count');
        changeStats(await fetchData('/stats/' + username + '/' + mode + '/count/word', 'GET'),
            statsCells.eq(18 - offset),
            'Word Scramble',
            statsCells.eq(19 - offset),
            'count');
        changeStats(await fetchData('/stats/' + username + '/' + mode + '/count/number', 'GET'),
            statsCells.eq(21 - offset),
            'Numbered Order',
            statsCells.eq(22 - offset),
            'count');

        // ********************************** AVERAGES **********************************
        if (mode === 'total_runs') {
            changeStats(await fetchData('/stats/' + username + '/' + mode + '/average/levels', 'GET'),
                statsCells.eq(0),
                'Levels',
                statsCells.eq(2),
                'milliseconds');
        }
        changeStats(await fetchData('/stats/' + username + '/' + mode + '/average/all_games', 'GET'),
            statsCells.eq(3 - offset),
            'All Puzzles',
            statsCells.eq(5 - offset),
            'milliseconds');
        changeStats(await fetchData('/stats/' + username + '/' + mode + '/average/color', 'GET'),
            statsCells.eq(6 - offset),
            'Color Matcher',
            statsCells.eq(8 - offset),
            'milliseconds');
        changeStats(await fetchData('/stats/' + username + '/' + mode + '/average/sort', 'GET'),
            statsCells.eq(9 - offset),
            'Token Sorter',
            statsCells.eq(11 - offset),
            'milliseconds');
        changeStats(await fetchData('/stats/' + username + '/' + mode + '/average/image', 'GET'),
            statsCells.eq(12 - offset),
            'Image Match',
            statsCells.eq(14 - offset),
            'milliseconds');
        changeStats(await fetchData('/stats/' + username + '/' + mode + '/average/addition', 'GET'),
            statsCells.eq(15 - offset),
            'Speed Addition',
            statsCells.eq(17 - offset),
            'milliseconds');
        changeStats(await fetchData('/stats/' + username + '/' + mode + '/average/word', 'GET'),
            statsCells.eq(18 - offset),
            'Word Scramble',
            statsCells.eq(20 - offset),
            'milliseconds');
        changeStats(await fetchData('/stats/' + username + '/' + mode + '/average/number', 'GET'),
            statsCells.eq(21 - offset),
            'Numbered Order',
            statsCells.eq(23 - offset),
            'milliseconds');
    }
    // Fill page with stats on page load
    await callStatsForMode('total_runs');

    // Dropdown changes stats based on mode
    $("#stat_select").change(async function() {
        // Reset values before calls
        highlightsTitles.text('--');
        highlightsNumbers.eq(0).text('0:00:00');
        highlightsNumbers.eq(1).text('00');
        highlightsNumbers.eq(2).text('00');
        highlightsNumbers.eq(3).text('0:00:00');
        statsCells.text('--');
        let optionSelected = $(this).val();
        // Make API calls for stats based on the mode selected
        switch (optionSelected) {
            case '1':
                await callStatsForMode('total_runs');
                break;
            case '2':
                await callStatsForMode('speed');
                break;
            case '3':
                await callStatsForMode('level');
                break;
            case '4':
                await callStatsForMode('infinite');
                break;
        }
    });

})();