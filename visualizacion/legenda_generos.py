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


#SVG:sucesión de rectángulos
#pendiente- probar con:

#~ <svg width="200px" height="200px" viewBox="0 0 200 200">
#~ <!-- red -->
#~ <line x1="10" y1="10" x2="50" y2="10"
#~ style="stroke: red; stroke-width: 5;" />
#~ <!-- light green -->
#~ <line x1="10" y1="20" x2="50" y2="20"
#~ style="stroke: #9f9; stroke-width: 5;" />
#~ <!-- light blue -->
#~ <line x1="10" y1="30" x2="50" y2="30"
#~ style="stroke: #9999ff; stroke-width: 5;" />
#~ <!-- medium orange -->
#~ <line x1="10" y1="40" x2="50" y2="40"
#~ style="stroke: rgb(255, 128, 64); stroke-width: 5;" />
#~ <!-- deep purple -->
#~ <line x1="10" y1="50" x2="50" y2="50"
#~ style="stroke: rgb(60%, 20%, 60%); stroke-width: 5;" />
#~ </svg>


#y por último hacer una función dado un número en un intervalo devuelva
#un color... y jugar con la cantidad de un género en el total... 



