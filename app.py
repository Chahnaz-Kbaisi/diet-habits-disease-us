###############################################
# Import Dependencies
###############################################

from flask import Flask, render_template, jsonify, request
from os import environ
from flask_pymongo import PyMongo

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
def data():
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

###############################################
# Run the Flask Application
###############################################

# Spin-up the Flask Application
if __name__ == "__main__":
    app.run(debug=True)