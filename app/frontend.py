import json
import tempfile
import subprocess
from flask import Flask, Blueprint, render_template, request, send_from_directory, redirect, url_for
from .model import MathExp, User
app = Flask(__name__)
frontend = Blueprint('frontend', __name__)

@frontend.route('/', methods=['GET'], defaults={'s':''})
@frontend.route('/<string:s>', methods=['GET'])
def main(s):
    return render_template("main.html")

@frontend.route('/formula/<path:path>', methods=['GET'])
def send_file(path):
    return redirect(url_for('static', filename='formula/' + path))

@frontend.route('/images/<path:path>', methods=['GET'])
def send_img(path):
    return redirect(url_for('static', filename='images/' + path))


''' ===== API DEFINED FROM HERE ===== '''
@frontend.route('/api/new', methods=['POST'])
def create_equation():
    '''
    strokes = json.loads(request.form['strokes'])

    out_file = tempfile.NamedTemporaryFile(delete=False)
    out_file.close()

    scg_file = tempfile.NamedTemporaryFile(delete=False)
    scg_file.write('SCG_INK\n{}\n'.format(len(strokes)))
    for stroke in strokes:
        scg_file.write('{}\n'.format(len(stroke)))
        for point in stroke:
            scg_file.write('{} {}\n'.format(point[0], point[1]))
    scg_file.close()

    with open(scg_file.name, 'r') as f:
        print(f.read())
    subprocess.call(['seshat', '-c', 'Config/CONFIG', '-i', scg_file.name, '-r', out_file.name])
    '''
    return "1"

@frontend.route("/api/show/<int:idx>")
def show(idx):

    ''' Temporal input'''
    Exp = MathExp("{x}^{3}+1")


    res = {"tex"    : Exp.tex,
           "hangul" : Exp.tex,
           "word"   : Exp.tex,
           "name"   : "My First Equation",
    }
    return json.dumps(res)

@frontend.route("/api/save/<int:idx>")
def save(idx):
    pass

@frontend.route("/api/delete/<int:idx>")
def delete(idx):
    pass

@frontend.route("/api/share/<int:idx>")
def share(idx):
    pass

@frontend.route("/api/signin", methods=["POST"])
def signin():
    pass

@frontend.route("/api/signup", methods=["POST"])
def signup():
    pass

@frontend.route("/api/mypage", methods=["GET", "POST"])
def mypage():
    pass

@frontend.route("/api/listing")
def listing():
    pass
