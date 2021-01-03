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

// loads the year dropdown based on the user selected impact option
function loadYear(impact) {
    var yearList = [];
    if (impact == "% Limited Access to Healthy Foods" || impact == "High School Graduation Rate") {
        yearList = [2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013];
    } else if (impact == "Food Environment Index" || impact == "% With Access to Exercise Opportunities") {
        yearList = [2020, 2019, 2018, 2017, 2016, 2015, 2014];
    } else if (impact == "Income Ratio") {
        yearList = [2020, 2019, 2018, 2017, 2016, 2015];
    } else if (impact == 'Expenditures per capita, fast food' || impact == 'Expenditures per capita, restaurants' || impact == "Direct farm sales per capita") {
        yearList = [2012];
    } else if (impact == 'Household Income (Hispanic)' || impact == 'Household Income (Black)' || impact == "Household Income (White)") {
        yearList = [2020, 2019, 2018, 2017];
    } else if (impact == 'Household Income (Asian)') {
        yearList = [2020];
    } else {
        yearList = [2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011];
    }
    var yearDropDown = d3.select("#year-select")
    yearDropDown.html("");
    yearList.forEach(year => {
        var cell = yearDropDown.append("option");
        cell.property("value", year).text(year);
    });
}

/***************************************************
EVENT HANDLERS
****************************************************/

// generates regression plot based on user selections
$("#year-select").change(function() {
    var year = $(this).val();
    var impact = $("#impact-select").val();
    var disease = $("input[type='radio'][name='disease-select']:checked").attr('id');

    createRegressionPlot(disease, impact, year);
});