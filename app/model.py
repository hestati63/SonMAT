from . import Base, engine
from sqlalchemy import Table, Column, Integer, String, Boolean, DateTime, ForeignKey, desc, asc
from sqlalchemy.orm import relationship, backref
from werkzeug.security import generate_password_hash, check_password_hash
import json



class User(Base):
    __tablename__ = "User"
    id        = Column(Integer, primary_key = True)
    username  = Column(String(32), unique = True)
    password  = Column(String(64), unique = False)
    email     = Column(String(64), unique = False)
    Exps      = relationship("MathExp", backref="owner")

    def __init__(self, _username, _password, _email):
        self.username = _username
        self.set_password(_password)
        self.email    = _email

    def __repr__(self):
        return "<User: {}>".format(self.username)

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)


class MathExp(Base):
    __tablename__ = "MathExp"
    id      = Column(Integer, primary_key = True)
    scgfile = Column(String(128), unique = True)
    resfile = Column(String(128), unique = True)
    name    = Column(String(128), unique = False)
    shared  = Column(Boolean, unique = False)

    tex     = Column(String(1024), unique = False)
    user_id = Column(Integer, ForeignKey('User.id'))


    def __init__(self, _res):
        self.res = _res['symbols']
        self.tex = _res['latex']
        sorted(self.res, key = lambda x: x.idx)

    def _internal_loop(self, _cur, sym_li):
        while len(sym_li) != 0:
            _next = sym_li.pop(0)
            print _cur, _next
            location = _next.location(_cur)
            self._internal_loop(_next, sym_li)
            if location in [0, 1, -1]:
                _cur.next.append((location, _next))
            else:
                sym_li.insert(0, _next)
                return False
        return True

    def fixup(self):
        _cur = self.res.pop(0)
        if self._internal_loop(_cur, self.res):
            self.tex = _cur.gen_tex()


    def is_shared(self):
        return self.shared == True

    def make_share(self):
        self.shared = True

    def make_unshare(self):
        self.shared = False

    def make_hangul(self):
        return 'Todo'

    def make_word(self):
        return 'Todo'

    def jsonfy(self):
        res = {'msg'   : 1,
               'tex'   : self.tex,
               'hangul': self.make_hangul(),
               'word'  : self.make_word(),
               'name'  : self.name}
        return json.dumps(res)

def init_db():
    Base.metadata.create_all(bind=engine)


