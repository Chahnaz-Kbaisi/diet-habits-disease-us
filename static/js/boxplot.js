// Change page title
d3.select("#page-title").text("Interactive Visualizations");

// Array variable to hold table data 
var tableData = []

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
    // Box Plot - County Level 