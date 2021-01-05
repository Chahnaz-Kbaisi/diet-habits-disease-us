// Leaflet Map Page

// Creat map Object
var myMap = L.map("map", {
    center: [42.1888, -120.345],
    zoom: 8
});

// Adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    maxZoom: 18,
    // id: "mapbox/streets-v11s",
    id: "mapbox/streets-v11",
    accessToken: API_KEY
}).addTo(myMap);