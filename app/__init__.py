from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from flask.ext.session import Session
import config

engine = create_engine(config.db_path, convert_unicode=True)
db_session = scoped_session(sessionmaker(autocommit=False,
    autoflush=False,
    bind=engine))
Base = declarative_base()
Base.query = db_session.query_property()

from frontend import *
app.secret_key = config.secret_key
app.config['SESSION_TYPE'] = 'filesystem'
Session(app)
app.register_blueprint(frontend)
