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

# Creating route that will render html templates
@app.route('/')
def index():
    return render_template('index.html')

    # Spin-up the Flask Application
if __name__ == "__main__":
    app.run(debug=True)