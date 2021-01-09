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
