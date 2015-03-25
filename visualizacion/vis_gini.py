# -*- coding: utf-8 -*-

import numpy as np
import pandas as pd

from bokeh.plotting import *
from bokeh.models import HoverTool
from bokeh.resources import CDN
from bokeh.embed import components

from collections import OrderedDict

init_year  = 1998
end_year   = 2014

N = end_year - init_year + 1

files = ["../data/aprobados/gini_aprobados.csv",
		 "../data/clasificados/gini_clasificados.csv",]
		 
aprobados,clasificados = map(pd.read_csv,files)

title_val = "Análisis de los resultados de la OMA en los años {0}-{1}".format(init_year,end_year).decode('utf-8')
output_file("gini.html", title=title_val)


TOOLS="pan,wheel_zoom,box_zoom,reset,hover"
	
			
p = figure(plot_width=800, plot_height=600, tools=TOOLS)


p.circle(clasificados['Año'], clasificados['Gini'], size = 10, fill_alpha=0.6, line_color="blue") 
p.circle(aprobados['Año'], aprobados['Gini'], size = 10, fill_alpha=0.6, line_color="red") 

p.line(clasificados['Año'],clasificados['Gini'], size=12, color="blue", alpha=0.5,legend='Clasificados')
p.line(aprobados['Año'],aprobados['Gini'], size=12, color="red", alpha=0.5,legend='Aprobados')
p.title = "Evolución índice de Gini en aprobados y clasificados.".decode('utf-8')
p.xaxis.axis_label = 'Años'.decode('utf-8')
p.yaxis.axis_label = 'Gini'

hover = p.select(dict(type=HoverTool))

hover.tooltips = OrderedDict([
    ("Año", "@x"),
    ("Gini", "@y"),
])

# script, div = components(p, CDN)

show(p)