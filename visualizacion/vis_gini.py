# -*- coding: utf-8 -*-
import csv
# from collections import OrderedDict

import numpy as np
import pandas as pd

from bokeh.plotting import *
# from bokeh.palettes import brewer

init_year  = 1998
end_year   = 2014

N = end_year - init_year + 1

files = ["gini_aprobados.csv","gini_clasificados.csv"]
aprobados,clasificados = map(pd.read_csv,files)

output_file("resultados.html", 
			title="Análisis de los resultados de la OMA en los años {0}-{1}".format(init_year,end_year).decode('utf-8'))

p = figure(plot_width=300, plot_height=300)
p.line(aprobados['Año'],aprobados['Gini'], size=12, color="red", alpha=0.5)
p.line(clasificados['Año'],clasificados['Gini'], size=12, color="blue", alpha=0.5)
p.title = "Evolución índice de Gini en aprobados y clasificados.".decode('utf-8')
# p.grid.grid_line_alpha=0.3
p.xaxis.axis_label = 'Años'.decode('utf-8')
p.yaxis.axis_label = 'Gini'


show(p)