/***************************************************
USER DEFINED FUNCTIONS
****************************************************/

// disables the fields and displays a message to the user
function disableFields() {
    // disable the fields
    $('input[name="disease-select"]').attr("disabled", "disabled").attr('style', 'background: darkgray');
    $("#impact-select").attr("disabled", "disabled").attr('style', 'background: darkgray');
    $("#year-select").attr("disabled", "disabled").attr('style', 'background: darkgray');

    // display a message to the user
    $(".message").attr('style', 'margin-top: 100px; margin-bottom: 100px;');
    $("#loading").attr('style', 'text-align:center').text('Loading Plot - Please wait...');
}