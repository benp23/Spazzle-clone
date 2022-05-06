/* Title: Spazzle Stats Page
 * Author: Ben Paul
 * Date: 04/10/22
 * Description: Change stats on stats page
 */

/*
 * API CALL GUIDE
 * /average/total = average time of all games
 * /average/<gametype> = average time of individual puzzles
 * /average/addition = not working
 * /game_count/total = number of games played
 */

// Send user back home
$("#back_button").click(function() {
    window.location.href = '/';
});

(async function() {

    // Display error message and return home
    function statsError(error) {
        if (error === 'error') {
            alert('Unable to read username. Please play a game to register a username. Returning home.');
        } else {
            alert('⚠ Connection error: ' + error.status + ' - ' + error.statusText + ' Returning home.');
        }
        window.location.href = '/';
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

    // Fetch game data
    async function fetchData(url, method, data) {
        console.log(data);
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

    // Turn seconds into time string text
    function formatTime(time) {
        let seconds = time;
        console.log(seconds);
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
        return hours + ':' + minutes + ':' + seconds;
    }

    // Variables for modifying stats page values
    const highlightsTitles = $(".highlights_title");
    const highlightsNumbers = $(".highlights_number");
    const statsTable = $("#stats_table");
    let statsCells = $(".stats_cell");
    const statsRow = '<tr class="stats_row"><th class="stats_cell">--</th><th class="stats_cell">--</th><th class="stats_cell">--</th></tr>';

    // Modify stat values
    function changeStats(data, labelSelector, labelText, statSelector, time) {
        if (data === '') {
            return;
        }
        if (labelSelector.length === 0 && statSelector.length === 0) {
            statsTable.append(statsRow);
            statsCells = $(".stats_cell");
            let cellsLength = statsCells.length;
            labelSelector = statsCells.eq(cellsLength - 3);
            statSelector = statsCells.eq(cellsLength - 1);
        }
        labelSelector.text(labelText);
        let dataValue = Math.round(Object.values(data)[0]);
        if (time === 'seconds') {
            dataValue = formatTime(dataValue);
        }
        if (time === 'milliseconds') {
            dataValue += ' ms'
        }
        statSelector.text(dataValue);
    }

    // API calls for Stat Highlights
    changeStats(await fetchData('/stats/' + username + '/average/total', 'GET'),
        highlightsTitles.eq(0),
        'AVERAGE GAME TIME',
        highlightsNumbers.eq(0),
        'seconds');
    changeStats(await fetchData('/stats/' + username + '/game_count/total', 'GET'),
        highlightsTitles.eq(1),
        'GAMES PLAYED',
        highlightsNumbers.eq(1),
        '');

    // API calls for Stats Table
    changeStats(await fetchData('/stats/' + username + '/average/color', 'GET'),
        statsCells.eq(0),
        'Color Time',
        statsCells.eq(2),
        'milliseconds');
    changeStats(await fetchData('/stats/' + username + '/average/sort', 'GET'),
        statsCells.eq(3),
        'Sort Time',
        statsCells.eq(5),
        'milliseconds');
    changeStats(await fetchData('/stats/' + username + '/average/image', 'GET'),
        statsCells.eq(6),
        'Image Time',
        statsCells.eq(8),
        'milliseconds');
    changeStats(await fetchData('/stats/' + username + '/average/addition', 'GET'),
        statsCells.eq(9),
        'Addition Time',
        statsCells.eq(11),
        'milliseconds');
    changeStats(await fetchData('/stats/' + username + '/average/word', 'GET'),
        statsCells.eq(12),
        'Word Time',
        statsCells.eq(14),
        'milliseconds');
    changeStats(await fetchData('/stats/' + username + '/average/number', 'GET'),
        statsCells.eq(15),
        'Number Time',
        statsCells.eq(17),
        'milliseconds');
    //await fetchData('/stats/' + username + '/average/level');

    /*
     * DROPDOWN DOESN'T WORK YET. USE THIS TO TEST VARIOUS API CALLS INSTEAD.
     */
    $("#stat_select").change(async function() {
        let optionSelected = $(this).val();
        //let statsResponse;
        let statsData;
        switch (optionSelected) {
            case '1':
                statsData = await fetchData('/stats/' + username + '/average', 'GET');
                console.log(statsData);
                /*
                await statsResponse.json().then(function(data) {
                    console.log(data);
                    statsJSON = data;
                    console.log(statsJSON);
                });
                */
                //changeStats(statsData);
                break;
            case '2':
                statsData = await fetchData('/stats/' + username + '/count', 'GET');
                console.log(statsData);
                /*
                await statsResponse.json().then(function(data) {
                    console.log(data);
                    statsJSON = data;
                    console.log(statsJSON);
                });
                */
                //changeStats(statsData);
                break;
            case '3':
                statsData = await fetchData('/stats/' + username + '/average/total', 'GET');
                console.log(statsData);
                /*
                await statsResponse.json().then(function(data) {
                    statsJSON = data;
                    console.log(statsJSON);
                });
                */
                //changeStats(statsData);
                break;
            case '4':
                statsData = await fetchData('/stats/' + username + '/count/total', 'GET');
                console.log(statsData);
                /*
                await statsResponse.json().then(function(data) {
                    statsJSON = data;
                    console.log(statsResponse);
                });
                */
                //changeStats(statsData);
                break;
        }
        console.log(optionSelected);
        /* Change stats based on option selected */
    });

})();