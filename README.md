# Project title: American Lifestyle and Disease Prevalence

#### Do you want to learn about the dietary trends in the United States over the last decade and the impact of what you eat and the social factors of life on the prevalence of obesity and diabetes? The American Lifestyle and Disease Prevalence 2021 team are excited to share their interactive heroku app which will give you the answer: https://diet-habits-disease-us.herokuapp.com

![app](https://github.com/Chahnaz-Kbaisi/diet-habits-disease-us/blob/chahnaz/static/images/Navbar.png)

# Table of Contents

* [Project Description](#project-description)
* [Approach](#approach)
  * [Data Sets](#data-sets) 
  * [ETL](#ETL)
* [Requirements](#requirements)  
  * [Languages And Libraries](#languages-and-libraries)
* [Dashboard](#dashboard)
  * [Plots](#plots)
* [Leaflet Map](#leaflet-map)  
* [Data Analysis](#data-analysis)
  * [Linear Regression](#linear-regression)
* [Limitations](#limitations) 
* [Collaborators](#collaborators)
* [Conclusion](#conclusion)
  * [Take away and future direction](#Take-away-and-future-direction)
***

# Project Description

## Overview

The United States has a diverse population in terms of demographics, socioeconomic status (SES), lifestyle, and living conditions. These factors play a role in the general health of each person and potentially contribute to subsequent risk of disease. In particular, diabetes and obesity cause a significant social and economic burden on the United States; however, the role of certain modifying factors in their prevalence remains unclear. 

The Centers for Disease Control and Prevention (CDC) have indicated that diabetes increased from 9.5% during 1999 to 2002 to 12% during 2013 to [2016](https://www.cdc.gov/diabetes/pdfs/data/statistics/national-diabetes-statistics-report.pdf).  Moreover, epidemiological data suggests its prevalence varied based on race, SES and other factors. On the other hand, the rate of obesity increased from 30.5% to 42.4% during the same periods and also showed variability based on several [factors](https://www.cdc.gov/obesity/data/adult.html).  

Diet is one of the most important determinants of health, which is impacted by numerous factors: 
  * Availability of healthy foods
  * Access to healthy foods or the resources to consume a regular healthy diet vary greatly across the United States. 
  * Disparate social factors, like household income, may play a crucial role. 
  * Education level and employment play an important part in dietary choices 
  * Comprehensive analysis of current data on diet, demographics and lifestyle in the United States is lacking, especially a close examination of specific factors that shed light on why certain Americans are predisposed to developing diabetes and/or obesity.  

  ## Objectives
The goal of this project was to examine the dietary habits of Americans, and assess whether access to food, choice of diet, socioeconomic status, and other factors contribute to the development of diabetes and obesity. Presented here is a state-by-state analysis of dietary trends using the food-environment index, access to healthy food, household income by race, education level, and exercise habits. Furthermore, the relationship between these factors and the prevalence of diabetes and obesity are depicted across the country and clearly show specific positive associations that are indicative of causality. Map-based data visualization is provided for more focused insight and can be used for subsequent analyses. 
****   

# Approach 
For this project, we used data from the datasets below, and performed an ETL pipeline using the languages listed.

## Data Sets: 
* [Food Environment Atlas](https://www.ers.usda.gov/data-products/food-environment-atlas/data-access-and-documentation-downloads/)
* [County Health Rankings & Roadmaps](https://www.countyhealthrankings.org/app/alabama/2019/downloads)

## ETL: 
### Extract, Transform, Load

#### Data Investigation

Investigated the datasets and realized that data had to be scraped from 560 different excel workbooks, which would be too cumbersome to download manually. So we decided to write a script to scrape the data from the webpages.

#### Extract
  * Developed a [script](https://github.com/Chahnaz-Kbaisi/diet-habits-disease-us/blob/main/ETL/Web_Scrape_ETL.ipynb) to web scrape only the relevant data and categories in 559 Excel workbooks from the County Health Rankings and Roadmaps website
  * Script also extracted relevant data from two worksheets,' Restaurants' and 'Local' in Food Environment Atlas [Workbook](https://github.com/Chahnaz-Kbaisi/diet-habits-disease-us/blob/main/static/data/FoodEnvironmentAtlas.xls).
  * Data for each factor was not available for all years, and there were differences in column names for these factors in different excel sheets. Excel sheets for Alaska and Lousiana for the year 2020 alone had County column titled as Borough and Parish resp., So, the extraction script had to handle these inconsistencies appropriately to fetch all data.

#### Transform
  * Consolidated the data collected from both the data sources into one data frame.
  * Cleaned the data and renamed the columns

#### Load
* Loaded the web scraped data into an Excel [file](https://github.com/Chahnaz-Kbaisi/diet-habits-disease-us/blob/main/static/data/Web_Scraped_Data.xls) and remote MongoDB for further analysis.


***
# Requirements
## Languages And Libraries
The following is a list of the required languages, modules and libraries that we used. For a more detailed list of all modules and libraries that we installed in our project environment please see the project [requirements file](https://github.com/Chahnaz-Kbaisi/diet-habits-disease-us/blob/main/requirements.txt)

* Jupyter Notebook
* Python
  * Pandas
  * Matplotlib Library
  * Flask API
* HTML
* MongoDB 
* Javascript
  * D3.js
  * DOM Manipulation
  * Plotly.JS
  * Leaflet.js
    * Choropleth
  * JQuery 
* CSS
  * Bootstrap 
* JSON
***

# Dashboard
To present our data we created an interactive dashboard that included various plots that are user-friendly and interactive for optimum visualization of the data.

##### The plots below show the trends for the prevelance of obesity and diabetes and the following factors:
    1. Percent Limited Access to Healthy Foods
    2. Food Environment Index (FEI)
    3. Percent Physically Inactive
    4. Percent with access to exercise opportunities
    5. High School graduation rate
    6. Percent College education
    7. Expenditure per capita by Fast-food Restaurants
    8. Expenditure per capita by Restaurants
    9. Direct farm sales
    10. Percent unemployed
    11. Income ratio
    12. Median Household Income
    13. Median Household Income (for Asian, Hispanic, black, white)

Plot templates from [Plotly.js documentation](https://plotly.com/javascript/) were used to generate the figures. The javascript files used to construct each of the plots are available below:
### Plots 
   Ploty Plots  |
   ----------------- | 
   [Line Plot](https://github.com/Chahnaz-Kbaisi/diet-habits-disease-us/blob/main/static/js/lineplot.js) |
   [Bubble Plot](https://github.com/Chahnaz-Kbaisi/diet-habits-disease-us/blob/main/static/js/bubbleplot.js) |
   [Box Plot](https://github.com/Chahnaz-Kbaisi/diet-habits-disease-us/blob/main/static/js/boxplot.js) |   
   [Bar Plot](https://github.com/Chahnaz-Kbaisi/diet-habits-disease-us/blob/main/static/js/barplot.js) | 
   [Stacked Bar Plot](https://github.com/Chahnaz-Kbaisi/diet-habits-disease-us/blob/main/static/js/foodexp.js) | 
   [Waterfall Plot](https://github.com/Chahnaz-Kbaisi/diet-habits-disease-us/blob/main/static/js/waterfall.js) | 

***
# Leaflet Map
A [leaflet map](https://github.com/Chahnaz-Kbaisi/diet-habits-disease-us/blob/main/static/js/leafletmap.js) was developed to show the distribution and occurrence rates of the factors being examined state by state across the country. 
***

# Data Analysis

##### Linear regression analysis was performed to determine if there was an association between obesity and diabetes and the factors listed above.
   

## Linear Regression 
[Linear regression](https://github.com/Chahnaz-Kbaisi/diet-habits-disease-us/blob/main/static/js/regression.js) analyses were performed to determine if there was an association between several factors and the prevalence of obesity and diabetes.This analysis was performed to determine the relationship between several independent variables like access to healthy foods and the dependent variables obesity and diabetes.

***
# Limitations
 * Data was not available for all years for all of the factors analyzed.
 * The Food Environment Atlas only had data for 2007 and 2012, and nothing more current than that.
 * Not all of the years could be included in the datasets because the columns were not consistently constructed from year to year and in some cases, data was inconsistent. 
 * "Direct farm sales per capita (% change), 2007 - 12" could not be used for analysis due to lack of obesity/diabetes rate data for years 2007 through 2009.
 *  The following columns were not used for analysis due to the inaccuracy of data readings in the [County Health Rankings & Roadmaps](http://www.countyhealthrankings.org/content/data-changes):
    * Primary Care Physicians Rate
    * Primary Care Physicians
    * Mental Health Providers
    * Mental Health Provider Rate

***
# Collaborators 
<a href="https://github.com/Prarthna-design">
  <img src="https://github.com/Chahnaz-Kbaisi/diet-habits-disease-us/blob/main/static/images/Prarthna.png?size=50">
</a>


<a href="https://github.com/cdalsania">
  <img src="https://github.com/Chahnaz-Kbaisi/diet-habits-disease-us/blob/main/static/images/Crystal.png?size=50">
</a>

<a href="https://github.com/JayyMaurice2020">
  <img src="https://github.com/Chahnaz-Kbaisi/diet-habits-disease-us/blob/main/static/images/Jamel.png?size=50">
</a>


   <a href="https://github.com/Chahnaz-Kbaisi">
  <img src="https://github.com/Chahnaz-Kbaisi/diet-habits-disease-us/blob/main/static/images/Chahnaz.png?size=50">
</a>


<a href="https://github.com/ushaakumaar">
  <img src="https://github.com/Chahnaz-Kbaisi/diet-habits-disease-us/blob/main/static/images/Usha.png?size=50">
</a>


<a href="https://github.com/SusanCThomas">
  <img src="https://github.com/Chahnaz-Kbaisi/diet-habits-disease-us/blob/main/static/images/Susan.png?size=50">
</a>

***
# Conclusion
Dietary trends in the United States over the last decade provide insight into the general health and well-being of Americans. In addition, the foods Americans eat and their lifestyle choices determine the prevalence of certain chronic diseases like obesity and type 2 diabetes. Unfortunately, some lifestyle choices are determined by socioeconomic status and availability of resources, which are disparate and uneven throughout the country. Although there is plenty of data on the effects of diet on the incidence of obesity and diabetes, far less is known about the impacts of other modifying factors like education or income. 

#### Factors that are associated with disease prevalence:
   * Limited access to healthy foods varied from state to state and even within a state, and it appears that less access to healthy foods might contribute to obesity rates but not diabetes across the country. 
   * The food environmental index, which indicates the quality of food in a given place, was weakly associated with the degree of disease. 
   * The percentage of physical inactivity, or the number of Americans who do not engage in leisure-time exercise, directly contributed to both obesity and diabetes over the last ten years, especially the latter with which there is a strong positive association. 
   * Median family income, which varied starkly across the United States, had a moderate negative association with both obesity and diabetes suggesting household earning might determine other health-related factors like what foods are eaten and other lifestyle choices.

#### Factors that are not associated with disease prevalence:
   * There was no link for disease prevalence with education level, nor with income ratio (i.e., the separation between high and low income) or unemployment rates. 
   * There were no income-related effects based on race. 
   
#### Take away and future direction   

The research presented here shows that certain factors (i.e., lifestyle, demographic, socioeconomic) play a major role in the prevalence of obesity and diabetes, both in terms of the choices Americans make in their personal lives and the social conditions of where they live. Among the lifestyle choices examined, lack of exercise had the strongest consistent association with disease rates over ten years, this may have been due to reduced availability of physical activity facilities. On the other hand, decreased local access to healthy food and household income were the most important contributors to disease prevalence in terms of demographic and socioeconomic factors, respectively. Thus, a combination of personal and social factors likely contribute to the number of people who develop these chronic conditions. These associations should be considered over several years and carefully weighed for significance given the cause of chronic conditions like obesity and diabetes is multifactorial. Future work should examine the role of specific nutrition choices (e.g., what Americans buy at grocery stores), heredity of disease (i.e., does someone in the family already have it), and availability of local nutrition education programs on disease rates.    



- - -
### Copyright

American Lifestyle and Disease Prevalence © 2021. All Rights Reserved.
