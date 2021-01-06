// State and County borders GeoJSON files 
var geoCountyJSONFile = "static/data/US_Counties_Geometry.json";
var geoStateJSONFile = "static/data/US_States_Geometry.json";

// Global variables
var year = "2020";
var impact = "% Adults with Obesity";
var geoJsonStateFile;
var geoJsonCountyFile;
var map;
var geojson;
var legend;
var mongoDBdata;
var prevZoom;
var API_KEY;

// fetch API_KEY
d3.json('/getapikey').then(key => {
    API_KEY = key;
});

/***************************************************
USER DEFINED FUNCTIONS
****************************************************/

// Disables the fields and displays a message to the user
function disableFields() {
    // disable the fields
    $("#impact-select").attr("disabled", "disabled").attr('style', 'background: darkgray');
    $("#year-select").attr("disabled", "disabled").attr('style', 'background: darkgray');

    // display a message to the user
    $(".message").attr('style', 'margin-top: 100px; margin-bottom: 100px;');
    $("#loading").attr('style', 'text-align:center').text('Loading Map - Please wait...');
}

// Enables the fields and removes the message
function enableFields() {
    // remove the message
    $(".message").attr('style', null);
    $("#loading").attr('style', null).text("");

    // enable the fields
    $("#impact-select").attr("disabled", null).attr('style', null);
    $("#year-select").attr("disabled", null).attr('style', null);
}

// Loads the year dropdown based on the user selected impact option
function loadYear(impact, selectedYear) {
    var yearList = [];
    if (impact == "% Limited Access to Healthy Foods" || impact == "High School Graduation Rate") {
        yearList = [2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013];
    } else if (impact == "Food Environment Index" || impact == "% With Access to Exercise Opportunities") {
        yearList = [2020, 2019, 2018, 2017, 2016, 2015, 2014];
    } else if (impact == "Income Ratio") {
        yearList = [2020, 2019, 2018, 2017, 2016, 2015];
    } else if (impact == 'Expenditures per capita, fast food' || impact == 'Expenditures per capita, restaurants' || impact == "Direct farm sales per capita") {
        yearList = [2012];
    } else if (impact == 'Household Income (Hispanic)' || impact == 'Household Income (Black)' || impact == "Household Income (White)") {
        yearList = [2020, 2019, 2018, 2017];
    } else if (impact == 'Household Income (Asian)') {
        yearList = [2020];
    } else {
        yearList = [2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011];
    }
    var yearDropDown = d3.select("#year-select")
    yearDropDown.html("");
    yearList.forEach(year => {
        var cell = yearDropDown.append("option");
        cell.property("value", year).text(year);
    });
}

// Creates the map based on user selections
function createJsonMap(level) {
    console.log("createJsonMap");
    if (level == "County") {
        removeMarkers();
        countyMap();
    } else {
        console.log("State Level");
        removeMarkers();
        stateMap();
        console.log("Created State Level Map");
    }
}

// function to remove geoJSON layers 
function removeMarkers() {
    map.eachLayer(function(layer) {
        if (layer.myTag && layer.myTag === "myGeoJSON") {
            map.removeLayer(layer);
        }
    });
}