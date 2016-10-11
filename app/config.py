import os
db_path = "sqlite://{}/tmp.db".format(os.path.realpath(__file__))
secret_key = "SECRET_KEY_WILL_BE_HERE"
