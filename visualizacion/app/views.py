# -*- coding: utf-8 -*-

from flask import Flask, Markup, json, render_template,make_response, request, redirect, url_for, abort, session, Response
from app import app
import math
from pandas import DataFrame,read_csv,merge
from numpy import inf
import numpy as np
import xlrd
import re
# from os import getcwd
from random import random

caba = re.compile(r'Capital Federal|^.+Buenos Aires$')

def is_CABA(string):
	return caba.search(string)

def check(string):
	if is_CABA(string):
		return "Ciudad Autónoma de Buenos Aires"
	return string

def poblacion_escolar(year):
	"""
	Para obtener la cantidad de alumnos elegibles para
	participar en la OMA(secundaria) de los datos oficiales
	del ministerio.
	"""
	if year < 2007:
		return get_pob_esc1(year)	#distintos formatos
	return get_pob_esc2(year)
	
def get_pob_esc1(year):
	
	file1 = '../data/selected_pob_escolar/%s/EGB3.xls'
	file2 = '../data/selected_pob_escolar/%s/POLIMODAL.xls'
	file_clasif = '../data/clasificados/provcounts.csv'
	
	book1 = xlrd.open_workbook(file1 % year)
	book2 = xlrd.open_workbook(file2 % year)
	
	sheet_book1 = book1.sheets()[0]
	sheet_book2 = book2.sheets()[0]
	
	book1_provs = list(map(check,sheet_book1.col_values(0)[4:28]))
	
	book1_counts = sheet_book1.col_values(1)[4:28]
		
	book2_provs = list(map(check,sheet_book2.col_values(0)[4:28]))
	book2_counts = sheet_book2.col_values(1)[4:28]
	
	df_clasif = read_csv(file_clasif)
	
	df_clasif = df_clasif[df_clasif['Año'] == year]
	
	df_clasif = DataFrame({'Provincia':df_clasif['Provincia'],
						'Clasificados':df_clasif['Cantidad']})
					
	
	df_pob_esc = DataFrame({'Provincia':book1_provs,
					'Población':np.array(book1_counts)+np.array(book2_counts),
					})
	
	df = merge(df_pob_esc,df_clasif,on='Provincia',how='outer')
	
	return df.fillna(value=0)

def get_pob_esc2(year):					
	
	file = '../data/selected_pob_escolar/%s/COMUN.xls'
	file_clasif = '../data/clasificados/provcounts.csv'
	
	book = xlrd.open_workbook(file % year)
	sheet_book = book.sheets()[0]
	
	book_provs = list(map(check,sheet_book.col_values(0)[11:35]))
	
	book_counts_1 = sheet_book.col_values(4)[11:35]
	book_counts_2 = sheet_book.col_values(8)[11:35]
	
	df_clasif = read_csv(file_clasif)
	
	df_clasif = df_clasif[df_clasif['Año'] == year]
	
	df_clasif = DataFrame({'Provincia':df_clasif['Provincia'],
						'Clasificados':df_clasif['Cantidad']})
	
	df_pob_esc = DataFrame({'Provincia':book_provs,
					'Población':np.array(book_counts_1)+np.array(book_counts_2)})
	
	df = merge(df_pob_esc,df_clasif,on='Provincia',how='outer')
	
	return df.fillna(value=0)

def save_div(m,n):
	if n != 0:
		return m/n
	return 0	
	
def df_to_response(df,colores):
	tmp = df.to_dict()
	cantidades = df['Clasificados']/df['Población']
	cantidades = list(map(lambda c: c if c != inf else 0.0,
						[math.log(c + 1) for c in cantidades]))
	max_value = max(cantidades)
	min_value = min(cantidades)

	def color(valor):
		i = math.floor((len(colores)-1) * (math.log(valor + 1) - min_value) / (max_value - min_value))
		return colores[i]
	
	res = {}
	for i in range(24):
		n = tmp['Población'][i]
		m = tmp['Clasificados'][i]
		index = save_div(m,n)	
		res[tmp['Provincia'][i]] = {'Población':n,
									'Clasificados':m,
									'Índice':index,
									'Color':color(index)}
									#agregar después(quizá en otra parte)
									#los datos por niveles
	return res
			
@app.route('/',methods=['GET'])
@app.route('/index',methods=['GET'])
def index():
	user = {'nickname': "Nacionales OMA"}
	clasif_html = open('./app/templates/clasificados.html','r',encoding="utf-8").read()
	generos_html = open('./app/templates/generos.html','r').read()
	about_html = open('./app/templates/about.html','r').read()
	return render_template('index.html',
						title='Análisis y Visualización sobre datos del evento',
						user=user,
						a1 = Markup(clasif_html),
						a2 = Markup(generos_html),
						a3 = 'En construcción',
						a4 = 'En construcción',
						a5 = Markup(about_html)
						)
						
@app.route('/update',methods=['POST'])
def update():
	colores = ["#ffe9e9","#e0b6b6","#db9696",
				"#7e4747","#410e0e"]
	year = int(request.form['year'])
	df = poblacion_escolar(year)
	val = df_to_response(df,colores)
	print(val)
	resp = Response(response=json.dumps(val),
					status=200,
					mimetype="application/json")
	return(resp)				