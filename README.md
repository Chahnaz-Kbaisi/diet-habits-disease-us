# Project title: American Lifestyle and Disease Prevalence

#### Do you want to learn about the dietary trends in the United States over the last decade and the impact of what you eat and the social factors of life on the prevalence of obesity and diabetes? The American Dietary Trend and Disease Prevalence 2021 team are excited to share their interactive heroku app which will give you the answer: https://diet-habits-disease-us.herokuapp.com

![app](https://github.com/Chahnaz-Kbaisi/diet-habits-disease-us/blob/main/static/images/Navbar.png)

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
