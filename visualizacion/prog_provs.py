# -*- coding: utf-8 -*-

import pandas as pd
import numpy as np
import matplotlib.patches as mpatches
import matplotlib.pyplot as plt

aprobados_patch = mpatches.Patch(color='#3F7F7F', label='Aprobados')

files = ["../data/aprobados/provcounts.csv",
		 "../data/clasificados/provcounts.csv",]
	 
		 
aprobados_prov,clasificados_prov = map(pd.read_csv,files)

x = np.arange(1998,2015)


provincias = set(aprobados_prov['Provincia'])

for i in provincias:
	aprobados_rows = aprobados_prov[aprobados_prov['Provincia'] == i]
	clasificados_rows = clasificados_prov[clasificados_prov['Provincia'] == i]
	fig = plt.figure()
	print(i)
	# #3F7F7F
	plt.bar(aprobados_rows['Año'],aprobados_rows['Cantidad'],color='blue',alpha=0.5)
	graph2 = plt.bar(clasificados_rows['Año'],clasificados_rows['Cantidad'],label='Clasificados',color='green',alpha=0.5)
	plt.title('Progresión provincia de '+i)
	plt.ylabel('Cantidad')
	plt.legend(handles=[aprobados_patch, graph2])
	plt.savefig("./plots/"+i+"-completo.svg")
	# plt.show()
	plt.close(fig)
