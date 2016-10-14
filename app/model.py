from . import Base, engine
from sqlalchemy import Table, Column, Integer, String, Boolean, DateTime, ForeignKey, desc, asc
from sqlalchemy.orm import relationship, backref
from werkzeug.security import generate_password_hash, check_password_hash


Exps = Table('Exps',
         Base.metadata,
         Column('User_id', Integer, ForeignKey('User.id')),
         Column('MathExp_id',Integer, ForeignKey('MathExp.id'))
        )

class User(Base):
    __tablename__ = "User"
    id        = Column(Integer, primary_key = True)
    username  = Column(String(32), unique = True)
    password  = Column(String(64), unique = False)
    email     = Column(String(64), unique = True)
    Exps      = relationship('MathExp', secondary=Exps, lazy='dynamic')

    def __init__(self, _username, _password, _email):
        self.username = _username
        self.password = self.set_password(_password)
        self.email    = _email

    def __repr__(self):
        return "<User: {}>".format(self.username)

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)


class MathExp(Base):
    __tablename__ = "MathExp"
    id = Column(Integer, primary_key = True)
    scgfile = Column(String(128), unique = True)
    resfile = Column(String(128), unique = True)
    tex     = Column(String(1024), unique = False)

    def __init__(self, _tex):
        self.tex = _tex

def init_db():
    Base.metadata.create_all(bind=engine)


