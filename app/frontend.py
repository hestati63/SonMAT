import json
import tempfile
import subprocess
from flask import Flask, Blueprint, render_template, request, send_from_directory, redirect, url_for
from .model import MathExp, User
app = Flask(__name__)
frontend = Blueprint('frontend', __name__)

def get_user():
    return session['user'] if 'user' in session.keys() \
            else None

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
    session['exp'] = MathExp('1+1=2')
    return "1"

@frontend.route("/api/show/<int:idx>")
def show(idx):
    #exp = MathExp.query.filter_by(id = idx).first()
    ''' Temporal input'''
    exp = MathExp("{x}^{3}+1")
    exp.make_share()

    user = get_user()
    if exp and \
        (exp.owner == user or exp.is_shared()) :
        return exp.jsonfy();
    return json.dumps({'msg': -1})

@frontend.route("/api/save")
def save():
    user = get_user()
    if get_user() != None \
        and 'exp' in session.keys() and session['exp'] != None:
            user = session['user']
            exp  = session['exp']
            db_session.add(exp)
            db_session.commit()
            user.Exps.append(exp)
            db_session.add(user)
            db_session.commit()
            return json.dumps({'msg': exp.id})

@frontend.route("/api/delete/<int:idx>")
def delete(idx):
    exp = MathExp.query.filter_by(id = idx).first()
    user = get_user()
    if exp and exp.owner == user:
        user.Exps.remove(exp)
        db_session.add(user)
        db_session.delete(exp)
        db_session.commit()
        return json.dumps({'msg': 1})
    return json.dumps({'msg': -1})

@frontend.route("/api/share/<int:idx>")
def share(idx):
    exp = MathExp.query.filter_by(id = idx).first()
    user = get_user()
    if exp and exp.owner == user:
        exp.make_share()
        db_session.add(exp)
        db_session.commit()
        return json.dumps({'msg': 1})
    return json.dumps({'msg': -1})

@frontend.route("/api/signin", methods=["POST"])
def signin():
    username = request.form['username']
    password = request.form['password']
    if get_user() != None:
        return json.dumps({'msg': -1})
    else:
        user = User.query.filter_by(username = username).first()
        if user and user.check_password(password):
            session['user'] = user
            return json.dumps({'msg': 'welcome back {}.'.format(username)})
        else:
            return json.dumps({'msg': 'wrong password.'})

@frontend.route("/api/logout")
def logout():
    session['user'] = None
    session['exp']  = None
    return json.dumps({'msg': 'bye'})

@frontend.route("/api/signup", methods=["POST"])
def signup():
    if get_user() != None:
        return json.dumps({'msg': -1})
    username    = request.form['username']
    password    = request.form['password']
    passwordchk = request.form['passwordchk']
    email       = request.form['email']
    if password == passwordchk:
        if User.query.filter_by(username = username).all() == None:
            if len(username) < 4:
                return json.dumps({'msg': 'username must be longer than 4 letters.'})
            if len(password) < 4:
                return json.dumps({'msg': 'password must be longer than 4 letters.'})
            user = User(username, password, email)
            db_session.add(user)
            db_session.commit()
            return json.dumps({'msg': 'Sucessfully joined.'})
        else:
            return json.dumps({'msg': 'User already exists.'})
    return json.dumps({'msg': 'password check fail.'})

@frontend.route("/api/mypage", methods=["GET", "POST"])
def mypage():
    user = get_user()
    if user != None:
        curpassword = request.form['curpassword']
        password    = request.form['password']
        passwordchk = request.form['passwordchk']
        if user.check_password(curpassword):
            if password == passwordchk:
                if len(password) < 4:
                    return json.dumps({'msg': 'password must be longer than 4 letters.'})
                user.set_password(password)
                db_session.add(user)
                db_session.commit()
            else:
                return json.dumps({'msg': 'password check fail.'})
        return json.dumps({'msg': 'wrong current password'})
    return json.dumps({'msg': -1})

@frontend.route("/api/listing")
def listing():
    user = get_user()
    if user == None:
        val = list()
        for Exp in user.Exps:
            val.append({'name': Exp.name, 'tex': Exp.tex})
        return json.dumps({'msg': 1, 'data': val})
    return json.dumps({'msg': -1})
