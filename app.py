###############################################
# Import Dependencies
###############################################

from flask import Flask, render_template, jsonify, request
from os import environ
from flask_pymongo import PyMongo
import pandas as pd
import pymongo
import plotly.express as px
import json
from scipy.stats import linregress

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

# route to display the data
@app.route('/data')
def datapage():
    return render_template('data.html')

# Creating routes that will render html templates
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
def predications():
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

@app.route('/analysis')
def analysis():
    return render_template('analysis.html')     

@app.route('/regression')
def regression():
    return render_template('regression.html')

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

###############################################
# Run the Flask Application
###############################################

# Spin-up the Flask Application
if __name__ == "__main__":
    app.run(debug=True)