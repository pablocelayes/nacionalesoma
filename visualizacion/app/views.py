# -*- coding: utf-8 -*-

from flask import Flask, Markup, json, render_template,make_response, request, redirect, url_for, abort, session, Response
from app import app
# from os import getcwd
# print(getcwd())
from pprint import pprint

from retrieve import data,df_to_response

# print(retrieve.data1)

@app.route('/',methods=['GET'])
@app.route('/index',methods=['GET'])
def index():
	user = {'nickname': "Nacionales OMA"}
	clasif_html = open('./app/templates/clasificados.html','r',encoding="utf-8").read()
	generos_html = open('./app/templates/generos.html','r',  encoding="iso-8859-1").read()
	about_html = open('./app/templates/about.html','r',  encoding="iso-8859-1").read()
	gini_html = open('./app/templates/gini.html','r',encoding="utf-8").read()
	return render_template('index.html',
						title='Análisis y Visualización sobre datos del evento',
						user=user,
						a1 = Markup(clasif_html),
						a2 = Markup(generos_html),
						a3 = Markup(gini_html),
						a4 = 'En construcción',
						a5 = Markup(about_html)
						)
						
@app.route('/update',methods=['POST'])
def update():
	colores = ["#ffe9e9","#e0b6b6","#db9696",
				"#7e4747","#410e0e"]
	year = int(request.form['year'])
	df = data[year]
	# print(df)
	val = df_to_response(df,colores)
	# pprint(val)
	resp = Response(response=json.dumps(val),
					status=200,
					mimetype="application/json")
	return(resp)				
