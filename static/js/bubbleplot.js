// Bubble Chart Plot page

// Change page title
d3.select("#page-title").text("Interactive Visualizations");

// Array variable to hold table data 
var tableData = []

// Followed the same procedure to set the filters as in the line plot
// Function creates County Level Bubble Plot
function createsCountyLevelBubblePlot(data, state, county, impact) {
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
        };

// State Level Bubble Chart Plot

// Function loads County Dropdown options


// Creating Event Handles

// State level Event Handler - Loading County dropdown and State/County Level Plots

// County Level Event Handler - Loading County level Plot

// Impact Event Handler - Loading State/County Level Plots


// Loading on the Page 