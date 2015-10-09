# -*- coding: utf-8 -*-

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

files = ["../data/aprobados/csvs/aprobados_por_provincia_y_genero.csv",
		 "../data/clasificados/csvs/clasificados_por_provincia_y_genero.csv",
		 "../data/premiados/csvs/premiados_por_provincia_y_genero.csv"]
		 
files = map(pd.read_csv,files)
años = np.array(range(1998,2015))

for cat,file in zip(["aprobados","clasificados","premiados"],files):
	for prov in set(file['Provincia']):
		fig = plt.figure()
		rows_prov = file[file['Provincia'] == prov]
		if rows_prov[rows_prov['F'] > 0].empty != True:
			plt.bar(rows_prov["Año"],rows_prov["F"],color='#ff6496',alpha=0.9)
			plt.title('Progresión femenina anual '+cat+' de '+prov+'.')
			plt.ylabel('Cantidad')
			plt.savefig("./app/static/img/plots/genero/F/{0}/progresion_anual_{1}.svg".format(cat,prov))
			# plt.show()
			plt.close(fig)
		else:
			print(rows_prov)
			print("-----")