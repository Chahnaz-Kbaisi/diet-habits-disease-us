// Embed navbar.html in place of nav-placeholder
$.get("/navbar", function(data) {
    $("#nav-placeholder").replaceWith(data);
});

// Adjust position of title box based on whether navbar is collapsed or not
function toggleButton() {
    var navbar_class = d3.select(".navbar-collapse").attr("class");
    if (navbar_class.indexOf("show") < 0) {
        d3.select(".bg-text").style("top", "33%");
    } else {
        d3.select(".bg-text").style("top", "13%");
    }
};