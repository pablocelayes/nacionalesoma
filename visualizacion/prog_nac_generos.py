# -*- coding: utf-8 -*-

import pandas as pd
import numpy as np
import matplotlib.patches as mpatches
import matplotlib.pyplot as plt

files = ["../data/aprobados/csvs/aprobados_por_género.csv",
		 "../data/clasificados/csvs/clasificados_por_género.csv",
		 "../data/premiados/csvs/premiados_por_género.csv"]
		 
files = map(pd.read_csv,files)

for cat,file in zip(["aprobados","clasificados","premiados"],files):
	fig = plt.figure()
	plt.bar(file['Año'],file['F'],color='#ff6496')
	plt.title('Progresión femenina nacional de '+cat+'.')
	plt.ylabel('Cantidad')
	plt.savefig("./plots/genero/F/progresion_anual_"+cat+".svg")
	# plt.show()
	plt.close(fig)
