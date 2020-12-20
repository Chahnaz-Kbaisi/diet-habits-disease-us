# Import in Dependencies
from flask import Flask, render_template

# Creating new application of the flask module
app = Flask(__name__)

# Creating the test route


@app.route('/')
def index():
    return render_template('index.html', name="Group 1")


# Spin-up the Flask Application
if __name__ == "__main__":
    app.run(debug=True)
