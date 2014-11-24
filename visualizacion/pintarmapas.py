#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
    En base a un reporte por año y provincia
    de cantidad de estudiantes,

    genera un mapa coloreado para cada año
"""
import csv
import pandas as pd
from lxml import etree

MAPA_BASE = "Blank_Argentina_Map.svg"

COLORES = ["#F1EEF6", "#D4B9DA", "#C994C7", "#DF65B0", "#DD1C77", "#980043"]

PATH_STYLE = ";fill-opacity:1;stroke:#ffffff;stroke-width:1.40563393;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-opacity:1;stroke-dasharray:none"


PROV_CODES = {}

with open('provcodes.csv', 'r') as csvfile:
    csvreader = csv.reader(csvfile)
    for row in csvreader:
        PROV_CODES[row[0]] = row[1]

def generar_mapas(reporte):
    data = pd.read_csv(reporte, parse_dates=True)
    años = set(data.Año.values)
    for año in años:
        xmlparser = etree.XMLParser()
        tree = etree.parse(MAPA_BASE, xmlparser)
        root = tree.getroot()            
        paths = root.xpath('//svg:path', namespaces={'svg': "http://www.w3.org/2000/svg"})

        # traer datos año
        datos_año = data[data.Año==año][["Provincia","Cantidad"]]
        datos_año = datos_año.to_dict()
        temp_dict = {}
        for provid, provincia in datos_año["Provincia"].items():
            temp_dict[provincia] = datos_año["Cantidad"][provid]
        datos_año = temp_dict

        cantidades = sorted(datos_año.values())
        umbrales = []
        for i in range(5):
            n = (len(cantidades) // 6) * (i + 1)
            umbrales.append((cantidades[n] + cantidades[n + 1]) / 2)
        # generar sextiles
        def sextil(valor):
            i = 0
            while i < 5 and valor > umbrales[i]:
                i += 1
            return i

        for provincia, valor in datos_año.items():
            pathid = PROV_CODES[provincia]
            style = 'fill:' + COLORES[sextil(valor)] + PATH_STYLE
            path = [p for p in paths if p.get('id') == pathid][0]
            path.set('style', style)

        with open("mapa%d.svg" % año, 'wb') as outfile:
            content = etree.tostring(root, pretty_print=True)
            outfile.write(content)

if __name__ == '__main__':
    generar_mapas( '../data/clasificados/provcounts.csv')