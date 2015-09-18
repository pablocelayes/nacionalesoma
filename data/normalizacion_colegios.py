#!/usr/bin/python
#-*-coding:utf-8-*-

import re
import xlrd
import numpy as np
import pandas as pd
import unicodedata as ud
from difflib import SequenceMatcher
import sys
import codecs

# ENCODING = sys.stdin.encoding
ENCODING = "utf-8"

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
		res = res.append(pd.read_csv(template_filename % i),ignore_index = True)
	return res
		
def get_colegios_db():
	"""
	Devuelve un DataFrame con columnas [Nombre,Tipo-de-Gestión]
	"""
	
	book = xlrd.open_workbook("Mae actualizado 2015-08-31_Envios.xls")
	sheet1,sheet2 = book.sheets()
	
	sheet1_colegios = [i.value for i in sheet1.col_slice(2)[10:]]
	sheet1_gestion = [i.value for i in sheet1.col_slice(3)[10:]]
	sheet1_prov = [i.value for i in sheet1.col_slice(0)[10:]]
	sheet1_loc	= [i.value for i in sheet1.col_slice(10)[10:]]
	
	sheet2_colegios = [i.value for i in sheet2.col_slice(2)[10:]]
	sheet2_gestion  = [i.value for i in sheet2.col_slice(3)[10:]]
	sheet2_prov  = [i.value for i in sheet2.col_slice(0)[10:]]
	sheet2_loc  = [i.value for i in sheet2.col_slice(10)[10:]]
	
	#uniendo opciones las escuelas con ofertas activas e inactivas
	colegios = sheet1_colegios + sheet2_colegios
	gestion  = sheet1_gestion + sheet2_gestion
	provincias = sheet1_prov + sheet2_prov
	localidad = sheet1_loc + sheet2_loc
	
	
	df = pd.DataFrame({'Colegio':np.array(colegios),
					   'Sector':np.array(gestion),
					   'Provincia':np.array(provincias),
					   'Localidad':np.array(localidad)})
	return df



def remove_accents(s):
	return ''.join((c for c in ud.normalize('NFD', s) if ud.category(c) != 'Mn'))

# def normalize(hname):
	# """
		# Split in words, turn to lowercase,
		# remove accents, 
	# """
	# hname = remove_accents(hname).replace('-',' ')
	# hname.replace('&', ' ')
	# tokens = [word.strip(" ,.:;!|&-_()[]<>{}/\"'").lower()
			# for word in hname.split()]
	# return ' '.join(tokens)
	
def normalize(hname):
	return remove_accents(hname).lower()
	
def string_sim(hname1, hname2):
	"""
		Normalize both names
		and obtain string similarity
	"""
	seq = SequenceMatcher(a=normalize(hname1), b=normalize(hname2))
	return seq.ratio()

if __name__ == '__main__':
	colegios_oma = get_colegios_oma()	
	colegios_db = get_colegios_db()	
	
	singles_oma = colegios_oma.drop_duplicates(subset=['Colegio','Provincia','Localidad'])
	singles_oma = singles_oma.loc[:,['Colegio','Provincia','Localidad']]
	
	singles_db = colegios_db.drop_duplicates(subset=['Colegio','Provincia','Localidad'])
	singles_db = singles_db.loc[:,['Colegio','Provincia','Localidad','Sector']]
	
	result = pd.DataFrame({'Colegio':[],
					  	   'Provincia':[],
						   'Localidad':[],
						   'Sector':[],
						   })
	
	dmatches = 0
	for i,esc_i,prov_i,loc_i in singles_oma.itertuples():
		provs_j = singles_db[singles_db['Provincia'] == prov_i]
		# print(i)
		for j,esc_j,prov_j,loc_j,sect_j in provs_j.itertuples():
			# print(i,j,dmatches)
			try: 
				if normalize(esc_i) == normalize(esc_j):
					result = result.append(pd.DataFrame({'Colegio':[esc_j],
														 'Provincia':[prov_j],
														 'Localidad':[loc_j],
														 'Sector':[sect_j],
														}),ignore_index=True)
					# result.append(singles_db.iloc[j],ignore_index=True)
					singles_db.drop(j,inplace=True)
					singles_oma.drop(i,inplace=True)
					dmatches += 1
					break
			except TypeError:
				pass
				# print(esc_i,esc_j)
	# print("%d direct matches found" % dmatches)
	print(result)		
	print("End for now...")	
	
	#----------------------------------------------------------------------------
	# # 1. fetch all unmatched Expedia hotels
	# with MySQLdb.connect(**DB_CONNECTION) as conn:
		# conn.execute("""SELECT expediaID, lat, lon, hotelName
						# FROM tbl_hotelsExpedia WHERE bookingID IS NULL""")
		# expediahotels = {expediaID: {'location': (lat, lon), 'name': name}\
							# for expediaID, lat, lon, name in conn.fetchall()}

	# # 2. fetch all unmatched Booking.com hotels
	# with MySQLdb.connect(**DB_CONNECTION) as conn:
		# conn.execute("""SELECT hotelID, lat, lon, hotelName
						# FROM tbl_hotelPrices""")
		# bookinghotels = {hotelID: {'location': (lat, lon), 'name': name}\
							# for hotelID, lat, lon, name in conn.fetchall()}

		# conn.execute("""SELECT bookingID FROM tbl_hotelsExpedia""")
		# matched_ids = [res[0] for res in conn.fetchall()]
		# bookinghotels = {hid: v for hid, v in bookinghotels.items() if not hid in matched_ids}

	# # 3. Direct match hotels with equal normalized names
	# dmatches = 0
	# exp_ids = expediahotels.keys()
	# for exp_id in exp_ids:
		# bkg_ids = bookinghotels.keys()
		# for bkg_id in bkg_ids:
			# expname = expediahotels[exp_id]['name']
			# bkgname = bookinghotels[bkg_id]['name']
			# if normalize(expname) == normalize(bkgname):
				# with MySQLdb.connect(**DB_CONNECTION) as conn:
					# conn.execute("""UPDATE tbl_hotelsExpedia SET bookingID=%s
								# WHERE expediaID=%s""", (bkg_id, exp_id))
					# del expediahotels[exp_id]
					# del bookinghotels[bkg_id]
					# dmatches += 1
					# break
	# print "%d direct matches found" % dmatches

	# # 4. create pairwise similarities matrix for the remaining hotels
	# print "%d Expedia left to match with %d Booking hotels" % (len(expediahotels), len(bookinghotels))
	# print "combined geo-name similarity with user confirmation will be used"

	# print "Building similarity matrix..."
	# sims = np.zeros((len(expediahotels), len(bookinghotels)))
	# exp_hotelitems = expediahotels.items()
	# bkg_hotelitems = bookinghotels.items()
	# progress = 0
	# for i, (exp_id, exp_data) in enumerate(exp_hotelitems):
		# for j, (bkg_id, bkg_data) in enumerate(bkg_hotelitems):
			# sims[i, j] = get_geoname_sim(exp_data, bkg_data)
		# new_progress = i * 100.0 / len(expediahotels)
		# if new_progress > progress + 5:
			# print "%02.1f %%" % progress
			# progress = new_progress

	# # 5. Match the remaning by geoname similarity in a greedy fashion
	# #    asking the user for confirmation
	# matches = 0
	# while matches <= min(sims.shape):
		# i, j = np.unravel_index(sims.argmax(axis=None), sims.shape)
		# exp_id, exp_data = exp_hotelitems[i]
		# bkg_id, bkg_data = bkg_hotelitems[j]
		# expname = exp_data['name'].encode(ENCODING)
		# bkgname = bkg_data['name'].encode(ENCODING)

		# answer = None
		# while not answer in ["y", "n"]:
			# answer = raw_input("Match %s (Expedia) to %s (Booking)? [y/n]" %
				# (expname, bkgname))

		# if answer == "y":
			# print "%d unmatched hotels left" % (min(sims.shape) - matches)
			# with MySQLdb.connect(**DB_CONNECTION) as conn:
				# conn.execute("""UPDATE tbl_hotelsExpedia SET bookingID=%s
								# WHERE expediaID=%s""", (bkg_id, exp_id))
			# matches += 1

		# # clear i row and j column
		# sims[i,:] = 0.0
		# sims[:,j] = 0.0
