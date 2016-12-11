all:
	rm tmp.db || true
	rm -rf flask_session || true
	python manage.py initdb
	LD_LIBRARY_PATH=/home/gon/xerces-c-3.1.4/build/lib:${LD_LIBRARY_PATH} PATH=/home/gon/seshat:${PATH} uwsgi --ini uwsgi.ini
