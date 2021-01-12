// Change page title
d3.select("#page-title").text("Interactive Visualizations");

/***************************************************
USER DEFINED FUNCTIONS
****************************************************/

// function creates County Level Waterfall Plot
function createWaterfallPlot(data, state, county, impact) {

    yearArray = data.map(row => row["Year"]);
    obesityArray = data.map(row => row["% Adults with Obesity"]);
    diabetesArray = data.map(row => row["% Adults with Diabetes"]);
    impactArray = data.map(row => row[impact]);

    var impactArrayRelative = []
    var obesityArrayRelative = []
    var diabetesArrayRelative = []
    var impactString = impact;
    if (impact != "Income Ratio") {
        impactArray = impactArray.map(val => val / 1000);
        impactString += " (in Thousands)"
    }
    for (i = 0; i < impactArray.length; i++) {
        if (i == 0) {
            impactArrayRelative.push(impactArray[i]);
            obesityArrayRelative.push(obesityArray[i]);
            diabetesArrayRelative.push(diabetesArray[i]);
        } else {
            impactArrayRelative.push(impactArray[i] - impactArray[i - 1]);
            obesityArrayRelative.push(obesityArray[i] - obesityArray[i - 1]);
            diabetesArrayRelative.push(diabetesArray[i] - diabetesArray[i - 1]);
        }
    }
    measureArray = yearArray.map(year => "relative");
    qtrArray = yearArray.map(year => " ");
    var impactTrace = {
        type: "waterfall",
        x: [yearArray, qtrArray],
        text: impact,
        measure: measureArray,
        y: impactArrayRelative,
        name: impactString
    };

    var diabetesTrace = {
        type: "waterfall",
        x: [yearArray, qtrArray],
        text: "% Adults with Diabetes",
        measure: measureArray,
        y: diabetesArrayRelative,
        name: "% Adults with Diabetes"
    };

    var obesityTrace = {
        type: "waterfall",
        x: [yearArray, qtrArray],
        text: "% Adults with Obesity",
        measure: measureArray,
        y: obesityArrayRelative,
        name: "% Adults with Obesity"
    };

    var data = [impactTrace, diabetesTrace, obesityTrace];

    var layout = {
        waterfallgroupgap: 0.5,
        title: `${impact} vs Disease Prevalence for ${county}, ${state}`,
        xaxis: {
            title: "Year",
            tickfont: { size: 16 },
            ticks: "outside"
        }
    }
    Plotly.newPlot('waterfallPlot', data, layout);
}

// function loads County Dropdown options
function loadCountyDropDown(selectedState) {

    d3.json(`/fetchUniqueCounties/${selectedState}`).then(uniqueCounties => {

        // Load the County dropdown
        var countyDropDown = d3.select("#county-select");
        countyDropDown.html("");
        uniqueCounties.forEach(county => {
            if (county != "") {
                var cell = countyDropDown.append("option");
                cell.property("value", county).text(county);
            }
        });
        var county = d3.select("#county-select").property("value");
        var impact = d3.select("#impact-select").property("value");


        // fetch data & create plots
        d3.json(`/fetchWaterfallPlotData/${selectedState}/${county}/${impact}`).then(data => {

            createWaterfallPlot(data, selectedState, county, impact);

            // enable the fields
            d3.select("#state-select").attr("disabled", null).style("background", null);
            d3.select("#impact-select").attr("disabled", null).style("background", null);
        });
    });
}

/***************************************************
EVENT HANDLERS
****************************************************/

// State Event Handler - Load County dropdown and State/County Level Plots
function stateChanged(selectedState) {

    // Load County dropdown
    loadCountyDropDown(selectedState);

};

// County Event Handler - Load County Level Plot
function countyChanged(county) {

    var state = d3.select("#state-select").property("value");
    var impact = d3.select("#impact-select").property("value");

    // fetch data & create plots
    d3.json(`/fetchWaterfallPlotData/${state}/${county}/${impact}`).then(data => {

        createWaterfallPlot(data, state, county, impact);

    });
};

// Impact Event Handler - Load State/County Level Plots
function impactChanged(impact) {

    var state = d3.select("#state-select").property("value");
    var county = d3.select("#county-select").property("value");

    // fetch data & create plots
    d3.json(`/fetchWaterfallPlotData/${state}/${county}/${impact}`).then(data => {

        createWaterfallPlot(data, state, county, impact);

    });
};

/***************************************************
ON PAGE LOAD
****************************************************/

d3.select("#state-select").attr("disabled", "disabled").style("background", "gray");
d3.select("#impact-select").attr("disabled", "disabled").style("background", "gray");

var state = d3.select("#state-select").property("value");
var county = "Autauga";
var impact = "Median Household Income";

// load county dropdown
loadCountyDropDown(state);