# -*- coding: utf-8 -*-

import pandas as pd
import numpy as np
import matplotlib.patches as mpatches
import matplotlib.pyplot as plt

#-----------------------------------------------
#Vamos viendo como salen los svg's			 	|		

# def prog_part_aprob_clasif(prov):
	# """
	# Genera un gráfico de 
	# barras en svg con los porcientos de los
	# clasificados/aprobados de los años 
	# respecto a su población escolar.
	# """
	# df = data[year]
	# df = 
	# clasif_percent = df['Clasificados']/df['Población']
	# aprob_percent  = df['Aprobados']/df['Población']
	
	# fig = plt.figure()
	# # plt.bar(file.groupby('Año').size(),file['F'],color='#ff6496')
	# plt.bar(file['Año'],file['F'],color='#00ffff')
	# plt.title('Participación'+year+'.')
	# plt.ylabel('%')
	# plt.savefig("part%d.svg" % year)
	# # plt.show()
	# plt.close(fig)	
	
#												|	
#-----------------------------------------------

aprobados_patch = mpatches.Patch(color='#3F7F7F', label='Aprobados')

files = ["../../data/aprobados/provcounts.csv",
		 "../../data/clasificados/provcounts.csv",]
	 
		 
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
	plt.savefig("../app/static/img/plots/"+i.replace(" ","_")+"-completo.svg")
	# plt.show()
	plt.close(fig)
