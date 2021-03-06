###############################################
# Import Dependencies
###############################################

from flask import Flask, render_template, jsonify, request
from os import environ
from flask_pymongo import PyMongo
import pandas as pd
import pymongo
import json
from scipy.stats import linregress
import os

###############################################
# Database & Flask Setup
###############################################

# Creating new application of the flask module
app = Flask(__name__)

# config app with mongodb
app.config['MONGO_URI'] = environ.get('MONGODB_URL') or 'mongodb://localhost:27017/diethabitsDB'

# Initializing mongo applicaiton
mongo = PyMongo(app)

###############################################
# Flask Routes
###############################################

# route to fetch the data
@app.route('/fetchdata')
def fetch_data():
    # Fetch data from database
    rows = mongo.db.countyleveldiethabits.find({})

    # Variable to hold array of dictionaries
    data = []

    # Create a simple dictionary and append to list
    for row in rows:
        item = row
        for key, value in item.items():
            value = str(value) + ''
            if value == 'nan':
                item[key] = ""
        item['_id'] = str(item['_id'])
        data.append(item)

    return jsonify(data)

# route to calculate regression values
@app.route('/fetchRegressionLine', methods=['POST'])
def fetchRegressionLine():
    
    # Fetch x and y axis values passed from Client
    impactArray = json.loads(request.form["impactArray"])
    diseaseArray = json.loads(request.form["diseaseArray"])

    # Replacing null values with 0
    impactArray = [0 if value is None else value for value in impactArray]
    diseaseArray = [0 if value is None else value for value in diseaseArray]

    # Determine the regression values
    (slope, intercept, rvalue, pvalue, stderr) = linregress(impactArray, diseaseArray)
    sortedImpactArray = impactArray
    sortedImpactArray.sort()
    regressValues = []
    for impact in sortedImpactArray:
        regressValue = impact * slope + intercept
        regressValues.append(regressValue)

    # Determine the line equation and r squared value
    lineEq = "y = " + str(round(slope,2)) + "x + " + str(round(intercept,2))
    rSquared = f"{round(rvalue ** 2,2)}"

    # Return X axis values, Regression values, R^2 and Line equation
    regressionData = [{
        "X":sortedImpactArray,
        "Y":regressValues,
        "R": rSquared,
        "EQUATION": lineEq
    }]

    return jsonify(regressionData)

# route to get write up
@app.route('/getwriteup')
def getwriteup():

    # Set the xls file path
    input_file_path = os.path.join("static","data","Analysis_Writeups.xls")

    # Read excel into dataframe
    writeup_df = pd.read_excel(input_file_path)

    # Convert null to empty string
    writeup_df['Writeup'] = writeup_df.Writeup.fillna(" ")

    # Convert dataframe to array of dictionary
    writeup = writeup_df.to_dict('records')

    return jsonify(writeup)

# route to fetch page data
@app.route('/fetchpagedata/<pageNumber>')
def fetchpagedata(pageNumber):

    nPerPage = 1000

    skipCount = ( ( int(pageNumber) - 1 ) * nPerPage ) if (int(pageNumber) > 0) else 0 

    print("skipCount", skipCount)

    # Fetch data from database
    rows = mongo.db.countyleveldiethabits.find().sort([('_id', 1)]).skip(skipCount).limit( nPerPage )

    # Variable to hold array of dictionaries
    data = []

    # Create a simple dictionary and append to list
    rowCount = 0
    for row in rows:
        item = row
        for key, value in item.items():
            value = str(value) + ''
            if value == 'nan':
                item[key] = ""
        item['_id'] = str(item['_id'])
        data.append(item)
        rowCount += 1
    
    return jsonify(data)

# Route that fetches and returns all counties in a state
@app.route("/fetchUniqueCounties/<state>")
def fetchUniqueCounties(state):

    # Fetch data from database
    rows = mongo.db.countyleveldiethabits.find({'State':state})

    # Variable to hold array of dictionaries
    counties = []
    # Create a simple dictionary and append to list
    for row in rows:
        for key, value in row.items():
            if key == 'County':
                value = str(value) + ''
                if value != 'nan':
                    counties.append(value)
    counties = list(set(counties))
    counties.sort()

    return jsonify(counties)

# Route that fetches and returns State and County level data required for creating lineplot  
@app.route("/fetchPlotStateCountyData/<state>/<county>/<impact>")
def fetchPlotStateCountyData(state, county, impact):

    # Fetch data from database
    rows = mongo.db.countyleveldiethabits.find({})

    # Variable to hold array of dictionaries
    data = []

    # Create a simple dictionary and append to list
    for row in rows:
        item = row
        for key, value in item.items():
            value = str(value) + ''
            if value == 'nan':
                item[key] = ""
        item['_id'] = str(item['_id'])
        data.append(item)
    rows = ""

    # Create dataframe from the data	
    df =  pd.DataFrame(data)
    data = ""
    impact = impact.replace(u'\xa0', u' ')
    df = df.loc[df['Year'] != ""]
    df['Year'] = df['Year'].astype(float).astype(int)

    if impact in ["% Limited Access to Healthy Foods", "High School Graduation Rate"]:
        state_df = df.loc[(df["Year"] >= 2013) & (df["State"] == state) & (df["County"] == "")]
        county_df = df.loc[(df["Year"] >= 2013) & (df["State"] == state) & (df["County"] == county)]
    elif impact in ["Food Environment Index", "% With Access to Exercise Opportunities"]:
        state_df = df.loc[(df["Year"] >= 2014) & (df["State"] == state) & (df["County"] == "")]
        county_df = df.loc[(df["Year"] >= 2014) & (df["State"] == state) & (df["County"] == county)]
    elif impact == "Income Ratio":
        state_df = df.loc[(df["Year"] >= 2015) & (df["State"] == state) & (df["County"] == "")]
        county_df = df.loc[(df["Year"] >= 2015) & (df["State"] == state) & (df["County"] == county)]
    else:
        state_df = df.loc[(df["Year"] != 2010) & (df["State"] == state) & (df["County"] == "")]
        county_df = df.loc[(df["Year"] != 2010) & (df["State"] == state) & (df["County"] == county)]

    df = ""

    final_state_dict = state_df.to_dict(orient='records')
    final_county_dict = county_df.to_dict(orient='records')

    final_dict = [{
        "StatePlotData" : final_state_dict,
        "CountyPlotData" : final_county_dict
    }]
    
    return jsonify(final_dict)

# Route that fetches and returns the data for Stacked Bar Plot
@app.route('/fetchStackedBarPlotData/<impact>')
def fetchStackedBarPlotData(impact):
    # Fetch data from database
    rows = mongo.db.countyleveldiethabits.find({})

    # Variable to hold array of dictionaries
    data = []

    # Create a simple dictionary and append to list
    for row in rows:
        item = row
        for key, value in item.items():
            value = str(value) + ''
            if value == 'nan':
                item[key] = ""
        item['_id'] = str(item['_id'])
        data.append(item)
    rows = ""

    # Create dataframe from the data	
    df =  pd.DataFrame(data)
    data = ""

    df = df.loc[df['Year'] != ""]
    df['Year'] = df['Year'].astype(float).astype(int)

    impact = impact.replace(u'\xa0', u' ')
    county_df = df.loc[(df['Year'] == 2012) & (df['County'] == "")]
    df_2012_disease = county_df[['State','Year','% Adults with Obesity','% Adults with Diabetes']]	

    impact_df = df.loc[(df[impact]!= "") & (df['Year'] == 2012)]
    print(impact_df)
    df_2012_grouped = impact_df.groupby("State")[impact].first()
    df = ""
    df_2012_grouped.reset_index()
    df_year = df_2012_disease.merge(df_2012_grouped, on="State")
    final_dict = df_year.to_dict(orient='records')
    
    return jsonify(final_dict)

# Route that fetches and returns the data for Waterfall Plot
@app.route('/fetchWaterfallPlotData/<state>/<county>/<impact>')
def fetchWaterfallPlotData(state, county, impact):
    # Fetch data from database
    rows = mongo.db.countyleveldiethabits.find({})

    # Variable to hold array of dictionaries
    data = []

    # Create a simple dictionary and append to list
    for row in rows:
        item = row
        for key, value in item.items():
            value = str(value) + ''
            if value == 'nan':
                item[key] = ""
        item['_id'] = str(item['_id'])
        data.append(item)
    rows = ""

    # Create dataframe from the data	
    df =  pd.DataFrame(data)
    data = ""
    impact = impact.replace(u'\xa0', u' ')
    df = df.loc[df['Year'] != ""]
    df['Year'] = df['Year'].astype(float).astype(int)

    waterfall_df = df.loc[(df[impact] != "") & (df["State"] == state) & (df["County"] == county)]
    waterfall_df = waterfall_df.sort_values(['Year'])
    df = ""
    
    print(waterfall_df)

    final_dict = waterfall_df.to_dict(orient='records')
    
    return jsonify(final_dict)

# Route that fetches and returns the data for Linear Regression Plot
@app.route("/fetchregressiondata/<disease>/<impact>/<year>")
def fetchregressiondata(disease, impact, year):

    # Fetch data from database
    rows = mongo.db.countyleveldiethabits.find({})

    # Variable to hold array of dictionaries
    data = []

    # Create a simple dictionary and append to list
    for row in rows:
        item = row
        for key, value in item.items():
            value = str(value) + ''
            if value == 'nan':
                item[key] = ""
        item['_id'] = str(item['_id'])
        data.append(item)
    rows = ""
    
    impact = impact.replace(u'\xa0', u' ')
    expenditureImpacts = ['Expenditures per capita, fast food',
        'Expenditures per capita, restaurants'
    ]
    incomeImpacts = ['Household Income (Asian)',
        'Household Income (Black)',
        'Household Income (Hispanic)',
        'Household Income (White)'
    ]

    # Create dataframe from the data	
    df =  pd.DataFrame(data)
    data = ""
    impact = impact.replace(u'\xa0', u' ')

    # Filter the data based on the user selected impact	
    if impact in expenditureImpacts:	
        impact = impact.replace(u'\xa0', u' ')	
        df_2012 = df.loc[(df[impact].isnull() == False) &	
                         (df["Year"] == int(year))]	
        df_2012 = df.loc[(df[impact] != "")]
        df_2012[impact] = df_2012[impact].astype(float)	
        df_2012_grouped = df_2012.groupby("State")[impact].first()	
        df_2012_grouped.reset_index()	
        df_2012_disease = df.loc[(df['County'] == "") & (df["Year"] == int(year))]
        df = ""
        df_2012_disease = df_2012_disease[['State','Year',disease]]	
        df_year = df_2012_disease.merge(df_2012_grouped, on="State")
        final_dict = df_year.to_dict(orient='records')	
    elif impact in incomeImpacts:
        df_year = df.loc[(df["Year"] == int(year)) & (df[impact] != "")]
        final_dict = df_year.to_dict(orient='records')
    elif impact == "Direct farm sales per capita":
        df_year = df.loc[(df["Year"] == int(year)) & (df[impact] != "") & (df["County"] != "")]
        final_dict = df_year.to_dict(orient='records')
    else:
        df_year = df.loc[(df["County"] == "") & (df["Year"] == int(year))]
        final_dict = df_year.to_dict(orient='records')
    
    impactArray = df_year[impact].tolist()
    diseaseArray = df_year[disease].tolist()

    # Determine the regression values
    (slope, intercept, rvalue, pvalue, stderr) = linregress(impactArray, diseaseArray)
    sortedImpactArray = impactArray
    sortedImpactArray.sort()
    regressValues = []
    for impact in sortedImpactArray:
        regressValue = impact * slope + intercept
        regressValues.append(regressValue)

    # Determine the line equation and r squared value
    lineEq = "y = " + str(round(slope,2)) + "x + " + str(round(intercept,2))
    rSquared = f"{round(rvalue ** 2,2)}"

    # Return X axis values, Regression values, R^2 and Line equation
    regressionData = {
        "X":sortedImpactArray,
        "Y":regressValues,
        "R": rSquared,
        "EQUATION": lineEq
    }
    final_dict.append(regressionData)
    return jsonify(final_dict)

# Route that fetches and returns the data for Box Plot
@app.route("/fetchBoxPlotData")
def fetchBoxPlotData():

    # Fetch data from database
    rows = mongo.db.countyleveldiethabits.find({})

    # Variable to hold array of dictionaries
    data = []

    # Create a simple dictionary and append to list
    for row in rows:
        item = row
        for key, value in item.items():
            value = str(value) + ''
            if value == 'nan':
                item[key] = ""
        item['_id'] = str(item['_id'])
        data.append(item)
    rows = ""

    # Create dataframe from the data	
    df =  pd.DataFrame(data)
    data = ""
    df = df.loc[df['Year'] != ""]
    df['Year'] = df['Year'].astype(float).astype(int)
    state_level_df = df.loc[(df["County"] == "") & (df['Year'] != 2010)]
    df = ""

    final_state_dict = state_level_df.to_dict(orient='records')

    return jsonify(final_state_dict)

# Creating routes that will render html templates
@app.route('/data')
def datapage():
    return render_template('data.html')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/navbar')
def navbar():
    return render_template('navbar.html')

@app.route('/footer')
def footer():
    return render_template('footer.html')

@app.route('/collaborators')
def collaborators():
    return render_template('collaborators.html')

@app.route('/conclusion')
def conclusion():
    return render_template('conclusion.html')  

@app.route('/predictions')   
def predictions():
    return render_template('predictions.html')

@app.route('/approach')   
def approach():
    return render_template('approach.html')

@app.route('/lineplot')   
def lineplot():
    return render_template('lineplot.html')

@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')

@app.route('/bubbleplot')
def bubbleplot():
    return render_template('bubbleplot.html')

@app.route('/boxplot')
def boxplot():
    return render_template('boxplot.html')  

@app.route('/barplot')
def barplot():
    return render_template('barplot.html')
    
@app.route('/analysis')
def analysis():
    return render_template('analysis.html')     

@app.route('/regression')
def regression():
    return render_template('regression.html')

@app.route('/foodexp')
def foodexp():
    return render_template('foodexp.html')

@app.route('/getapikey')
def getapikey():
    key = [{"API_KEY": environ.get('API_KEY') }]
    return jsonify(key)

@app.route('/leafletmap')
def leafletmap():
    return render_template('leafletmap.html')

@app.route('/waterfall')
def waterfall():
    return render_template('waterfall.html')						
###############################################
# Run the Flask Application
###############################################

# Spin-up the Flask Application
if __name__ == "__main__":
    app.run(debug=True)