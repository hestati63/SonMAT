from flask import Flask, Blueprint, render_template, send_from_directory, redirect, url_for

app = Flask(__name__)
frontend = Blueprint('frontend', __name__)

@frontend.route('/', methods=['GET'], defaults={'s':''})
@frontend.route('/<string:s>', methods=['GET'])
def main(s):
    return render_template("main.html")

@frontend.route('/formula/<path:path>', methods=['GET'])
def send_file(path):
    return redirect(url_for('static', filename='formula/' + path))

