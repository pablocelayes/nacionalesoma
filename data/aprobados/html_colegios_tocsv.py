#!/usr/bin/env python
# -*- coding: utf-8 -*-

import pandas as pd
from lxml import etree
import sys
import lxml.html as lh
from pprint import pprint


years = range(2009,2015) #son los agnos que tienen datos de colegio para los participantes
file_template_html = 'aprobados%d.html'
file_template_csv = './csvs/aprobados%d.csv'

def colegios_a_csv(year):
	insertar_colegios_a_csv(year,select_colegios(year))
	
def insertar_colegios_a_csv(year,list_colegios):
	colegio = pd.read_csv(file_template_csv % year)
	colegio['Colegio'] = list_colegios
	colegio.to_csv(file_template_csv % year,encoding='utf-8',index=False)

def select_colegios(year):
	
	def some(list):
		a = [bool(i) for i in list]
		b = [False for i in list]
		return a != b
			
	filename = file_template_html % year
	content = open(filename, 'r', encoding='iso-8859-1').read()
	tree = lh.fromstring(content)
	rootnode = tree.getroottree()
	
	#tomando la data
	tables = rootnode.xpath('//table')
	dataniveles = tables[:3]
	res = []
	
	for i, data in enumerate(dataniveles):
		filas = data.xpath('.//tr')
		filas = [[n.text_content().strip() for n in f.xpath('./td')] for f in filas]
		filas = [f[-1] for f in filas if f and some(f)]
		filas = filas[1:]
		res += filas
	return res
	# print(len(res))
	# print(res)
	
	
if __name__ == "__main__":
	# select_colegios(2010)
	for i in years:
		print(i)
		colegios_a_csv(i)
	



