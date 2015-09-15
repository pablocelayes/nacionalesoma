#!/usr/bin/python
#-*-coding:utf-8-*-

import math
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
	(pues los colegios de aprobados y premiados salen de ahi ;))
	"""
	template_filename = "./clasificados/csvs/clasificados%d.csv"
	res = []
	for i in range(2008,2015):
		df = pd.read_csv(template_filename % i)
		res = res + df['Colegio'].tolist()
	# return pd.DataFrame({'Colegio':set(res)})
	distinct_colleges = pd.groupby(pd.DataFrame({'Colegio':res}),'Colegio')
	colegios_oma = distinct_colleges.Colegio.all().tolist()
	return pd.DataFrame({'Colegio':colegios_oma})
		
def get_colegios_db():
	"""
	Devuelve un DataFrame con columnas [Nombre,Tipo-de-Gestión]
	"""
	
	book = xlrd.open_workbook("Mae actualizado 2015-08-31_Envios.xls")
	sheet1,sheet2 = book.sheets()
	
	sheet1_colegios = [i.value for i in sheet1.col_slice(2)[10:]]
	sheet1_gestion = [i.value for i in sheet1.col_slice(3)[10:]]
	
	sheet2_colegios = [i.value for i in sheet2.col_slice(2)[10:]]
	sheet2_gestion  = [i.value for i in sheet2.col_slice(3)[10:]]
	
	#uniendo opciones las escuelas con ofertas activas e inactivas
	colegios = sheet1_colegios + sheet2_colegios
	gestion  = sheet1_gestion + sheet2_gestion 
	
	df = pd.DataFrame({'Colegio':np.array(colegios),
					'Sector':np.array(gestion)})
	
	df_distinct_colleges = pd.groupby(df,'Colegio')

	colegios_df = df_distinct_colleges.Colegio.all().tolist()		 	
	sectores_df = df_distinct_colleges.Sector.all().tolist() 		
	
	return pd.DataFrame({'Colegio':np.array(colegios_df),
					'Sector':np.array(sectores_df)})

# def dist_to_sim(d):
	# """
		# Maps a distance in [0, ∞) interval
		# to a similarity score in (0, 1]

		# We use an exponential with base b such that
		
		# d = 0 mts -> sim = 1
		# d = 50 mts -> sim = 0.5
	# """
	# b = 0.5 ** (1.0/50)
	# return b ** d

# def get_geo_dist(p1, p2):
	# """
		# Geographic distance using Haversine formula
	# """
	# lat1, lng1 = p1
	# lat2, lng2 = p2
	# r = 6371000  # Earth radius in meters
	# phi1 = math.radians(lat1)
	# phi2 = math.radians(lat2)
	# lambda1 = math.radians(lng1)
	# lambda2 = math.radians(lng2)
	# haversin = lambda theta: (1 - math.cos(theta)) / 2.0
	# h = haversin(phi2 - phi1) + math.cos(phi1) * math.cos(phi2) * \
		# haversin(lambda2 - lambda1)
	# c = 2 * math.atan2(math.sqrt(h), math.sqrt(1 - h))
	# return r * c

# def remove_accents(s):
	# return ''.join((c for c in ud.normalize('NFD', s) if ud.category(c) != 'Mn'))

# def normalize(hname):
	# """
		# Split in words, turn to lowercase,
		# remove accents, remove word "hotel",
		# remove city
		# return word list
	# """
	# hname = remove_accents(hname).replace('-',' ')
	# hname.replace('&', ' ')
	# tokens = [word.strip(" ,.:;!|&-_()[]<>{}/\"'").lower()
			# for word in hname.split()]
	# tokens = [t for t in tokens if not t in ['hotel', 'hotels', 'hostel']]
	# return ''.join(tokens)

# def get_name_sim(hname1, hname2):
	# """
		# Normalize both names
		# and obtain string similarity
	# """
	# seq = SequenceMatcher(a=normalize(hname1), b=normalize(hname2))
	# return seq.ratio()


# def get_geoname_sim(hotel1, hotel2):
	# """
		# Combined location and name similarity
	# """
	# name_similarity = get_name_sim(normalize(hotel1['name']), normalize(hotel2['name']))
	# location_similarity = dist_to_sim(get_geo_dist(hotel1['location'], hotel2['location']))
	# return name_similarity * location_similarity

if __name__ == '__main__':
	print(get_colegios_oma())	
	
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
