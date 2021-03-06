#!/usr/bin/env python
# -*- coding: utf-8 -*-

# Resumen por años y por géneros

import pandas as pd
import numpy as np

clasificados = "./clasificados/csvs/clasificados"
aprobados = "./aprobados/csvs/aprobados"
premiados = "./premiados/csvs/premiados"

provincias = ["Buenos Aires",
"Catamarca",
"Chaco",
"Chubut",
"Ciudad Autónoma de Buenos Aires",
"Corrientes",
"Córdoba",
"Entre Ríos",
"Formosa",
"Jujuy",
"La Pampa",
"La Rioja",
"Mendoza",
"Misiones",
"Neuquén",
"Río Negro",
"Salta",
"San Juan",
"San Luis",
"Santa Cruz",
"Santa Fe",
"Santiago del Estero",
"Tierra del Fuego",
"Tucumán"]

def conteo_genero_provs(file_template):
	""" Genera un archivo csv de la siguiente forma(datos ficticios por supuesto)
	Año,Provincia,F,M
	1998,San Luis,7,7
	1999,San Luis,15,9
	...
	2013,Formosa,5,9
	2014,Formosa,8,8
	"""
	result = pd.DataFrame(columns = ["Provincia","Año","F","M"])
	for i,val in enumerate(range(1998,2016)):
		csv_year = pd.read_csv("{0}{1}.csv".format(file_template,val))
		stats = csv_year.groupby(["Provincia","Género"]).size()
		for prov in provincias:
			try:
				f_prov = stats[prov]['F']
			except KeyError:
				f_prov = 0
			try:
				m_prov = stats[prov]['M']
			except KeyError:
				m_prov = 0
			result = result.append({"Año":str(val),"Provincia":prov,"F":str(f_prov),"M":str(m_prov)},ignore_index=True)
	result = result.sort(["Provincia","Año"])				
	result.to_csv("{0}_por_provincia_y_genero.csv".format(file_template),encoding='utf-8',index=False)

conteo_genero_provs(clasificados)
conteo_genero_provs(aprobados)
#~ conteo_genero_provs(premiados)

