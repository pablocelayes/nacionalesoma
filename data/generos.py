#!/usr/bin/env python
# -*- coding: utf-8 -*-

# Para adicionar la columna de género a los csv's 

import pandas as pd

# digit_to_gender = ["F","M"]
gral_name_table = pd.read_table("generos.txt")

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
		return record1.iloc[0]
	else:
		record2 = gral_name_table[gral_name_table['nombre'] == normalize_str(str_split)].male
		if record2.any():
			return record2.iloc[0]
	return string

# Procesando clasificados
file_template = "./clasificados/csvs/clasificados" 
	
for i in range(1998,2015):
	file = "{0}{1}.csv".format(file_template,i)
	df = pd.read_csv(file)
	gender_df = df['Nombres'].apply(find_gender)
	# hasta aquí va bien
	new_def = pd.concat([df,gender_df])
	new_def.to_csv("{0}_gender.csv".format(i))