# Import in Dependencies
from flask import Flask, render_template, jsonify
from flask_sqlalchemy import SQLAlchemy
from os import environ

# Creating new application of the flask module
app = Flask(__name__)
# sqlalchemy connection using flask app config
app.config['SQLALCHEMY_DATABASE_URI'] = environ.get(
    'DATABASE_URL') or "sqlite:///notepad.sqlite"

# To create a db using flask sqlalchemy integration
db = SQLAlchemy(app)

# create a class that's going to hold our data


class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String)

# Creating the test route


@app.route('/')
def index():
    return render_template('index.html', name="Group 1")

# Creating endpoint to fetch tasks to the users


@app.route('/tasks')
def tasks():
    tasks = db.session.query(Task)

    # variable called data to return an object
    data = []

    # Create a simple dictionary and append to list
    for task in tasks:
        item = {
            "id": task.id,
            "description": task.description
        }
        data.append(item)

    return jsonify(data)


# Spin-up the Flask Application
if __name__ == "__main__":
    app.run(debug=True)
