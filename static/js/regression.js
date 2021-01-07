var mongoDBdata;
var impactArray;
var diseaseArray;
var stateArray;
var countyArray;
var regressionArray;
var rSquared;
var lineEquation;
var hoverTextArray;

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

// Fetches data from Remote MongoDB
function fetchMongoData() {
    d3.json('/fetchdata').then(data => {

        mongoDBdata = data;

        var year = "2020";
        var impact = "% Limited Access to Healthy Foods";
        var disease = "% Adults with Obesity";

        // Dynamically inject the data for user selection into geoJSON file
        createRegressionPlot(disease, impact, year);

        // Enable the fields and remove the message
        enableFields();

    });
}

// generates the regression plot and displays the plot in the page
function createRegressionPlot(disease, impact, year) {

    var expenditureImpacts = ['Expenditures per capita, fast food',
        'Expenditures per capita, restaurants'
    ];
    var incomeImpacts = ['Household Income (Asian)',
        'Household Income (Black)',
        'Household Income (Hispanic)',
        'Household Income (White)'
    ];
    if (d3.set(expenditureImpacts).has(impact)) {
        var yearFilter = mongoDBdata.filter(row => row["Year"] == year);

        // Get State List and State Level Obesity (or) Diabetes Data
        var countyFilter = yearFilter.filter(row => row["County"] == "");
        stateArray = countyFilter.map(row => row["State"]);
        diseaseArray = countyFilter.map(row => row[disease]);

        // Get impact value for each State
        impactArray = []
        var impactFilter = yearFilter.filter(row => row[impact] != "");
        stateArray.forEach(state => {
            var stateFilter = impactFilter.filter(row => row["State"] == state);
            if (stateFilter.length > 0) {
                impactValue = stateFilter[0][impact]
            } else {
                impactValue = null
            }
            impactArray.push(impactValue);
        });
        hoverTextArray = stateArray;
    } else if (d3.set(incomeImpacts).has(impact)) {
        var yearFilter = mongoDBdata.filter(row => row["Year"] == year);
        var impactFilter = yearFilter.filter(row => row[impact] != "");
        diseaseArray = impactFilter.map(row => row[disease]);
        impactArray = impactFilter.map(row => row[impact]);
        stateArray = impactFilter.map(row => row["State"]);
        countyArray = impactFilter.map(row => row["County"]);
        hoverTextArray = countyArray.map(function(county, index) {
            return county + " , " + stateArray[index];
        });
    } else if (impact == "Direct farm sales per capita") {
        var yearFilter = mongoDBdata.filter(row => row["Year"] == year);
        var impactFilter = yearFilter.filter(row => row[impact] != "");
        var countyFilter = impactFilter.filter(row => row["County"] != "");
        diseaseArray = countyFilter.map(row => row[disease]);
        impactArray = countyFilter.map(row => row[impact]);
        stateArray = countyFilter.map(row => row["State"]);
        countyArray = countyFilter.map(row => row["County"]);
        hoverTextArray = countyArray.map(function(county, index) {
            return county + " , " + stateArray[index];
        });
    } else {
        var yearFilter = mongoDBdata.filter(row => row["Year"] == year);
        var countyFilter = yearFilter.filter(row => row["County"] == "");
        diseaseArray = countyFilter.map(row => row[disease]);
        impactArray = countyFilter.map(row => row[impact]);
        stateArray = countyFilter.map(row => row["State"]);
        hoverTextArray = stateArray;
    }

    $.getJSON('/fetchRegressionLine', {
        impactArray: JSON.stringify(impactArray),
        diseaseArray: JSON.stringify(diseaseArray)
    }, function(data) {
        sortedImpactArray = data[0]["X"];
        regressionArray = data[0]["Y"];
        rSquared = data[0]["R"];
        lineEquation = data[0]["EQUATION"];

        // remove the previous plot (if any)
        $("#regressionPlot").empty();

        var scatterTrace = {
            x: impactArray,
            y: diseaseArray,
            mode: 'markers',
            name: "",
            text: hoverTextArray,
            marker: {
                color: 'rgb(55, 128, 191)',
                size: 10
            }
        };

        var lineTrace = {
            x: sortedImpactArray,
            y: regressionArray,
            mode: 'lines+markers',
            name: `R<sup>2</sup> = ${rSquared}`,
            text: `R<sup>2</sup> = ${rSquared} <br> ${lineEquation}`,
            line: {
                color: 'rgb(128, 0, 128)',
                width: 5
            },
            marker: {
                color: "white",
                size: 2
            }
        };

        var data = [scatterTrace, lineTrace];

        var layout = {
            title: `${impact} vs ${disease} (${year})`,
            xaxis: {
                title: impact,
                showline: true,
                linecolor: 'black',
                ticks: 'inside',
                tickcolor: 'black',
                tickwidth: 1
            },
            yaxis: {
                title: disease
            }
        };

        Plotly.newPlot('regressionPlot', data, layout);
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
    } else if (impact == 'Expenditures per capita, fast food' || impact == 'Expenditures per capita, restaurants' || impact == "Direct farm sales per capita") {
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

    // disable fields and display message to user
    disableFields();

    createRegressionPlot(disease, impact, year);

    // Enable the fields and remove the message
    enableFields();
});

// generates regression plot based on user selections
$('input[name="disease-select"]').change(function() {
    var disease = $(this).attr('id');
    var impact = $("#impact-select").val();
    var year = $("#year-select").val();

    // disable fields and display message to user
    disableFields();

    createRegressionPlot(disease, impact, year);

    // Enable the fields and remove the message
    enableFields();
});

// loads the year dropdown based on the user selected impact option and
// generates regression plot based on user selections
$("#impact-select").change(function() {
    var impact = $(this).val();
    var selectedYear = $("#year-select").val();

    loadYear(impact);

    var year;
    if (impact == "% Limited Access to Healthy Foods" || impact == "High School Graduation Rate") {
        if (selectedYear >= 2013) {
            year = selectedYear;
            $("#year-select").val(selectedYear);
        } else {
            year = $("#year-select").val();
        }
    } else if (impact == "Food Environment Index" || impact == "% With Access to Exercise Opportunities") {
        if (selectedYear >= 2014) {
            year = selectedYear;
            $("#year-select").val(selectedYear);
        } else {
            year = $("#year-select").val();
        }
    } else if (impact == "Income Ratio") {
        if (selectedYear >= 2015) {
            year = selectedYear;
            $("#year-select").val(selectedYear);
        } else {
            year = $("#year-select").val();
        }
    } else if (impact == "Expenditures per capita, fast food" || impact == "Expenditures per capita, restaurants" || impact == "Direct farm sales per capita") {
        year = 2012;
    } else if (impact == 'Household Income (Hispanic)' || impact == 'Household Income (Black)' || impact == "Household Income (White)") {
        if (selectedYear >= 2017) {
            year = selectedYear;
            $("#year-select").val(selectedYear);
        } else {
            year = $("#year-select").val();
        }
    } else if (impact == 'Household Income (Asian)') {
        year = 2020;
        $("#year-select").val(year);
    } else {
        year = selectedYear;
        $("#year-select").val(selectedYear);
    }

    var disease = $("input[type='radio'][name='disease-select']:checked").attr('id');

    // disable fields and display message to user
    disableFields();

    createRegressionPlot(disease, impact, year);

    // Enable the fields and remove the message
    enableFields();
});

/***************************************************
ON PAGE LOAD
****************************************************/

// change page title
d3.select("#page-title").text("Interactive Visualizations");

var year = "2020";
var impact = "% Limited Access to Healthy Foods";
var disease = "% Adults with Obesity";

// load the year dropdown
loadYear(impact);

// disable fields and display message to user
disableFields();

// Fetch data from remote DB and generate the plot
fetchMongoData();