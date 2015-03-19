# -*- coding: utf-8 -*-

import numpy as np
import pandas as pd

from bokeh.plotting import *
from bokeh.models import HoverTool
from bokeh.charts import Donut

from collections import OrderedDict

files = ["../data/aprobados/provcounts.csv",
		 "../data/clasificados/provcounts.csv",]

init_year  = 1998
end_year   = 2014

N = end_year - init_year + 1		 

TOOLS = "pan,wheel_zoom,box_zoom,reset"		 
		 
aprobados_prov,clasificados_prov = map(pd.read_csv,files)
# ------------------------------------------------------------
# year_1999 = aprobados_prov[aprobados_prov['Año'] == 1999]
# provincias = aprobados_prov['Provincia'].drop_duplicates()
# total = aprobados_prov['Año'].groupby('Provincia').sum()


#getting values 
def get_data(year,label="Aprobados"):
	if label == "Aprobados":
		filas_year = aprobados_prov[aprobados_prov['Año'] == year]
	else:
		filas_year = clasificados_prov[clasificados_prov['Año'] == year]
	filas_year_provs = filas_year['Provincia'].drop_duplicates()
	filas_year_porciento = (filas_year['Cantidad']/filas_year['Cantidad'].sum())*100
	
	return filas_year_provs,filas_year_porciento

def vis_prov(year,provincias,porcientos,label = "Aprobados"):
	title_val = "Resultados de la OMA {0}: {1}".format(year,label)
	# donut = Donut(porcientos, provincias, filename="donut.html")
	provincias = provincias.tolist()
	porcientos = porcientos.tolist()
	donut = Donut(porcientos, provincias)
	# show(donut)
	
if __name__ == '__main__':
	for i in range(init_year,end_year+1):
		#aprobados
		provincias,porcientos = get_data(i)
		output_file("vis_{0}_{1}.html".format(i,"Aprobados"))
		vis_prov(i,provincias,porcientos)		
		#clasificados
		provincias,porcientos = get_data(i,label = "Clasificados")
		output_file("vis_{0}_{1}.html".format(i,"Clasificados"))
		vis_prov(i,provincias,porcientos,label = "Clasificados")
