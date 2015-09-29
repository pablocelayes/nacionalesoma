#!/usr/bin/python
#-*-coding:utf-8-*-

import re
import pickle
import xlrd
from scipy.sparse import coo_matrix
import numpy as np
import pandas as pd
import unicodedata as ud
from difflib import SequenceMatcher
import sys
import codecs

# ENCODING = sys.stdin.encoding
ENCODING = "utf-8"

#intentando evitar tiempo de corrida si no hay cambio de data
USE_PICKLES = False			

def load_pickle(file):
	F = open(file,'rb')
	val = pickle.load(F)
	return val

def save_pickle(val):
	F = open(file,'wb')
	pickle.dump(val,F)

def with_pickle(file,var):
	pass
	
	
def get_colegios_oma():
	"""
	Devuelve los colegios de todos 
	los clasificados 2008-2014
	(pues los colegios de aprobados y premiados salen de ahi)
	"""
	template_filename = "./clasificados/csvs/clasificados%d.csv"
	res = pd.DataFrame({'Nivel':[],'Apellido':[],
						'Nombres':[],'Localidad':[],
						'Provincia':[],'Género':[],'Colegio':[]})
	for i in range(2008,2015):
		tmp = pd.read_csv(template_filename % i)
		tmp['Año'] = i
		res = res.append(tmp,ignore_index = True)
	res.dropna(subset=['Colegio'],inplace=True)
	res['Colegio'] = res['Colegio'].apply(lambda c: c.replace('"',''))
	return res
		
def get_colegios_db():
	"""
	Devuelve un DataFrame con columnas [Nombre,Tipo-de-Gestión,Provincia,Localidad]
	"""
	
	book = xlrd.open_workbook("Mae actualizado 2015-08-31_Envios.xls")
	sheet1,sheet2 = book.sheets()
	
	sheet1_colegios = [i.value for i in sheet1.col_slice(2)[10:]]
	sheet1_gestion = [i.value for i in sheet1.col_slice(3)[10:]]
	sheet1_prov = [i.value for i in sheet1.col_slice(0)[10:]]
	sheet1_loc	= [i.value for i in sheet1.col_slice(10)[10:]]
	sheet1_dir	= [i.value for i in sheet1.col_slice(6)[10:]]
	
	sheet2_colegios = [i.value for i in sheet2.col_slice(2)[10:]]
	sheet2_gestion  = [i.value for i in sheet2.col_slice(3)[10:]]
	sheet2_prov  = [i.value for i in sheet2.col_slice(0)[10:]]
	sheet2_loc  = [i.value for i in sheet2.col_slice(10)[10:]]
	sheet2_dir  = [i.value for i in sheet2.col_slice(6)[10:]]
	
	#uniendo opciones las escuelas con ofertas activas e inactivas
	colegios = sheet1_colegios + sheet2_colegios
	gestion  = sheet1_gestion + sheet2_gestion
	provincias = sheet1_prov + sheet2_prov
	localidad = sheet1_loc + sheet2_loc
	direccion = sheet1_dir + sheet2_dir
	
	
	df = pd.DataFrame({'Colegio':np.array(colegios),
					   'Sector':np.array(gestion),
					   'Provincia':np.array(provincias),
					   'Localidad':np.array(localidad),
					   'Dirección':np.array(direccion)})
	return df

def advanced_str_search(df,pattern,field):
	"""
	Para encontrar entradas similares por regexps
	"""
	re_str = re.compile(pattern,re.IGNORECASE)
	df2 = pd.DataFrame(columns=df.columns)
	for i,val in df[field].iteritems():
		if re_str.search(val):
			df2 = df2.append(df.ix[i],ignore_index=True)
	return df2

def nans(df,field):	
	"""
	Para encontrar todas las entradas de un campo con valos NaN
	"""
	df2 = pd.DataFrame(columns=df.columns)
	for i,val in df[field].iteritems():
		if type(val) != type("") or val == "<empty>":
			df2 = df2.append(df.ix[i])
	return df2

def remove_accents(s):
	return ''.join((c for c in ud.normalize('NFD', s) if ud.category(c) != 'Mn'))
	
def normalize(hname):
	return remove_accents(hname).lower()
	
def string_sim(hname1, hname2):
	"""
		Normalize both names
		and obtain string similarity
	"""
	seq = SequenceMatcher(a=normalize(hname1), b=normalize(hname2))
	return seq.ratio()
	
def heuristica(coleg1,loc1,coleg2,loc2,select_val):
	"""
	Usamos una suma pesada teniendo como prioridad la semejanza en el
	nombre del colegio.	
	'select_val' es una funcion para filtrar los valores probablemente menos semejantes.
	"""
	w_nom = 3	#quiza se podrian probar otros valores para los pesos
	w_loc = 2
	return select_val(w_nom*(string_sim(coleg1,coleg2)) + w_loc*(string_sim(loc1,loc2)))

def f(x):
	"""
	Para usar como parametro en 'select_val', como un SequenceMatcher.ratio() > 0.6 
	se supone(segun la documentacion oficial) es indicador de aceptable similaridad entre los dos valores 
	(a > 0.6)^(b > 0.6) => 3*a + 2*b > 3 y podemos refinar un poco más la heuristica. 
	"""
	if x < 3:
		return 0
	return x	

if __name__ == '__main__':
	colegios_oma = get_colegios_oma()
		
	# oma_groupby = colegios_oma.groupby(['Colegio','Provincia'])
	singles_oma = colegios_oma.drop_duplicates(subset=['Colegio','Provincia','Localidad'])
	singles_oma = singles_oma.loc[:,['Colegio','Provincia','Localidad','Año']]
	# singles_oma_counts = oma_groupby.size()
	
	colegios_db = get_colegios_db()
	singles_db = colegios_db.drop_duplicates(subset=['Colegio','Provincia','Localidad'])
	singles_db = singles_db.loc[:,['Colegio','Provincia','Localidad','Sector','Dirección']]
	
	# print(advanced_str_search(colegios_oma,r'Belgrano','Colegio'))
	
	# print(nans(singles_oma,'Colegio'))
	
	result = pd.DataFrame({'Colegio_oma':[],
						   'Colegio_db':[],
					  	   'Provincia':[],
						   'Localidad':[],
						   'Sector':[],
						   })
	
	provs = set(singles_oma['Provincia'].dropna(how='Any'))	
	
	dmatches = 0
	for prov in provs:
		provs_i = singles_oma[singles_oma['Provincia'] == prov]
		provs_j = singles_db[singles_db['Provincia'] == prov]	
		for i,esc_i,prov_i,loc_i,year_i in provs_i.itertuples():
			# print(i)
			for j,esc_j,prov_j,loc_j,sect_j,dir_j in provs_j.itertuples():
				# print(i,j,dmatches)
				if normalize(esc_i) == normalize(esc_j):
					result = result.append(pd.DataFrame({'Colegio_oma':[esc_i],
														 'Colegio_db':[esc_j],
														 'Provincia':[prov_j],
														 'Localidad':[loc_j],
														 'Sector':[sect_j],
														}),ignore_index=True)
					#marcando colegios con NaN para despues eliminarlos
					singles_db.at[j,'Colegio'] = np.nan
					singles_oma.at[i,'Colegio'] = np.nan
					dmatches += 1
					break
		print(prov)
	
	#eliminando colegios marcados con NaN
	singles_oma.dropna(subset=['Colegio'],inplace=True)
	singles_db.dropna(subset=['Colegio'],inplace=True)
		
	print("----------------------------------------------------")
	print("%d direct matches found" % dmatches)
	# # print(result)		
	
	# # 4. create pairwise similarities matrix for colleges (oma<->db)
	print("%d OMA-colleges left to match with %d MAE DB" % (len(singles_oma), len(singles_db)))
	print("----------------------------------------------------\n")

	print("Building similarity matrix...")
	
	row = []
	col = []
	data = []
	for prov in provs:
		print(prov)
		provs_i = singles_oma[singles_oma['Provincia'] == prov]
		provs_j = singles_db[singles_db['Provincia'] == prov]	
		for i,esc_i,prov_i,loc_i,year_i in provs_i.itertuples():
			for j,esc_j,prov_j,loc_j,sect_j,dir_j in provs_j.itertuples():
				heur_val = heuristica(esc_i,loc_i,esc_j,loc_j,f) 
				if heur_val:
					# row += [i]
					row.append(i)	
					# col += [j]
					col.append(j)
					# data += [heuristica(esc_i,loc_i,esc_j,loc_j,f)]	
					data.append(heur_val)
	
	row  = np.array(row)
	col  = np.array(col)
	data = np.array(data)
	len_oma = len(colegios_oma)
	len_db = len(colegios_db)
	
	#usando coo_matrix para hacer un poco más eficientes los próximos pasos
	sims = coo_matrix((data,(row,col)),shape=(len_oma,len_db)) 
	
	# print(sims)	
	
	# 5. Match the remaning by similarity in a greedy fashion
	#    asking the user for confirmation
	print("----------------------------------------------------")
	print("Asking part...")
	print("----------------------------------------------------\n")
	matches = 0
	aut_matches = 0
	hit_indexes_i = {}
	hit_indexes_j = {}
	
	def add_to_result(i,j):
		result = result.append(pd.DataFrame(
			{'Colegio_oma':singles_oma.ix[i]['Colegio'],
			 'Colegio_db':singles_db.ix[j]['Colegio'],
			 'Provincia':singles_db.ix[j]['Provincia'],
			 'Localidad':singles_db.ix[j]['Localidad'],
			 'Sector':singles_db.ix[j]['Sector'],
			}),ignore_index=True)
	
	while matches <= len(singles_oma):
		for i, j,val in zip(sims.row,sims.col,sims.data): 
			if not hit_indexes_i.get(i,False) or not hit_indexes_j.get(j,False):
				if val > 4.5:	#automaticante lo ponemos en 'result'
					add_to_result(i,j)
					aut_matches += 1
					matches +=1
					print("Match automatico encontrado!")	
				else:
					answer = None
					while not answer in ["y", "n"]:
						answer = input("Match %s (OMA) to %s (MAE)? [y/n]" %
							(singles_oma.ix[i]['Colegio'], singles_db.ix[j]['Colegio']))

					if answer == "y":
						print("----------------------------------------------------")
						print("%d unmatched colleges left" % (singles_oma - matches))
						print("----------------------------------------------------\n")
						matches += 1
						add_to_result(i,j)
						# # clear i row and j column
						hit_indexes_i[i] = True
						hit_indexes_j[j] = True
	print("%d matches de ellos %d automaticos" %(matches, aut_matches))
