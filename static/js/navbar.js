// Embed navbar.html in place of nav-placeholder
$.get("/navbar", function(data) {
    $("#nav-placeholder").replaceWith(data);
});