// Change page title
d3.select("#page-title").text("Interactive Visualizations");

/***************************************************
USER DEFINED FUNCTIONS
****************************************************/

// function creates County Level Line Plot
function createCountyLevelPlot(data, state, county, impact) {
    var yearFilter = data;
    if (impact == "% Limited Access to Healthy Foods" || impact == "High School Graduation Rate") {
        yearFilter = yearFilter.filter(row => row["Year"] >= "2013");
    } else if (impact == "Food Environment Index" || impact == "% With Access to Exercise Opportunities") {
        yearFilter = yearFilter.filter(row => row["Year"] >= "2014");
    } else if (impact == "Income Ratio") {
        yearFilter = yearFilter.filter(row => row["Year"] >= "2015");
    } else {
        yearFilter = yearFilter.filter(row => row["Year"] != "2010");
    }

    var stateFilter = yearFilter.filter(row => row["State"] === state);
    var countyFilter = stateFilter.filter(row => row["County"] == county);

    // sort by year
    var countyFilter = countyFilter.sort((a, b) => b["Year"] - a["Year"]);

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
    var yearFilter = data;
    if (impact == "% Limited Access to Healthy Foods" || impact == "High School Graduation Rate") {
        yearFilter = yearFilter.filter(row => row["Year"] >= "2013");
    } else if (impact == "Food Environment Index" || impact == "% With Access to Exercise Opportunities") {
        yearFilter = yearFilter.filter(row => row["Year"] >= "2014");
    } else if (impact == "Income Ratio") {
        yearFilter = yearFilter.filter(row => row["Year"] >= "2015");
    } else {
        yearFilter = yearFilter.filter(row => row["Year"] != "2010");
    }

    var stateFilter = yearFilter.filter(row => row["State"] === state);
    var countyFilter = stateFilter.filter(row => row["County"] === "");

    var yearArray = countyFilter.map(row => row["Year"]);
    var impactArray = countyFilter.map(row => row[impact]);
    var obesityArray = countyFilter.map(row => row["% Adults with Obesity"]);
    var diabetesArray = countyFilter.map(row => row["% Adults with Diabetes"]);

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