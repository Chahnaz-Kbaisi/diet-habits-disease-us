// Change page title
d3.select("#page-title").text("Interactive Visualizations");


/***************************************************
USER DEFINED FUNCTIONS
****************************************************/

// function creates Stacked Bar Plot based on user's selection
function createStackedBarPlot(impact) {
    // fetch data for plotting
    d3.json(`/fetchStackedBarPlotData/${impact}`).then(data => {

        // Get State List and State Level Obesity, Diabetes and Impact Data
        var stateArray = data.map(row => row["State"]);
        var diabetesArray = data.map(row => row["% Adults with Diabetes"]);
        var obesityArray = data.map(row => row["% Adults with Obesity"]);
        var impactArray = data.map(row => row[impact]);
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
    });
}

/***************************************************
EVENT HANDLERS
****************************************************/

// Impact Event Handler - Load Histogram Plots
function impactChanged(impact) {

    createStackedBarPlot(tableData, impact);

};

/***************************************************
ON PAGE LOAD
****************************************************/
var prevImpactBkgnd = d3.select("#impact-select").style("background");
d3.select("#impact-select").attr("disabled", "disabled").style("background", "gray");

// fetch data, load county dropdown & create plots
d3.json('/fetchdata').then(data => {
    tableData = data;
    d3.select("#impact-select").attr("disabled", null).style("background", null);

    var impact = d3.select("#impact-select").property("value");

    createStackedBarPlot(tableData, impact);
});