import os
db_path = "sqlite:///{}/tmp.db".format('/'.join(os.path.realpath(__file__).split("/")[:-2]))
secret_key = "SECRET_KEY_WILL_BE_HERE"
