/* Title: Spazzle Stats Page
 * Author: Ben Paul
 * Date: 04/10/22
 * Description: Change stats on stats page
 */

$("#back_button").click(function() {
    window.location.href = '/';
});

$("#stat_select").change(function() {
    let optionSelected = $(this).val();
    /* Change stats based on option selected */
});