// Change page title
d3.select("#page-title").text("Interactive Visualizations");

/***************************************************
USER DEFINED FUNCTIONS
****************************************************/

// function creates County Level Line Plot
function createCountyLevelPlot(data, state, county, impact) {

    // sort by year
    var countyFilter = data.sort((a, b) => b["Year"] - a["Year"]);

    var yearArray = countyFilter.map(row => row["Year"]);
    var impactArray = countyFilter.map(row => row[impact]);
    var obesityArray = countyFilter.map(row => row["% Adults with Obesity"]);
    var diabetesArray = countyFilter.map(row => row["% Adults with Diabetes"]);

    if (impact == "Median Household Income") {
        impactArray = impactArray.map(impactVal => impactVal / 1000)
        impact = impact + " (in Thousands)"
    }
    var impactTrace = {
        x: yearArray,
        y: impactArray,
        name: impact,
        mode: 'lines+markers',
    };

    var obesityTrace = {
        x: yearArray,
        y: obesityArray,
        name: '% Adults with Obesity',
        mode: 'lines+markers',
    };

    var diabetesTrace = {
        x: yearArray,
        y: diabetesArray,
        name: '% Adults with Diabetes',
        mode: 'lines+markers',
    };

    var dataCountyLevelPlot = [impactTrace, obesityTrace, diabetesTrace];

    var layoutCountyLevelPlot = {
        title: `${impact} vs Disease Prevalence - ${county},${state}`
    };

    Plotly.newPlot('countyLevelPlot', dataCountyLevelPlot, layoutCountyLevelPlot);
}

// function creates State Level Line Plot
function createStateLevelPlot(data, state, impact) {

    var yearArray = data.map(row => row["Year"]);
    var impactArray = data.map(row => row[impact]);
    var obesityArray = data.map(row => row["% Adults with Obesity"]);
    var diabetesArray = data.map(row => row["% Adults with Diabetes"]);

    if (impact == "Median Household Income") {
        impactArray = impactArray.map(impactVal => impactVal / 1000)
        var impact = impact + " (in Thousands)"
    }

    var impactTrace = {
        x: yearArray,
        y: impactArray,
        name: impact,
        mode: 'lines+markers',
    };

    var obesityTrace = {
        x: yearArray,
        y: obesityArray,
        name: '% Adults with Obesity',
        mode: 'lines+markers',
    };

    var diabetesTrace = {
        x: yearArray,
        y: diabetesArray,
        name: '% Adults with Diabetes',
        mode: 'lines+markers',
    };
    var dataStateLevelPlot = [impactTrace, obesityTrace, diabetesTrace];

    var layoutStateLevelPlot = {
        title: `${impact} vs Disease Prevalence - ${state}`
    };

    Plotly.newPlot('stateLevelPlot', dataStateLevelPlot, layoutStateLevelPlot);
}

// function loads County Dropdown options
function loadCountyDropDown(selectedState) {

    // fetch unique counties for state
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
        var impact = d3.select("#state-impact-select").property("value");

        // fetch data & create plots
        d3.json(`/fetchPlotStateCountyData/${selectedState}/${county}/${impact}`).then(data => {

            var countyData = data[0]["CountyPlotData"];
            var stateData = data[0]["StatePlotData"];

            // create state level and county level plots
            createStateLevelPlot(stateData, selectedState, impact);
            createCountyLevelPlot(countyData, selectedState, county, impact);

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

    // Load county dropdown and create plots
    loadCountyDropDown(selectedState);

};

// County Event Handler - Load County Level Plot
function countyChanged(county) {

    var state = d3.select("#state-select").property("value");
    var impact = d3.select("#impact-select").property("value");

    // fetch data & create plots
    d3.json(`/fetchPlotStateCountyData/${state}/${county}/${impact}`).then(data => {
        var countyData = data[0]["CountyPlotData"];
        createCountyLevelPlot(countyData, state, county, impact);
    });
};

// Impact Event Handler - Load State/County Level Plots
function impactChanged(impact) {

    var state = d3.select("#state-select").property("value");
    var county = d3.select("#county-select").property("value");
    // fetch data & create plots
    d3.json(`/fetchPlotStateCountyData/${state}/${county}/${impact}`).then(data => {
        var countyData = data[0]["CountyPlotData"];
        var stateData = data[0]["StatePlotData"];
        createStateLevelPlot(stateData, state, impact);
        createCountyLevelPlot(countyData, state, county, impact);
    });
};

/***************************************************
ON PAGE LOAD
****************************************************/
// Disable the fields until the plots are loaded
d3.select("#state-select").attr("disabled", "disabled").style("background", "gray");
d3.select("#impact-select").attr("disabled", "disabled").style("background", "gray");


var state = d3.select("#state-select").property("value");
var county = "Autauga";
var impact = "% Limited Access to Healthy Foods";

// load county dropdown
loadCountyDropDown(state);