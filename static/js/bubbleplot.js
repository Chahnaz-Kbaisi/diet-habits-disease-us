// Bubble Chart Plot page

// Change page title
d3.select("#page-title").text("Interactive Visualizations");

// Followed the same procedure to set the filters as in the line plot
// Function creates County Level Bubble Plot
function createCountyLevelBubblePlot(data, state, county, impact) {
    // Sort by year
    var countyFilter = data.sort((a, b) => b["Year"] - a["Year"]);

    var yearArray = countyFilter.map(row => row["Year"]);
    var impactArray = countyFilter.map(row => row[impact]);
    var obesityArray = countyFilter.map(row => row["% Adults with Obesity"]);
    var diabetesArray = countyFilter.map(row => row["% Adults with Diabetes"]);

    if (impact == "Median Household Income") {
        impactArray = impactArray.map(impactVal => impactVal / 1000)
        impact = impact + " (in Thousands)"
    };

    opacity = yearArray.map(id => 0.95);

    //   County Level Bubble Plot:
    var impactTrace = {
        x: yearArray,
        y: impactArray,
        text: impact,
        name: impact,
        mode: 'markers',
        marker: {
            color: yearArray,
            colorscale: "Rainbow",
            opacity: opacity,
            size: impactArray
        },
    };

    var obesityTrace = {
        x: yearArray,
        y: obesityArray,
        text: `Obesity %`,
        name: '% Adults with Obesity',
        mode: 'markers',
        marker: {
            color: yearArray,
            colorscale: "Rainbow",
            opacity: opacity,
            size: obesityArray
        },
    };

    var diabetesTrace = {
        x: yearArray,
        y: diabetesArray,
        text: `Diabetes %`,
        name: '% Adults with Diabetes',
        mode: 'markers',
        marker: {
            color: yearArray,
            colorscale: "Rainbow",
            opacity: opacity,
            size: diabetesArray
        },
    };

    // Create the data arrays for the plot
    var dataCountyLevelPlot = [impactTrace, obesityTrace, diabetesTrace];

    // Define the plot layout
    var layoutCountyLevelPlot = {
        title: `${impact} vs Disease Prevalence - ${county}, ${state}`,

        // Adding ticks on the axis
        xaxis: {
            showgrid: true,
            showline: true,
            linecolor: 'rgb(200, 0, 0)',
            ticks: 'inside',
            tickcolor: 'rgb(200, 0, 0)',
            tickwidth: 1
        },

        yaxis: {
            showgrid: true,
            showline: true,
            linecolor: 'rgb(200, 0, 0)',
            ticks: 'inside',
            tickcolor: 'rgb(200, 0, 0)',
            tickwidth: 1
        },

        paper_bgcolor: 'RGB(219, 233, 235)',
        plot_bgcolor: 'RGB(219, 233, 235)'

    };

    // Plot the "bubble" plot
    Plotly.newPlot('countyLevelPlot', dataCountyLevelPlot, layoutCountyLevelPlot);
};

// Function creates State Level Bubble Plot
function createStateLevelBubblePlot(data, state, impact) {

    // Sort by year
    var data = data.sort((a, b) => b["Year"] - a["Year"]);

    var yearArray = data.map(row => row["Year"]);
    var impactArray = data.map(row => row[impact]);
    var obesityArray = data.map(row => row["% Adults with Obesity"]);
    var diabetesArray = data.map(row => row["% Adults with Diabetes"]);

    if (impact == "Median Household Income") {
        impactArray = impactArray.map(impactVal => impactVal / 1000)
        var impact = impact + " (in Thousands)"
    };

    opacity = yearArray.map(id => 0.95);

    //   State Level Bubble Plot: 
    var impactTrace = {
        x: yearArray,
        y: impactArray,
        text: impact,
        name: impact,
        mode: 'markers',
        marker: {
            color: yearArray,
            colorscale: 'Rainbow',
            opacity: opacity,
            size: impactArray
        }
    };

    var obesityTrace = {
        x: yearArray,
        y: obesityArray,
        text: `Obesity %`,
        name: '% Adults with Obesity',
        mode: 'markers',
        marker: {
            color: yearArray,
            colorscale: "Rainbow",
            opacity: opacity,
            size: obesityArray
        }
    };

    var diabetesTrace = {
        x: yearArray,
        y: diabetesArray,
        text: `Diabetes %`,
        name: '% Adults with Diabetes',
        mode: 'markers',
        marker: {
            color: yearArray,
            colorscale: "Rainbow",
            opacity: opacity,
            size: diabetesArray
        }
    };

    // Create the data arrays for the plot
    var dataStateLevelPlot = [impactTrace, obesityTrace, diabetesTrace];

    // Define the plot layout
    var layoutStateLevelPlot = {
        title: `${impact} vs Disease Prevalence - ${state}`,

        // Adding ticks on the axis
        xaxis: {
            showgrid: true,
            showline: true,
            linecolor: 'rgb(200, 0, 0)',
            ticks: 'inside',
            tickcolor: 'rgb(200, 0, 0)',
            tickwidth: 1
        },

        yaxis: {
            showgrid: true,
            showline: true,
            linecolor: 'rgb(200, 0, 0)',
            ticks: 'inside',
            tickcolor: 'rgb(200, 0, 0)',
            tickwidth: 1
        },

        paper_bgcolor: 'RGB(219, 233, 235)',
        plot_bgcolor: 'RGB(219, 233, 235)'
    };

    // Plot the "bubble" plot
    Plotly.newPlot('stateLevelPlot', dataStateLevelPlot, layoutStateLevelPlot);

};

// Function for loading County Dropdown options
function loadCountyDropDown(selectedState) {

    // Fetch unique counties for state
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

        // Fetch data & create plots
        d3.json(`/fetchPlotStateCountyData/${selectedState}/${county}/${impact}`).then(data => {

            var countyData = data[0]["CountyPlotData"];
            var stateData = data[0]["StatePlotData"];

            createStateLevelBubblePlot(stateData, selectedState, impact);
            createCountyLevelBubblePlot(countyData, selectedState, county, impact);

            // Enable fields
            d3.select("#state-select").attr("disabled", null).style("background", null);
            d3.select("#county-select").attr("disabled", null).style("background", null);
            d3.select("#impact-select").attr("disabled", null).style("background", null);
        });
    });
};


// Creating Event Handles

// State level Event Handler - Loading County dropdown and State/County Level Plots
function stateChanged(selectedState) {

    // Disable fields
    d3.select("#state-select").attr("disabled", "disabled").style("background", "gray");
    d3.select("#county-select").attr("disabled", "disabled").style("background", "gray");
    d3.select("#impact-select").attr("disabled", "disabled").style("background", "gray");

    // Load County dropdown and create plots
    loadCountyDropDown(selectedState);

};

// County Level Event Handler - Loading County level Plot
function countyChanged(county) {

    var state = d3.select("#state-select").property("value");
    var impact = d3.select("#impact-select").property("value");

    // Disable fields
    d3.select("#state-select").attr("disabled", "disabled").style("background", "gray");
    d3.select("#county-select").attr("disabled", "disabled").style("background", "gray");
    d3.select("#impact-select").attr("disabled", "disabled").style("background", "gray");

    // Fetch data & create plots
    d3.json(`/fetchPlotStateCountyData/${state}/${county}/${impact}`).then(data => {

        var countyData = data[0]["CountyPlotData"];

        createCountyLevelBubblePlot(countyData, state, county, impact);

        // Enable fields
        d3.select("#state-select").attr("disabled", null).style("background", null);
        d3.select("#county-select").attr("disabled", null).style("background", null);
        d3.select("#impact-select").attr("disabled", null).style("background", null);
    });
};

// Impact Event Handler - Loading State/County Level Plots
function impactChanged(impact) {

    var state = d3.select("#state-select").property("value");
    var county = d3.select("#county-select").property("value");

    // Disable fields
    d3.select("#state-select").attr("disabled", "disabled").style("background", "gray");
    d3.select("#county-select").attr("disabled", "disabled").style("background", "gray");
    d3.select("#impact-select").attr("disabled", "disabled").style("background", "gray");

    // Fetch data & create plots
    d3.json(`/fetchPlotStateCountyData/${state}/${county}/${impact}`).then(data => {
        var countyData = data[0]["CountyPlotData"];
        var stateData = data[0]["StatePlotData"];
        createStateLevelBubblePlot(stateData, state, impact);
        createCountyLevelBubblePlot(countyData, state, county, impact);

        // Enable fields
        d3.select("#state-select").attr("disabled", null).style("background", null);
        d3.select("#county-select").attr("disabled", null).style("background", null);
        d3.select("#impact-select").attr("disabled", null).style("background", null);
    });
};


// On Page Load 
d3.select("#state-select").attr("disabled", "disabled").style("background", "gray");
d3.select("#county-select").attr("disabled", "disabled").style("background", "gray");
d3.select("#impact-select").attr("disabled", "disabled").style("background", "gray");

var state = d3.select("#state-select").property("value");
var county = "Autauga";
var impact = "% Limited Access to Healthy Foods";

// Load county dropdown
loadCountyDropDown(state);