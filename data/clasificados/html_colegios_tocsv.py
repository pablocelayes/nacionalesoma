#!/usr/bin/env python
# -*- coding: utf-8 -*-

import pandas as pd
from lxml import etree
# import csv
import sys
import lxml.html as lh
from pprint import pprint


years = range(2008,2015) #son los agnos que tienen datos de colegio para los participantes
file_template_html = 'clasificados%d.html'
file_template_csv = './csvs/clasificados%d.csv'

def colegios_a_csv(year):
	insertar_colegios_a_csv(year,select_colegios(year))
	
def insertar_colegios_a_csv(year,list_colegios):
	colegio = pd.read_csv(file_template_csv % year)
	colegio['Colegio'] = list_colegios
	colegio.to_csv(file_template_csv % year,encoding='utf-8',index=False)

def select_colegios(year):
	filename = file_template_html % year
	content = open(filename, 'r', encoding='iso-8859-1').read()
	tree = lh.fromstring(content)
	rootnode = tree.getroottree()
	
	#validando la posicion del campo colegio en el archivo html
	if year > 2008:
		field_colegio = -1
	else:
		field_colegio = 2
	
	#tomando la data
	tables = rootnode.xpath('//table')
	dataniveles = [tables[i] for i in [1, 3, 5]]
	res = []
	
	for i, data in enumerate(dataniveles):
		filas = data.xpath('.//tr')
		filas = [[n.text_content().strip() for n in f.xpath('./td')] for f in filas]
		filas = [f[field_colegio] for f in filas if f]
		filas = filas[1:]
		res += filas
	return res
	# pprint(res)
	# print(len(res))
	
	
if __name__ == "__main__":
	for i in years:
		colegios_a_csv(i)
	



