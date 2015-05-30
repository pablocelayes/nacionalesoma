#!/usr/bin/env python
# -*- coding: utf-8 -*-

# Para adicionar la columna de género a los csv's 

import pandas as pd

gral_name_table = pd.read_table("generos.txt")

gender_list = "FM"

tildes = {"Á":"A",
		  "É":"E",
		  "Í":"I",
		  "Ó":"O",
		  "Ú":"U"}

def normalize_str(string):
	""" Para que los nombres puedan ser encontrados en 'géneros.txt'
	se requiere la cadena no tenga tildes y esté en mayúsculas.
	"""
	upper_string = string.upper()
	if ascii(upper_string) == upper_string:
		return upper_string
	res = []
	for i in upper_string:
		if i in tildes.keys():
			res.append(tildes[i])
		else:
			res.append(i)
	return "".join(res)

def find_gender(string):
	"""Para encontrar el género del participante usando la tabla de géneros.
	"""
	str_split = string.split()[0]
	record1 = gral_name_table[gral_name_table['nombre'] == normalize_str(string)].male
	if record1.any():
		return gender_list[int(record1.iloc[0])]
		# return int(record1.iloc[0])
	else:
		#~ usando sólo el primer nombre, p.e de "Juan Carlos" -> "Juan"
		record2 = gral_name_table[gral_name_table['nombre'] == normalize_str(str_split)].male
		if record2.any():
			return gender_list[int(record2.iloc[0])]
			# return int(record2.iloc[0])
	# return string
	return "UNKNOWN"

# Procesando clasificados y aprobados
clasificados = "./clasificados/csvs/clasificados" 
aprobados = "./aprobados/csvs/aprobados" 

def unknown_genders():	
	 # for debugging: para ver los nombres que no están en 'generos.txt'
	 print(df.iloc[gender_df[gender_df > 1].index])
	
def gender_to_csvs(file_template):
	for i in range(1998,2015):
		file = "{0}{1}.csv".format(file_template,i)
		df = pd.read_csv(file)
		# gender_df = df['Nombres'].apply(find_gender)
		df['Género'] = df['Nombres'].apply(find_gender)
		# unknown_genders()
		df.to_csv("{0}{1}.csv".format(file_template,i),encoding='utf-8',index=False)

gender_to_csvs(clasificados)
gender_to_csvs(aprobados)
