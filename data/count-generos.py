#!/usr/bin/env python
# -*- coding: utf-8 -*-

# Resumen por años y por géneros

import pandas as pd
import numpy as np

clasificados = "./clasificados/csvs/clasificados"
aprobados = "./aprobados/csvs/aprobados"
premiados = "./premiados/csvs/premiados"

def conteo_genero(file_template):
	""" Genera un archivo csv de la siguiente forma(datos ficticios por supuesto)
	Año,F,M
	1998,7,7
	...
	2014,8,8
	"""
	result = pd.DataFrame(columns = ["Año","F","M"])
	for i,val in enumerate(range(1998,2016)):
		csv_year = pd.read_csv("{0}{1}.csv".format(file_template,val))
		f_count = str(csv_year[csv_year['Género'] == "F"].count()[0])	
		m_count = str(csv_year[csv_year['Género'] == "M"].count()[0])	
		result.loc[i] = [str(val),f_count,m_count]
	result.to_csv("{0}_por_género.csv".format(file_template),encoding='utf-8',index=False)

conteo_genero(clasificados)
conteo_genero(aprobados)
conteo_genero(premiados)

