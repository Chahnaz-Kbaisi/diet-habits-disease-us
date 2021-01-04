###############################################
# Import Dependencies
###############################################

from flask import Flask, render_template, jsonify, request
from os import environ
from flask_pymongo import PyMongo
import pandas as pd
import pymongo
import plotly.express as px

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

@app.route('/map')
def bubbleplot():
    return render_template('map.html') 

@app.route('/analysis')
def bubbleplot():
    return render_template('analysis.html')     

@app.route('/regression')
def regression():
    return render_template('regression.html')

@app.route('/embedRegression/<year>/<impact>/<disease>')
def embedRegression(year, impact, disease):
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

    impact = impact.replace(u'\xa0', u' ')
    impacts = ['Expenditures per capita, fast food',
               'Expenditures per capita, restaurants',
               'Direct farm sales per capita']
    income_impacts = ['Household Income (Asian)',
                      'Household Income (Black)', 
                      'Household Income (Hispanic)',
                      'Household Income (White)']

    # Create dataframe from the data
    df =  pd.DataFrame(data)
    impact = impact.replace(u'\xa0', u' ')

    # Filter the data based on the user selected impact
    if impact in impacts:
        impact = impact.replace(u'\xa0', u' ')
        df_2012 = df.loc[(df[impact].isnull() == False) &
                         (df["Year"] == int(year))]
        df_2012 = df.loc[(df[impact] != "")]
        df_2012[impact] = df_2012[impact].astype(float)
        df_2012_grouped = df_2012.groupby("State")[impact].first()
        df_2012_grouped.reset_index()
        df_2012_disease = df.loc[(df['County'] == "") & (df["Year"] == int(year))]
        df_2012_disease = df_2012_disease[['State','Year',disease]]
        df_year = df_2012_disease.merge(df_2012_grouped, on="State")
    elif impact in income_impacts:
        df_year = df.loc[(df["Year"] == int(year)) & (df[impact] != "")]
    else:
        df_year = df.loc[(df["County"] == "") & (df["Year"] == int(year))]

    # Generate plot based on user selections
    if impact in income_impacts:
        fig = px.scatter(df_year, x=impact, y=disease, hover_data=["State","County"], trendline="ols")
    else:
        fig = px.scatter(df_year, x=impact, y=disease, hover_data=["State"], trendline="ols")
    fig.update_layout(
        title=impact + " vs " + disease + " (" + year + ")",
        xaxis_title=impact,
        yaxis_title=disease,
    )

    # Write the plot into a html file
    fig.write_html("templates/regressionplot.html")

    # Return the generated html file with plot
    return render_template('regressionplot.html')

###############################################
# Run the Flask Application
###############################################

# Spin-up the Flask Application
if __name__ == "__main__":
    app.run(debug=True)