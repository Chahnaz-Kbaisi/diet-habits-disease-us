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

// Removes geoJSON layers 
function removeMarkers() {
    map.eachLayer(function(layer) {
        if (layer.myTag && layer.myTag === "myGeoJSON") {
            map.removeLayer(layer);
        }
    });
}

// Fetches data from Remote MongoDB
function fetchMongoData() {
    d3.json('/fetchdata').then(data => {
        // d3.json("/fetchdata", function(data) {
        mongoDBdata = data;
        console.log(mongoDBdata);
        // Dynamically inject the data for user selection into geoJSON file
        createGeoJsonFiles();

        // Initialize prevZoom with current zoom level
        prevZoom = map.getZoom();
    });
}

// Injects data inside geoJSON files
function createGeoJsonFiles() {
    console.log("createGeoJsonFiles");

    var year = $("#year-select").val();
    var impact = $("#impact-select").val()
        // d3.json(geoStateJSONFile, function(geoJsonStatedata) {
    d3.json(geoStateJSONFile).then(geoJsonStatedata => {

        var geoFeatures = geoJsonStatedata.features;

        geoFeatures.forEach(feature => {
            var FIPS = parseInt(feature.properties["STATE"]);
            var yearFilter = mongoDBdata.filter(row => row["Year"] == year);
            var countyFilter = yearFilter.filter(row => row["County"] == "");
            var filteredData = countyFilter.filter(row => parseInt(row["FIPS"]) / 1000 === FIPS);
            if (filteredData.length > 0) {
                feature.properties["DATA"] = filteredData[0][impact];
                feature.properties["STATENAME"] = filteredData[0]["State"];
            } else {
                feature.properties["DATA"] = "";
                feature.properties["STATENAME"] = feature.properties["NAME"];
            }
        });
        geoJsonStatedata["features"] = geoFeatures;
        geoJsonStateFile = geoJsonStatedata;

        // Create Map
        createJsonMap("State");
    });
    // d3.json(geoCountyJSONFile, function(geoJsondata) {
    d3.json(geoCountyJSONFile).then(geoJsondata => {

        var geoFeatures = geoJsondata.features;

        geoFeatures.forEach(feature => {
            var FIPS = parseInt(feature.properties["STATE"] + feature.properties["COUNTY"]);
            var yearFilter = mongoDBdata.filter(row => row["Year"] == year);
            var filteredData = yearFilter.filter(row => parseInt(row["FIPS"]) === FIPS);
            if (filteredData.length > 0) {
                feature.properties["DATA"] = filteredData[0][impact];
                feature.properties["STATENAME"] = filteredData[0]["State"];
                feature.properties["COUNTYNAME"] = filteredData[0]["County"];
            } else {
                feature.properties["DATA"] = "";
                feature.properties["STATENAME"] = feature.properties["STATE"];
                feature.properties["COUNTYNAME"] = feature.properties["NAME"];
            }
        });
        geoJsondata["features"] = geoFeatures;
        geoJsonCountyFile = geoJsondata;
    });
}

// Creates State Map
function stateMap() {
    var year = $("#year-select").val();
    var impact = $("#impact-select").val()

    // Create a new choropleth layer
    geojson = L.choropleth(geoJsonStateFile, {

        // Define what  property in the features to use
        valueProperty: "DATA",

        // Set color scale
        scale: ["#ffffb2", "#b10026"],
        // scale: ["#081d58", "#ffffd9"],

        // Number of breaks in step range
        steps: 10,

        // q for quartile, e for equidistant, k for k-means
        mode: "q",
        style: {
            // Border color
            color: "#fff",
            weight: 1,
            fillOpacity: 0.8
        },

        // Binding a pop-up to each layer
        onEachFeature: function(feature, layer) {
            layer.myTag = "myGeoJSON";
            layer.bindPopup("<h4>State: " + feature.properties.STATENAME + "<br>Year: " + year + "<br><br></h4><h2>" + impact + ":<br>" + feature.properties.DATA + "</h2>");
        }
    }).addTo(map);

    // Set up the legend
    legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var limits = geojson.options.limits;
        var colors = geojson.options.colors;
        var labels = [];

        // Add min & max
        var legendInfo = "<h1>" + impact + " (" + year + ")</h1>" +
            "<div class=\"labels\">" +
            "<div class=\"min\">" + limits[0] + "</div>" +
            "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
            "</div>";

        div.innerHTML = legendInfo;

        limits.forEach(function(limit, index) {
            labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
        });

        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
    };
    // Adding legend to the map
    legend.addTo(map);
}

// Creates County Map
function countyMap() {
    var year = $("#year-select").val();
    var impact = $("#impact-select").val()

    // Create a new choropleth layer
    geojson = L.choropleth(geoJsonCountyFile, {

        // Define what  property in the features to use
        valueProperty: "DATA",

        // Set color scale
        scale: ["#ffffb2", "#b10026"],
        // scale: ["#081d58", "#ffffd9"],

        // Number of breaks in step range
        steps: 10,

        // q for quartile, e for equidistant, k for k-means
        mode: "q",
        style: {
            // Border color
            color: "#fff",
            weight: 1,
            fillOpacity: 0.8
        },

        // Binding a pop-up to each layer
        onEachFeature: function(feature, layer) {
            layer.myTag = "myGeoJSON";
            layer.bindPopup("<h4>State: " + feature.properties.STATENAME + "<br>County: " + feature.properties.COUNTYNAME + "<br>Year: " + year + "<br><br></h4><h2>" + impact + ":<br>" + feature.properties.DATA + "</h2>");
        }
    }).addTo(map);

    // Set up the legend
    legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var limits = geojson.options.limits;
        var colors = geojson.options.colors;
        var labels = [];

        // Add min & max
        var legendInfo = "<h1>" + impact + " (" + year + ")</h1>" +
            "<div class=\"labels\">" +
            "<div class=\"min\">" + limits[0] + "</div>" +
            "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
            "</div>";

        div.innerHTML = legendInfo;

        limits.forEach(function(limit, index) {
            labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
        });

        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
    };
    // Adding legend to the map
    legend.addTo(map);
}

/***************************************************
ON PAGE LOAD
****************************************************/

// Change page title
d3.select("#page-title").text("Interactive Map");

// Load the year dropdown
loadYear(impact);

// Creating map object
map = L.map("map", {
    center: [39.8283, -98.5795],
    zoom: 4
});

// Adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
}).addTo(map);

// Fetch data from remote DB and create the map
fetchMongoData();

/***************************************************
EVENT HANDLERS
****************************************************/

// Generates map based on user selections
$("#year-select").change(function() {
    // disable fields and display message to user
    disableFields();

    // remove legends
    map.removeControl(legend);

    // Dynamically inject the data for user selection into geoJSON file & create Map
    createGeoJsonFiles();

    // enable the fields and remove the message
    enableFields();
});