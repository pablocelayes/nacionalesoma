#!/usr/bin/env python
# -*- coding: utf-8 -*-
 
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
 
N = 5
gcc_means = (35, 30, 28, 20, 15)
 
ind = np.arange(N)  # the x locations for the groups
width = 0.35       # the width of the bars
 
# Los distintos patrones disponibles
hatches = [ '/' , '\\' , '|' , '-' , '+' , 'x' , 'o' , 'O' , '.' ,'*' ]
 
plt.subplot(111)
rects1 = plt.bar(ind, gcc_means, width,
                    color='r',
                    hatch=hatches[8]
                    )
 
icc_means = (35, 25, 22, 15, 10)
rects2 = plt.bar(ind+width, icc_means, width,
                    color='y',
                    hatch=hatches[0]
                    )
 
# Informacion de la grafica en general
plt.ylabel('Time (s)')
plt.title('Execution time by cores and compilator')
plt.xticks(ind+width, ('2', '4', '8', '16', '32') )
 
plt.legend( (rects1[0], rects2[0]), ('gcc', 'icc') )
plt.axis(ymax = 40)
 
 
# Se colocan los valores encima de cada barra (opcional)
def autolabel(rects):
    # attach some text labels
    for rect in rects:
        height = rect.get_height()
        plt.text(rect.get_x()+rect.get_width()/2., 1.05*height, '%d'%int(height),
                ha='center', va='bottom')
 
autolabel(rects1)
autolabel(rects2)
# Se salva la grafica
# plt.savefig('graf.png')
# Se dibuja la grafica
plt.show()