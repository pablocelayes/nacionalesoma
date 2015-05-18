# -*- coding: utf-8 -*-

import pandas as pd
# import matplotlib.patches as mpatches
import matplotlib.pyplot as plt



data = pd.read_csv("./clasificados/provcounts.csv")

provincias = set(data['Provincia'])
for i in provincias:
	provincia_rows = data[data['Provincia'] == i]		  
	fig = plt.figure()
	# fig.suptitle('Progresión de '+i, fontsize=22)
	plt.bar(provincia_rows['Año'],provincia_rows['Cantidad'],color='green')	
	plt.savefig("./plots/"+i+".svg")
	plt.close(fig)

# Pendientes: 
# 1- label con el nombre de la provincia
# 2- Normalización eje y
# 3- Ciclo para generar todas las imágenes
# 4- Integrar con D3JS 
