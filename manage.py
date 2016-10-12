from app import app
from app.model import init_db

import sys
if __name__ == "__main__":
    arg = sys.argv[1] if len(sys.argv) > 1 else None
    if arg == "initdb":
        init_db()
    elif arg == "runserver":
        app.run("0.0.0.0", debug = True);
