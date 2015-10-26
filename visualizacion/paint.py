# -*- coding: utf-8 -*-

import matplotlib.patches as mpatches
import matplotlib.pyplot as plt

from retrieve import get_province_particip

def paint_overlapp_graphics(title,iter1,iter2,output_file,
							color1,color2,
							label1,label2):
	"""
	Crea un gráfico de barras solapado. 
	"""
	fig = plt.figure()
	cat_patch = mpatches.Patch(color=color1, label=label1)
	# years = [str(i) for i in range(1998,2015)]
	years = range(1998,2015)
	plt.bar(years,iter1,color=color1,alpha=0.5,label=label1)
	graph2 = plt.bar(years,iter2,color=color2,alpha=0.5,label=label2)
	plt.title(title)
	plt.ylabel('Porciento')
	plt.legend(handles=[cat_patch, graph2])
	plt.savefig(output_file)
	# plt.show()
	plt.close(fig)

def serie_to_list(serie):
	res_tmp = []
	for i,j in serie.items():
		res_tmp += [j.tolist()[0]]
	return res_tmp		

if __name__ == "__main__":
	provincia = "Chubut"
	cat = "clasificados"
	df = get_province_particip(provincia)
	it1 = serie_to_list(df["Índice_Clasificados"])
	it2 = serie_to_list(df["Índice_Aprobados"])
	
	paint_overlapp_graphics(provincia,it1,it2,"test.svg","#00FFFF",
							"#0000FF","Clasificados/Población","Aprobados/Población")