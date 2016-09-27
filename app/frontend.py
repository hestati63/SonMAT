from flask import Flask, Blueprint, render_template

app = Flask(__name__)
frontend = Blueprint('frontend', __name__)



@frontend.route('/', methods=['GET'], defaults={'s':''})
@frontend.route('/<string:s>', methods=['GET'])
def main(s):
    return render_template("main.html")

