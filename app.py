# Import in Dependencies
from flask import Flask, render_template, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from os import environ
from flask_pymongo import PyMongo


# Setting up Flask
app = Flask(__name__)

app.config['MONGO_URI'] = environ.get(
    'MONGODB_URI', 'mongodb://localhost:27017/notepad')

mongo = PyMongo(app)

app.config['SQLALCHEMY_DATABASE_URI'] = environ.get(
    'DATABASE_URL') or "sqlite:///notepad.sqlite"

# To create a db using flask sqlalchemy integration
db = SQLAlchemy(app)


# Creating route that will render html templates
@app.route('/')
def index():
    return render_template('index.html')

    # Spin-up the Flask Application
if __name__ == "__main__":
    app.run(debug=True)