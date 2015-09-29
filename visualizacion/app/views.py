# -*- coding: utf-8 -*-

from flask import render_template
from app import app
from os import getcwd

@app.route('/')
@app.route('/index')
def index():
	user = {'nickname': "Nacionales OMA"}
	pwd  = getcwd()
	return render_template('index.html',
						title='Análisis y Visualización sobre datos del evento',
						user=user,
						pwd=pwd)