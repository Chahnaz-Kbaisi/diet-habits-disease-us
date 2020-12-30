/***************************************************
SELECT ALL REQUIRED HTML ELEMENTS
****************************************************/

// select the table body
var tableBody = d3.select("tbody");
var fetching = d3.select("#fetching");

// function to load table data
function loadTableData(dataArray) {
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

/***************************************************
LOAD TABLE DATA - ON PAGE LOAD
****************************************************/
// display a message to the user
fetching.style("text-align", "center").text("Fetching Data - Please wait...");

// fetch data
d3.json('/fetchdata').then(data => {
    console.log(data);

    // load table data
    loadTableData(data);
    fetching.text("");
});