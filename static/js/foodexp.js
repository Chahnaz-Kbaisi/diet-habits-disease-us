// Change page title
d3.select("#page-title").text("Interactive Visualizations");

// Array variable to hold table data 
var tableData = []

/***************************************************
USER DEFINED FUNCTIONS
****************************************************/

// function creates Stacked Bar Plot based on user's selection
function createStackedBarPlot(data, impact) {

    var yearFilter = data.filter(row => row["Year"] == "2012");

    // Get State List and State Level Obesity and Diabetes Data
    var countyFilter = yearFilter.filter(row => row["County"] == "");
    var stateArray = countyFilter.map(row => row["State"]);
    var diabetesArray = countyFilter.map(row => row["% Adults with Diabetes"]);
    var obesityArray = countyFilter.map(row => row["% Adults with Obesity"]);

    // Get impact value for each State
    var impactArray = []
    var impactFilter = yearFilter.filter(row => row[impact] != "");
    var impactString = impact;
    stateArray.forEach(state => {
        var stateFilter = impactFilter.filter(row => row["State"] == state);
        if (stateFilter.length > 0) {
            impactValue = stateFilter[0][impact]
        } else {
            impactValue = null
        }
        if (impact == "Expenditures per capita, fast food" || impact == "Expenditures per capita, restaurants") {
            impactValue = impactValue / 100;
            impactString = `${impact} $ (100's)`
        }
        impactArray.push(impactValue);
    });

    var impactTrace = {
        x: stateArray,
        y: impactArray,
        name: impactString,
        type: 'bar'
    };

    var diabetesTrace = {
        x: stateArray,
        y: diabetesArray,
        name: "% Adults with Diabetes",
        type: 'bar'
    };

    var obesityTrace = {
        x: stateArray,
        y: obesityArray,
        name: "% Adults with Obesity",
        type: 'bar'
    };
    var stackedBarData = [impactTrace, diabetesTrace, obesityTrace];

    var stackedBarLayout = {
        barmode: 'stack',
        title: `${impact} vs Disease Prevalence (2012)`,
        xaxis: { automargin: true }
    };

    Plotly.newPlot('stackedBarPlot', stackedBarData, stackedBarLayout);

}