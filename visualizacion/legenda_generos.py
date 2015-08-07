"""
Generando leyenda para la visualización de los géneros
"""

gris = "rgb(220,220,220)" 	#valor central
celeste = "rgb(100,150,255)" #todos masculinos
rosa = "rgb(255,100,150)"	#todos femeninos

#ejes

red = 0
green = 0
blue = 0

template = "rgb(%d,%d,%d)"

#IDEA: deslizar el 'saturation' del Gimp y tomar los valores convenientes de la conversión
#a RGB, estos son los colores que encontré por ahora
colores_ rosa = [rosa,"#ff7da7","#ff96b8","#ffb0c9","#ffc9db"]
colores_ celeste = [celeste,"#7da7ff","#96b8ff","#b0c9ff","#c9dbff"]

#TODO: hacer una función dado un número en un intervalo devuelva
#un color... y jugar con la cantidad de un género en el total... 



