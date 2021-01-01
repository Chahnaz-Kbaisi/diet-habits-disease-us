// Bubble Chart Plot page

// Change page title
d3.select("#page-title").text("Interactive Visualizations");

// Array variable to hold table data 
var tableData = []

// Followed the same procedure to set the filters as in the line plot
// Function creates County Level Bubble Plot
function createCountyLevelBubblePlot(data, state, county, impact) {
    var yearFilter = data;
    if (impact == "% Limited Access to Healthy Foods") {
        yearFilter = yearFilter.filter(row => row["Year"] >= "2013");
    } else if (impact == "High School Graduation Rate") {
        yearFilter = yearFilter.filter(row => row["Year"] >= "2013");
    } else if (impact == "Food Environment Index") {
        yearFilter = yearFilter.filter(row => row["Year"] >= "2014");
    } else if (impact == "% With Access to Exercise Opportunities") {
        yearFilter = yearFilter.filter(row => row["Year"] >= "2014");
    } else if (impact == "Income Ratio") {
        yearFilter = yearFilter.filter(row => row["Year"] >= "2015");
    } else {
        yearFilter = yearFilter.filter(row => row["Year"] != "2010");
    }
    var stateFilter = yearFilter.filter(row => row["State"] === state);
    var countyFilter = stateFilter.filter(row => row["County"] == county);

    var yearArray = countyFilter.map(row => row["Year"]);
    var impactArray = countyFilter.map(row => row[impact]);
    var obesityArray = countyFilter.map(row => row["% Adults with Obesity"]);
    var diabetesArray = countyFilter.map(row => row["% Adults with Diabetes"]);

    if (impact == "Median Household Income") {
        impactArray = impactArray.map(impactVal => impactVal / 1000)
        impact = impact + " (in Thousands)"
    };


    // County Level Bubble Plot:
};

// Function creates State Level Bubble Plot
function createStateLevelBubblePlot(data, state, impact) {
    var yearFilter = data;
    if (impact == "% Limited Access to Healthy Foods") {
        yearFilter = yearFilter.filter(row => row["Year"] >= "2013");
    } else if (impact == "High School Graduation Rate") {
        yearFilter = yearFilter.filter(row => row["Year"] >= "2013");
    } else if (impact == "Food Environment Index") {
        yearFilter = yearFilter.filter(row => row["Year"] >= "2014");
    } else if (impact == "% With Access to Exercise Opportunities") {
        yearFilter = yearFilter.filter(row => row["Year"] >= "2014");
    } else if (impact == "Income Ratio") {
        yearFilter = yearFilter.filter(row => row["Year"] >= "2015");
    } else {
        yearFilter = yearFilter.filter(row => row["Year"] != "2010");
    };

    var stateFilter = yearFilter.filter(row => row["State"] === state);
    var countyFilter = stateFilter.filter(row => row["County"] === "");

    var yearArray = countyFilter.map(row => row["Year"]);
    var impactArray = countyFilter.map(row => row[impact]);
    var obesityArray = countyFilter.map(row => row["% Adults with Obesity"]);
    var diabetesArray = countyFilter.map(row => row["% Adults with Diabetes"]);

    if (impact == "Median Household Income") {
        impactArray = impactArray.map(impactVal => impactVal / 1000)
        var impact = impact + " (in Thousands)"
    };

    // State Level Bubble Chart Plot
};

// Function for loading County Dropdown options
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
        };
    });
};


// Creating Event Handles

// State level Event Handler - Loading County dropdown and State/County Level Plots
function stateChanged(selectedState) {

    // Load County dropdown
    loadCountyDropDown(selectedState);

    var county = d3.select("#county-select").property("value");
    var impact = d3.select("#impact-select").property("value");

    createStateLevelBubblePlot(tableData, selectedState, impact);
    createCountyLevelBubblePlot(tableData, selectedState, county, impact);
};

// County Level Event Handler - Loading County level Plot
function countyChanged(county) {

    var state = d3.select("#state-select").property("value");
    var impact = d3.select("#impact-select").property("value");

    createCountyLevelBubblePlot(tableData, state, county, impact);
};

// Impact Event Handler - Loading State/County Level Plots
function impactChanged(impact) {

    var state = d3.select("#state-select").property("value");
    var county = d3.select("#county-select").property("value");

    createStateLevelPlot(tableData, state, impact);
    createCountyLevelPlot(tableData, state, county, impact);
};


// Loading on the Page 