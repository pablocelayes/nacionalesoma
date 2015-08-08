#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Para la visualización de los géneros
"""

import pandas as pd
from lxml import etree
from math import floor


gris = "#dcdcdc" 			 #valor neutro rgb(220,220,220)
celeste = "rgb(100,150,255)" #todos masculinos = "#6496ff"
rosa = "rgb(255,100,150)"	 #todos femeninos = "#ff6496"

#colores desde el más rosa hasta el más celeste
colores = ["#ff6496","#ff7da7","#ff96b8","#ffb0c9","#ffc9db",
		   "#6496ff","#7da7ff","#96b8ff","#b0c9ff","#c9dbff"]


def color_picker(f_count,m_count):
	"""
	f_count: cantidad del género femenino
	m_count: cantidad del género masculino
	
	Devuelve un color de acuerdo al porciento
	que representa el sexo femenino del total 
	"""
	if f_count == m_count:
		return gris
	like-percent = 10*(f_count//m_count+f_count)
	return colores[like_percent]
	

	
	



