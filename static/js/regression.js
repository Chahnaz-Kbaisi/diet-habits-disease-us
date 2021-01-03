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

// enables the fields and removes the message
function enableFields() {
    // remove the message
    $(".message").attr('style', null);
    $("#loading").attr('style', null).text("");

    // enable the fields
    $('input[name="disease-select"]').attr("disabled", null).attr('style', null);
    $("#impact-select").attr("disabled", null).attr('style', null);
    $("#year-select").attr("disabled", null).attr('style', null);
}

// generates the regression plot and displays the plot in the page
function createRegressionPlot(disease, impact, year) {
    // disable fields and display message to user
    disableFields();

    // remove the previous plot (if any)
    $("#regressionPlot").empty();

    // generate regression plot
    var url = "/embedRegression/" + year + "/" + impact + "/" + disease;
    $.get(url, function(data) {
        // display the generated plot in the page
        $("#regressionPlot").append(data);

        // enable the fields and remove the message
        enableFields();
    });
}