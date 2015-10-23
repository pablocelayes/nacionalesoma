# -*- coding: utf-8 -*-

from flask import Flask, Markup, json, render_template,make_response, request, redirect, url_for, abort, session, Response
from app import app
import math
from pandas import DataFrame,read_csv,merge
from numpy import inf
from pprint import pprint
import numpy as np
import xlrd
import re
# from os import getcwd
import matplotlib.pyplot as plt

caba = re.compile(r'Capital Federal|^.+Buenos Aires$')
file_cat_counts = '../data/%s/provcounts.csv'

def is_CABA(string):
	return caba.search(string)

def check(string):
	if is_CABA(string):
		return "Ciudad Autónoma de Buenos Aires"
	return string

def poblacion_escolar(year):
	"""
	Para obtener la cantidad de alumnos elegibles y por niveles para
	participar en la OMA(secundaria) de los datos oficiales
	del ministerio.
	"""
	if year < 2007:
		return get_pob_esc1(year)	#distintos formatos
	return get_pob_esc2(year)
	
def get_pob_esc1(year):
	
	file1 = '../data/selected_pob_escolar/%s/EGB3.xls'
	file2 = '../data/selected_pob_escolar/%s/POLIMODAL.xls'
	
	
	book1 = xlrd.open_workbook(file1 % year)
	book2 = xlrd.open_workbook(file2 % year)
	
	sheet_book1 = book1.sheets()[0]
	sheet_book2 = book2.sheets()[0]
	
	book1_provs = list(map(check,sheet_book1.col_values(0)[4:28]))
	book1_counts = sheet_book1.col_values(1)[4:28]
		
	book2_provs = list(map(check,sheet_book2.col_values(0)[4:28]))
	book2_counts = sheet_book2.col_values(1)[4:28]
					
	
	df_pob_esc = DataFrame({'Provincia':book1_provs,
							'Población':np.array(book1_counts)+np.array(book2_counts),
						   })
	
	return df_pob_esc

def get_pob_esc2(year):					
	
	file = '../data/selected_pob_escolar/%s/COMUN.xls'
	
	book = xlrd.open_workbook(file % year)
	sheet_book = book.sheets()[0]
	
	book_provs = list(map(check,sheet_book.col_values(0)[11:35]))
	
	book_counts_1 = sheet_book.col_values(4)[11:35]
	book_counts_2 = sheet_book.col_values(8)[11:35]
	
	
	df_pob_esc = DataFrame({'Provincia':book_provs,
							'Población':np.array(book_counts_1)+np.array(book_counts_2)})
	
	return df_pob_esc

def get_cat(cat,year):
	df_cat = read_csv(file_cat_counts % cat)
	
	df_cat = df_cat[df_cat['Año'] == year]
	
	cap_cat = cat.capitalize()
	
	df_cat = DataFrame({'Provincia':df_cat['Provincia'],
						cap_cat:df_cat['Cantidad']})		
	
	return df_cat

def combine_cat_with_pob_esc(cat,year):
	
	df_pob_esc = poblacion_escolar(year)
	
	df_cat = get_cat(cat,year)
	
	df = merge(df_pob_esc,df_cat,on='Provincia',how='left')
	
	df = df.fillna(value=0)	
	
	return df	
	
def all_years():
	res = {}
	for year in range(1998,2015):
		df_clasif = combine_cat_with_pob_esc("clasificados",year)
		df_aprob  = combine_cat_with_pob_esc("aprobados",year)
		df_tmp = merge(df_clasif,df_aprob,on=['Provincia','Población'],how='outer')
		res[year] = df_tmp
	return res

data = all_years()

# pprint(data)

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
		m = tmp['Clasificados'][i]
		n = tmp['Población'][i]
		o = tmp['Aprobados'][i]
		index = save_div(m,n)	
		res[tmp['Provincia'][i].strip()] = {'Población':n,
											'Clasificados':m,
											'Aprobados':o,
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
	pprint(val)
	resp = Response(response=json.dumps(val),
					status=200,
					mimetype="application/json")
	return(resp)				
