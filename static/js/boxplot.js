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