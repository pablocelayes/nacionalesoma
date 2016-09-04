# -*- coding: utf-8 -*-

import matplotlib.patches as mpatches
import matplotlib.pyplot as plt

from retrieve import get_province_particip, provincias

def paint_overlapp_graphics(title,iter1,iter2,output_file,
							color1,color2,
							label1,label2):
	"""
	Crea un gráfico de barras solapado(dos gráficos en uno ;)). 
	"""
	fig = plt.figure()
	cat_patch1 = mpatches.Patch(color=color1, label=label1)
	cat_patch2 = mpatches.Patch(color="#B79191", label=label2)
	# years = [str(i) for i in range(1998,2015)]
	years = range(1998,2015)
	plt.barh(years,iter1,color=color1,alpha=0.5,label=label1)
	plt.barh(years,iter2,color=color2,alpha=0.5,label=label2)
	plt.title(title)
	plt.xlabel('Porciento respecto a la población escolar')
	plt.legend(handles=[cat_patch1, cat_patch2])
	plt.savefig(output_file)
	# plt.show()
	plt.close(fig)

def serie_to_list(serie):
	res_tmp = []
	for i,j in serie.items():
		res_tmp += [j.tolist()[0]]
	return res_tmp		

if __name__ == "__main__":
	# provincia = "Chubut"
	for prov in provincias:
		df = get_province_particip(prov)
		it1 = serie_to_list(df["Índice_Clasificados"])
		it2 = serie_to_list(df["Índice_Aprobados"])
	
		paint_overlapp_graphics("Progresión provincia de "+prov,it1,it2,
						"./app/static/img/plots/poblacion_escolar/%s-completo.svg" % prov.replace(" ","_"),
						"#E0B6B6","#7E4747","Clasificados",
						"Aprobados")
