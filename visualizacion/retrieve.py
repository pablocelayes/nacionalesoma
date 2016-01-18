# -*- coding: utf-8 -*-

import math
from pandas import DataFrame,read_csv,merge
from numpy import inf
import numpy as np
import xlrd
from pprint import pprint
import matplotlib.pyplot as plt
import re

caba = re.compile(r'Capital Federal|^.+Buenos Aires$')
file_cat_counts = '../data/%s/provcounts.csv'

df_tmp = read_csv(file_cat_counts % "aprobados")
provincias = list(set(df_tmp['Provincia']))

def is_CABA(string):
	return caba.search(string)

def check(string):
	if is_CABA(string):
		return "Ciudad Autónoma de Buenos Aires"
	return string.strip()

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
	"""
	Uniendo población escolar de las provincias
	con los datos de participantes por categoría
	en un año específico.	
	"""
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
	#agregar después los datos por niveles
	return res

def get_province_data(prov,cat):
	cat_rows = read_csv(file_cat_counts % cat)
	res = cat_rows[cat_rows['Provincia'] == prov]
	return res

data = all_years()	
	
def get_province_particip(prov):
	res = DataFrame()
	for i in data.keys():
		row_prov = data[i][data[i]['Provincia'] == prov]
		clasificados_partic = (row_prov['Clasificados']/row_prov['Población'])*100
		aprobados_partic = (row_prov['Aprobados']/row_prov['Población'])*100
		res = res.append({'Año':i,
						  'Índice_Clasificados':clasificados_partic,
						  'Índice_Aprobados':aprobados_partic},ignore_index=True)
	return res

# print(type(get_province_partic("Chubut")))	
# print(get_province_particip("Mendoza"))	
get_province_particip("Mendoza")
