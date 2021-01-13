var mongoDBdata;
var impactArray;
var diseaseArray;
var stateArray;
var countyArray;
var regressionArray;
var rSquared;
var lineEquation;
var hoverTextArray;
var analysisWriteups;

/***************************************************
USER DEFINED FUNCTIONS
****************************************************/

// Fetches data from Remote MongoDB
function fetchMongoData() {
    d3.json('/fetchBoxPlotData').then(data => {

        mongoDBdata = data;

        // create box plot
        createBoxPlot();

    });

}

function createBoxPlot() {
    var impactNames = [
        "% Adults with Diabetes",
        "% Adults with Obesity",
        "% Limited Access to Healthy Foods",
        "% Physically Inactive",
        "% Some College",
        "% Unemployed",
        "% With Access to Exercise Opportunities",
        "Direct farm sales per capita",
        "Expenditures per capita, fast food",
        "Expenditures per capita, restaurants",
        "Food Environment Index",
        "High School Graduation Rate",
        "Household Income (Asian)",
        "Household Income (Black)",
        "Household Income (Hispanic)",
        "Household Income (White)",
        "Income Ratio",
        "Median Household Income"
    ];
    var impact_dict = {};
    impactNames.forEach(function(impact) {
        impact_dict[impact] = mongoDBdata.map(row => row[impact]).filter(value => value != "");
    });

    new_impact_dict = {}
    Object.keys(impact_dict).forEach(function(key) {
        if (impact_dict[key].length > 0) {
            if (key == "Household Income (Black)" ||
                key == "Household Income (Hispanic)" ||
                key == "Household Income (White)" ||
                key == "Median Household Income") {
                new_impact_dict[key + ` (in 1000's)`] = impact_dict[key].map(val => val / 1000);
            } else {
                new_impact_dict[key] = impact_dict[key];
            }
        }
    });

    var data = []
    Object.keys(new_impact_dict).forEach(function(key) {
        var trace = {
            y: new_impact_dict[key],
            type: 'box',
            name: key,
            marker: {
                color: 'rgb(8,81,156)',
                outliercolor: 'rgba(219, 64, 82, 0.6)',
                line: {
                    outliercolor: 'rgba(219, 64, 82, 1.0)',
                    outlierwidth: 2
                }
            },
            boxpoints: 'suspectedoutliers'
        };
        data.push(trace);
    });
    console.log("Data length", data.length);
    var layout = {
        title: 'Box Plot for the Diseases and all Factors at US Level',
        xaxis: { automargin: true }
    };
    Plotly.newPlot('boxplotb', data, layout);
}

/***************************************************
ON PAGE LOAD
****************************************************/

// change page title
d3.select("#page-title").text("Interactive Visualizations");

// Fetch data from remote DB and generate the plot
fetchMongoData();