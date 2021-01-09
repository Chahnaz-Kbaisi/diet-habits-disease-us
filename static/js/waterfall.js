// Change page title
d3.select("#page-title").text("Interactive Visualizations");
console.log("Hiii from JS");

// Array variable to hold table data 
var tableData = []

/***************************************************
USER DEFINED FUNCTIONS
****************************************************/

// function creates County Level Waterfall Plot
function createWaterfallPlot(data, state, county, impact) {
    var yearArray;
    
    var impactFilter = tableData.filter(row => row[impact] != "");
    console.log("impactFilter",impactFilter);
    var stateFilter = impactFilter.filter(row => row["State"] == state);
    console.log("stateFilter",stateFilter);
    var countyFilter = stateFilter.filter(row => row["County"] == county);
    console.log("countyFilter",countyFilter);
    countyFilter.sort(function (a,b) {return d3.ascending(a["Year"], b["Year"]);});
    // countyFilter = countyFilter.sort(d3.ascending);

    yearArray = countyFilter.map(row => row["Year"]);
    obesityArray = countyFilter.map(row => row["% Adults with Obesity"]);
    diabetesArray = countyFilter.map(row => row["% Adults with Diabetes"]);
    impactArray = countyFilter.map(row => row[impact]);
    console.log(yearArray, obesityArray, diabetesArray, impactArray);

    var impactArrayRelative = []
    var obesityArrayRelative = []
    var diabetesArrayRelative = []
    var impactString = impact;
    if (impact != "Income Ratio"){
        impactArray = impactArray.map(val => val/1000);
        impactString += " (in Thousands)"
        console.log("impactArray in thousands", impactArray);
    }
    for(i=0; i < impactArray.length; i++){
        if(i == 0){
            impactArrayRelative.push(impactArray[i]);
            obesityArrayRelative.push(obesityArray[i]);
            diabetesArrayRelative.push(diabetesArray[i]);
        }else{
            impactArrayRelative.push(impactArray[i] - impactArray[i-1]);
            obesityArrayRelative.push(obesityArray[i] - obesityArray[i-1]);
            diabetesArrayRelative.push(diabetesArray[i] - diabetesArray[i-1]);
        }
    }
    console.log("Relative arrays", impactArrayRelative, obesityArrayRelative, diabetesArrayRelative);
    measureArray = yearArray.map(year => "relative");
    console.log("measureArray", measureArray);
    var impactTrace = {
        type: "waterfall",
        x: [yearArray, yearArray],
        text: impact,
        measure: measureArray,
        y: impactArrayRelative,
        name: impactString
    };

    var diabetesTrace = {
        type: "waterfall",
        x: [yearArray, yearArray],
        text: "% Adults with Diabetes",
        measure: measureArray,
        y: diabetesArrayRelative,
        name: "% Adults with Diabetes"
    };

    var obesityTrace = {
        type: "waterfall",
        x: [yearArray, yearArray],
        text: "% Adults with Obesity",
        measure: measureArray,
        y: obesityArrayRelative,
        name: "% Adults with Obesity"
    };

    var data = [impactTrace, diabetesTrace, obesityTrace];

    var layout = {
        waterfallgroupgap : 0.5,
        title: `${impact} vs Disease Prevalence`,
        xaxis: {
        title: "Year",
        tickfont: {size: 16},
        ticks: "outside"
        }
    }
    Plotly.newPlot('waterfallPlot', data, layout);
    // var impactTrace = {
    //     x: yearArray,
    //     y: impactArray,
    //     name: impact,
    //     mode: 'lines+markers',
    // };

    // var obesityTrace = {
    //     x: yearArray,
    //     y: obesityArray,
    //     name: '% Adults with Obesity',
    //     mode: 'lines+markers',
    // };

    // var diabetesTrace = {
    //     x: yearArray,
    //     y: diabetesArray,
    //     name: '% Adults with Diabetes',
    //     mode: 'lines+markers',
    // };

    // var dataCountyLevelPlot = [impactTrace, obesityTrace, diabetesTrace];

    // var layoutCountyLevelPlot = {
    //     title: `${impact} vs Disease Prevalence - ${county},${state}`
    // };

    // Plotly.newPlot('countyLevelPlot', dataCountyLevelPlot, layoutCountyLevelPlot);
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
