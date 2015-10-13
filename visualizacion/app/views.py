# -*- coding: utf-8 -*-

from flask import Flask, Markup, json, render_template,make_response, request, redirect, url_for, abort, session, Response
from app import app

from pandas import DataFrame
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
	
	book1 = xlrd.open_workbook(file1 % year)
	book2 = xlrd.open_workbook(file2 % year)
	
	sheet_book1 = book1.sheets()[0]
	sheet_book2 = book2.sheets()[0]
	
	book1_provs = list(map(check,sheet_book1.col_values(0)[4:28]))
	
	book1_counts = sheet_book1.col_values(1)[4:28]
		
	book2_provs = list(map(check,sheet_book2.col_values(0)[4:28]))
	book2_counts = sheet_book2.col_values(1)[4:28]
	
	df = DataFrame({'Provincia':book1_provs,
					 'Cantidad':np.array(book1_counts)+np.array(book2_counts)})
	
	return df

def get_pob_esc2(year):					
	
	file = '../data/selected_pob_escolar/%s/COMUN.xls'
	
	book = xlrd.open_workbook(file % year)
	sheet_book = book.sheets()[0]
	
	book_provs = list(map(check,sheet_book.col_values(0)[11:35]))
	
	book_counts_1 = sheet_book.col_values(4)[11:35]
	book_counts_2 = sheet_book.col_values(8)[11:35]
	
	df = DataFrame({'Provincia':book_provs,
					'Cantidad':np.array(book_counts_1)+np.array(book_counts_2)})
	
	return df
	
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
	year = int(request.form['year'])
	# colors = colores(request.form['type']) 
	val1 = poblacion_escolar(year).to_json()
	# print(val1)
	# val = {'colores':colors,'datos':val1}
	resp = Response(response=val1,
					status=200,
					mimetype="application/json")
	return(resp)				