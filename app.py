# Import in Dependencies
from flask import Flask, render_template, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from os import environ
from flask_pymongo import PyMongo


app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = environ.get(
    'DATABASE_URL') or "sqlite:///notepad.sqlite"

# To create a db using flask sqlalchemy integration
db = SQLAlchemy(app)

# create a class that's going to hold our data

@app.route('/')
def index():
    return render_template('index.html')

# Creating endpoint to fetch tasks to the users


    # Spin-up the Flask Application
if __name__ == "__main__":
    app.run(debug=True)
