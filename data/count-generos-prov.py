#!/usr/bin/env python
# -*- coding: utf-8 -*-

# Resumen por años y por géneros

import pandas as pd
import numpy as np

clasificados = "./clasificados/csvs/clasificados"
aprobados = "./aprobados/csvs/aprobados"
premiados = "./premiados/csvs/premiados"

provincias = ['San Luis',
 'Formosa',
 'Tucumán',
 'Río Negro',
 'Santa Cruz',
 'Catamarca',
 'Tierra del Fuego',
 'La Pampa',
 'Corrientes',
 'San Juan',
 'Jujuy',
 'Misiones',
 'Mendoza',
 'Buenos Aires',
 'Santa Fe',
 'Chaco',
 'Salta',
 'Neuquén',
 'Córdoba',
 'Entre Ríos',
 'Chubut',
 'Ciudad Autónoma de Buenos Aires',
 'Santiago del Estero']

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
	for i,val in enumerate(range(1998,2015)):
		if val != 2000 or file_template != premiados:
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
conteo_genero_provs(premiados)

