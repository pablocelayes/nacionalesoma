#!/usr/bin/env python
# -*- coding: utf-8 -*-

# Para adicionar la columna de género a los csv's 

import pandas as pd
import re

clean = re.compile(r'"|,|\x96')

united_words = re.compile(r'[A-Z][a-z|áéíóúñ]+') 			#p.e MarinaAguirre, MaríaArtola, JuanPablo, etc

gral_name_table = pd.read_table("generos.txt")

gender_list = "FM"

tildes = {"Á":"A",
		  "É":"E",
		  "Í":"I",
		  "Ó":"O",
		  "Ú":"U"}

def first_index_lower(string):
	"""Utility function
	"""
	for i,val in enumerate(string):
		if val.islower():
			return i


def extract_names(string_in,year):
	"""Para uso en los csv's de premiados: convierte el contenido del campo
	'Nombres' a un formato similar a los de similar campo en los csv's de
	clasificados y aprobados. Dirty processing. 
	"""
	string = "".join(normalize_accents(string_in))
	if year < 2000:			#porque están en la forma "NAGUILJorge Luis",PASTAWSKI Fernando,etc
		index = first_index_lower(string)
		result = string[index - 1:]
	else:
		splitted_str = united_words.findall(string)
		#asumimos que si hay + de 2 campos separados por espacios
		#esto significa que los dos primeros son nombres
		#e.o.c asumimos un sólo nombre 
		result = ' '.join(splitted_str[:2]) if len(splitted_str) > 2 else splitted_str[0] 
	return clean.sub("",result).strip()

def normalize_accents(string):
	res = []
	for i in string:
		if i in tildes.keys():
			res.append(tildes[i])
		else:
			res.append(i)
	return res			
	
def normalize_str(string):
	""" Para que los nombres puedan ser encontrados en 'géneros.txt'
	se requiere la cadena no tenga tildes y esté en mayúsculas.
	"""
	upper_string = string.upper()
	if ascii(upper_string) == upper_string:
		return upper_string
	return "".join(normalize_accents(upper_string))

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
	# return "UNKNOWN"
	return 2

# Procesando clasificados y aprobados
clasificados = "./clasificados/csvs/clasificados" 
aprobados = "./aprobados/csvs/aprobados" 
premiados = "./premiados/csvs/premiados" 

def unknown_genders():	
	 # for debugging: para ver los nombres que no están en 'generos.txt'
	 print(df.iloc[gender_df[gender_df > 1].index])
	
def gender_to_csvs(file_template):
	for i in range(1998,2015):
		file = "{0}{1}.csv".format(file_template,i)
		df = pd.read_csv(file)
		df['Género'] = df['Nombres'].apply(find_gender)
		# unknown_genders()
		df.to_csv("{0}{1}.csv".format(file_template,i),encoding='utf-8',index=False)

def gender_to_csvs_premiados(file_template): 
	#pendiente refactoring teniendo en cuenta similitud entre las últimas 2 funciones
	for i in range(1998,2015):
		# print(i)
		if i != 2000:
			file = "{0}{1}.csv".format(file_template,i)
			df = pd.read_csv(file)
			temp = df['Nombres'].apply(extract_names,year=i)
			df['Género'] = temp.apply(find_gender)
			# unknown_genders()
			df.to_csv("{0}{1}.csv".format(file_template,i),encoding='utf-8',index=False)	

gender_to_csvs(clasificados)
gender_to_csvs(aprobados)
gender_to_csvs_premiados(premiados)
