#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Para la visualización de los géneros
"""

import pandas as pd
from lxml import etree
from math import floor
import csv

gris = "#dcdcdc" 			 #valor neutro rgb(220,220,220)
celeste = "#6496ff"  		 #todos masculinos = "rgb(100,150,255)"
rosa = "#ff6496"	 		 #todos femeninos =  "rgb(255,100,150)"

#colores desde el más celeste hasta el más rosa]

colores = ["#6496ff","#7da7ff","#96b8ff","#b0c9ff","#c9dbff",
	    "#ffc9db","#ffb0c9","#ff96b8","#ff7da7","#ff6496"]

input = "../data/%s/csvs/%s_por_provincia_y_genero.csv"
output ="./%s/genero/mapa%d.svg"

PROV_CODES = {}

PATH_STYLE = ";fill-opacity:1;stroke:#ffffff;stroke-width:1.40563393;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-opacity:1;stroke-dasharray:none"
MAPA_BASE = "Blank_Argentina_Map.svg"

def color_picker(f_count,m_count):
	"""
	f_count: cantidad del género femenino
	m_count: cantidad del género masculino
	
	Devuelve un color de acuerdo al porciento
	que representa el sexo femenino del total 
	"""
	if f_count == m_count:
		return gris
	if f_count == 0:
		return celeste
	if m_count == 0:
		return rosa
	index = floor((10*f_count)/(m_count+f_count))
	# print(f_count,m_count,index)
	return colores[index]

with open('provcodes.csv', 'r') as csvfile:
	csvreader = csv.reader(csvfile)
	for row in csvreader:
		PROV_CODES[row[0]] = row[1] 	

def generar_mapas(file_type):
	reporte = input % (file_type,file_type)  # reporte = "aprobados"|"clasificados"|"premiados"	 
	data = pd.read_csv(reporte, parse_dates=True)
	años = set(data.Año.values)
	for año in años:
		xmlparser = etree.XMLParser()
		tree = etree.parse(MAPA_BASE, xmlparser)
		root = tree.getroot()            
		paths = root.xpath('//svg:path', namespaces={'svg': "http://www.w3.org/2000/svg"})

		# traer datos año
		datos_año = data[data.Año==año][["Provincia","F","M"]]
		for _,prov,f,m in datos_año.itertuples():
			pathid = PROV_CODES[prov]
			style = 'fill:' + color_picker(int(f),int(m)) + PATH_STYLE 	
			path = [p for p in paths if p.get('id') == pathid][0]
			path.set('style', style)
		with open(output % (file_type,año), 'wb') as outfile:
			content = etree.tostring(root, pretty_print=True)
			outfile.write(content)

if __name__ == '__main__':
	generar_mapas("clasificados")
	generar_mapas("aprobados")
	generar_mapas("premiados")
	
	



	

	
	



