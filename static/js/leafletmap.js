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