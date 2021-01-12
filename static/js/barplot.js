// Change page title
d3.select("#page-title").text("Interactive Visualizations");


/***************************************************
USER DEFINED FUNCTIONS
****************************************************/

// function creates County Level Bar Plot
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

    // Trace for impact
    var impactTrace = {
        x: yearArray,
        y: impactArray,
        name: impact,
        type: 'bar',
    };
    // Trace for obesity
    var obesityTrace = {
        x: yearArray,
        y: obesityArray,
        name: '% Adults with Obesity',
        type: 'bar',
    };
    // Trace for diabetes
    var diabetesTrace = {
        x: yearArray,
        y: diabetesArray,
        name: '% Adults with Diabetes',
        type: 'bar'
    };

    var dataCountyLevelPlot = [impactTrace, obesityTrace, diabetesTrace];

    var layoutCountyLevelPlot = {
        title: `${impact} vs Disease Prevalence - ${county},${state}`,
        barmode: 'group'
    };

    Plotly.newPlot('countyLevelPlot', dataCountyLevelPlot, layoutCountyLevelPlot);
};

// function creates State Level Bar Plot
function createStateLevelPlot(data, state, impact) {

    // sort by year
    var data = data.sort((a, b) => b["Year"] - a["Year"]);

    var yearArray = data.map(row => row["Year"]);
    var impactArray = data.map(row => row[impact]);
    var obesityArray = data.map(row => row["% Adults with Obesity"]);
    var diabetesArray = data.map(row => row["% Adults with Diabetes"]);

    if (impact == "Median Household Income") {
        impactArray = impactArray.map(impactVal => impactVal / 1000)
        var impact = impact + " (in Thousands)"
    }
    // Bar Plot State

    var impactTrace = {
        x: yearArray,
        y: impactArray,
        name: impact,
        type: 'bar',
    };

    var obesityTrace = {
        x: yearArray,
        y: obesityArray,
        name: '% Adults with Obesity',
        type: 'bar',
    };

    var diabetesTrace = {
        x: yearArray,
        y: diabetesArray,
        name: '% Adults with Diabetes',
        type: 'bar',
    };
    var dataStateLevelPlot = [impactTrace, obesityTrace, diabetesTrace];

    var layoutStateLevelPlot = {
        title: `${impact} vs Disease Prevalence - ${state}`,
        barmode: 'group'
    };

    Plotly.newPlot('stateLevelPlot', dataStateLevelPlot, layoutStateLevelPlot);
}

// function loads County Dropdown options
function loadCountyDropDown(selectedState) {
    var stateFilteredData = tableData.filter(row => row.State === selectedState);
    var countiesList = stateFilteredData.map(row => row.County);
    var uniqueCounties = d3.set(countiesList).values();

    // sort the counties in ascending
    uniqueCounties.sort(d3.ascending)

    // Load the County dropdown
    var countyDropDown = d3.select("#county-select");
    countyDropDown.html("");
    uniqueCounties.forEach(county => {
        if (county != "") {
            var cell = countyDropDown.append("option");
            cell.property("value", county).text(county);
        }
    });
}

/***************************************************
EVENT HANDLERS
****************************************************/

// State Event Handler - Load County dropdown and State/County Level Plots
function stateChanged(selectedState) {

    // Load County dropdown
    loadCountyDropDown(selectedState);

    var county = d3.select("#county-select").property("value");
    var impact = d3.select("#impact-select").property("value");

    createStateLevelPlot(tableData, selectedState, impact);
    createCountyLevelPlot(tableData, selectedState, county, impact);
};

// County Event Handler - Load County Level Plot
function countyChanged(county) {

    var state = d3.select("#state-select").property("value");
    var impact = d3.select("#impact-select").property("value");

    createCountyLevelPlot(tableData, state, county, impact);
};

// Impact Event Handler - Load State/County Level Plots
function impactChanged(impact) {

    var state = d3.select("#state-select").property("value");
    var county = d3.select("#county-select").property("value");

    createStateLevelPlot(tableData, state, impact);
    createCountyLevelPlot(tableData, state, county, impact);
};

/***************************************************
ON PAGE LOAD
****************************************************/
var prevStateBkgnd = d3.select("#state-select").style("background");
var prevImpactBkgnd = d3.select("#impact-select").style("background");
d3.select("#state-select").attr("disabled", "disabled").style("background", "gray");
d3.select("#impact-select").attr("disabled", "disabled").style("background", "gray");

// fetch data, load county dropdown & create plots
d3.json('/fetchdata').then(data => {
    tableData = data;
    d3.select("#state-select").attr("disabled", null).style("background", null);
    d3.select("#impact-select").attr("disabled", null).style("background", null);

    var state = d3.select("#state-select").property("value");

    // load county dropdown
    loadCountyDropDown(state);

    var county = d3.select("#county-select").property("value");
    var impact = d3.select("#impact-select").property("value");

    createStateLevelPlot(tableData, state, impact);
    createCountyLevelPlot(tableData, state, county, impact);
});