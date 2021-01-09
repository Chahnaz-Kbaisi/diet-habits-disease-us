/***************************************************
SELECT ALL REQUIRED HTML ELEMENTS
****************************************************/

// select the table body
var tableBody = d3.select("tbody");
var fetching = d3.select("#fetching");

/***************************************************
USER DEFINED FUNCTIONS
****************************************************/

// function to load table data
function loadTableData(dataArray) {
    // clear table content before loading
    tableBody.html("");

    // load data into table
    dataArray.forEach((data) => {
        var row = tableBody.append("tr");
        row.append("td").text(data["Year"]);
        row.append("td").text(data["State"]);
        row.append("td").text(data["County"]);
        row.append("td").text(data["% Adults with Obesity"]);
        row.append("td").text(data["% Adults with Diabetes"]);
        row.append("td").text(data["% Limited Access to Healthy Foods"]);
        row.append("td").text(data["Food Environment Index"]);
        row.append("td").text(data["% Physically Inactive"]);
        row.append("td").text(data["% With Access to Exercise Opportunities"]);
        row.append("td").text(data["# Primary Care Physicians"]);
        row.append("td").text(data["Primary Care Physicians Rate"]);
        row.append("td").text(data["# Mental Health Providers"]);
        row.append("td").text(data["Mental Health Provider Rate"]);
        row.append("td").text(data["High School Graduation Rate"]);
        row.append("td").text(data["% Some College"]);
        row.append("td").text(data["% Unemployed"]);
        row.append("td").text(data["Income Ratio"]);
        row.append("td").text(data["Median Household Income"]);
        row.append("td").text(data["Household Income (Asian)"]);
        row.append("td").text(data["Household Income (Black)"]);
        row.append("td").text(data["Household Income (Hispanic)"]);
        row.append("td").text(data["Household Income (White)"]);
        row.append("td").text(data["Expenditures per capita, fast food"]);
        row.append("td").text(data["Expenditures per capita, restaurants"]);
        row.append("td").text(data["Direct farm sales per capita"]);
        row.append("td").text(data["Direct farm sales per capita (% change), 2007 - 12"]);

    });
};

// fetch page data
function fetchPageData(pageNum) {
    d3.json(`/fetchpagedata/${pageNum}`).then(data => {
        // load table data
        loadTableData(data);
        fetching.text("");
    });
}

// fetch prev page data
function onPrevClicked() {
    d3.event.preventDefault();

    var currPageNum = parseInt(d3.select("#currPageNum").text());
    var prevPageNum = currPageNum - 1;
    if (currPageNum > 1) {
        // fetch and display previous page contents
        fetchPageData(prevPageNum);

        // set currPageNumber
        d3.select("#currPageNum").text(prevPageNum);

        // disable/enable buttons based on page nos
        if (prevPageNum == 1) {
            d3.select("#prevButton").classed('disabled', true);
        } else if (prevPageNum == 41) {
            d3.select("#nextButton").classed('disabled', false);
        }
    }
}

// fetch next page data
function onNextClicked() {
    d3.event.preventDefault();
    var currPageNum = parseInt(d3.select("#currPageNum").text());
    var nextPageNum = currPageNum + 1;
    if (currPageNum < 42) {
        // fetch and display previous page contents
        fetchPageData(nextPageNum);

        // set currPageNumber
        d3.select("#currPageNum").text(nextPageNum);

        console.log(nextPageNum);
        // disable/enable buttons based on page nos
        if (nextPageNum == 42) {
            d3.select("#nextButton").classed('disabled', true);
        } else if (nextPageNum == 2) {
            d3.select("#prevButton").classed('disabled', false);
        }
    }
}

/***************************************************
EVENT HANDLERS
****************************************************/
d3.select("#prevButton").on("click", onPrevClicked);
d3.select("#nextButton").on("click", onNextClicked);

/***************************************************
LOAD TABLE DATA - ON PAGE LOAD
****************************************************/
// display a message to the user
fetching.style("text-align", "center").text("Fetching Data - Please wait...");

// fetch page 1 data
fetchPageData(parseInt(d3.select("#currPageNum").text()));