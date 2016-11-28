import json
import tempfile
import subprocess
from . import db_session
from . import fix
from flask import Flask, Blueprint, render_template, request, send_from_directory, redirect, url_for, session
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
def get_user():
    return session['user'] \
            if 'user' in session.keys() else None


def parse_seshat(strokes, seshat_output):
    symbols = []
    latex = ''
    index = 0

    symbol_lines = False
    latex_line = False
    for line in seshat_output.split('\n'):
        if not line.strip():
            symbol_lines = False
            latex_line = False
            continue
        elif line.startswith('Math Symbols:'):
            symbol_lines = True
            continue
        elif line.startswith('LaTeX:'):
            latex_line = True
            continue

        if symbol_lines:
            sym_latex, sym_strokes = line.split('{')
            sym_latex = sym_latex.strip()
            sym_strokes = map(int, sym_strokes.split('}')[0].strip().split())
            sym_strokes = [strokes[idx] for idx in sym_strokes]
            x_min = x_max = sym_strokes[0][0][0]
            y_min = y_max = sym_strokes[0][0][1]
            cx = cy = n = 0.0
            for stroke in sym_strokes:
                for point in stroke:
                    cx += point[0]
                    cy += point[1]
                    n += 1
                    if x_min > point[0]:
                        x_min = point[0]
                    elif x_max < point[0]:
                        x_max = point[0]
                    if y_min > point[1]:
                        y_min = point[1]
                    elif y_max < point[1]:
                        y_max = point[1]
            symbols.append(fix.symbol(index, sym_latex, x_max, x_min, y_max, y_min, (cx/n, cy/n)))
            index += 1
        elif latex_line:
            latex = line

    return {'latex': latex, 'symbols': symbols}

@frontend.route('/api/new', methods=['POST'])
def create_equation():
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

    pipe = subprocess.Popen(
        ['seshat',
         '-c', 'Config/CONFIG',
         '-i', scg_file.name,
         '-d', out_file.name],
        stdout=subprocess.PIPE)
    seshat_output = pipe.stdout.read()
    seshat_obj = parse_seshat(strokes, seshat_output)
    exp = MathExp(seshat_obj)
    exp.name = "Result"
    exp.owner = get_user()
    exp.fixup()
    print seshat_obj['latex'], exp.tex
    session['exp'] = exp
    msg = seshat_obj['latex']
    return json.dumps({'res': 1, 'msg': msg, 'fix': exp.tex})

@frontend.route("/api/show/<int:idx>")
def show(idx):
    if idx == 0:
        exp = session['exp']
    else:
        exp = MathExp.query.get(idx)

    user = get_user()
    if exp and \
        ((user != None and exp.owner.id == user.id) or exp.is_shared()) :
        return exp.jsonfy();
    return json.dumps({'msg': -1})

@frontend.route("/api/save", methods=['POST'])
def save():
    user = get_user()
    if user == None:
        return json.dumps({'res': -1, 'msg': "You're not logged in."})
    if 'exp' in session.keys() and session['exp'] != None:
        user = session['user']
        exp  = session['exp']
        db_session.add(exp)
        db_session.commit()
        user.Exps.append(exp)
        db_session.add(user)
        db_session.commit()
        return json.dumps({'res': exp.id, 'msg': 'Successfully saved.'})
    return json.dumps({'res': -1, 'msg': 'Save failed.'})

@frontend.route("/api/delete/<int:idx>", methods=['POST'])
def delete(idx):
    exp = MathExp.query.get(idx)
    user = get_user()
    if user == None:
        return json.dumps({'res': -1, 'msg': "You're not logged in."})
    if exp and exp.owner.id == user.id:
        user.Exps.remove(exp)
        db_session.add(user)
        db_session.delete(exp)
        db_session.commit()
        return json.dumps({'res': 1, 'msg': 'Successfully deleted.'})
    return json.dumps({'res': -1, 'msg': 'Delete failed.'})

@frontend.route("/api/share/<int:idx>", methods=['POST'])
def share(idx):
    exp = MathExp.query.get(idx)
    user = get_user()
    if user == None:
        return json.dumps({'res': -1, 'msg': "You're not logged in."})
    if exp and exp.owner.id == user.id:
        exp.make_share()
        db_session.add(exp)
        db_session.commit()
        return json.dumps({'res': 1, 'msg': 'Now you can share the link.'})
    return json.dumps({'res': -1, 'msg': 'Share failed.'})

@frontend.route("/api/unshare/<int:idx>", methods=['POST'])
def unshare(idx):
    exp = MathExp.query.get(idx)
    user = get_user()
    if user == None:
        return json.dumps({'res': -1, 'msg': "You're not logged in."})
    if exp and exp.owner.id == user.id:
        exp.make_unshare()
        db_session.add(exp)
        db_session.commit()
        return json.dumps({'res': 1, 'msg': 'Now this link is private.'})
    return json.dumps({'res': -1, 'msg': 'Unshare failed.'})

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
            return json.dumps({'msg': 'login fail'})

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
        if User.query.filter_by(username = username).first() == None:
            if len(username) < 4:
                return json.dumps({'msg': 'username must be longer than 4 letters.'})
            if len(password) < 4:
                return json.dumps({'msg': 'password must be longer than 4 letters.'})
            user = User(username, password, email)
            db_session.add(user)
            db_session.commit()
            return json.dumps({'msg': 'Successfully joined.'})
        else:
            return json.dumps({'msg': 'User already exists.'})
    return json.dumps({'msg': 'password check fail.'})

@frontend.route("/api/mypage", methods=["POST"])
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
    if user != None:
        val = list()
        for Exp in user.Exps:
            val.append({'id': Exp.id,
                        'name': Exp.name,
                        'tex': Exp.tex,
                        'shared': Exp.shared})
        return json.dumps({'msg': 1, 'data': val})
    return json.dumps({'msg': -1})
