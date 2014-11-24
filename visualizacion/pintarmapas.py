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
import math

MAPA_BASE = "Blank_Argentina_Map.svg"

COLORES = ["#edf8e9", "#c7e9c0", "#a1d99b", "#74c476", "#41ab5d", "#238b45", "#005a32"]

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
        for provincia in PROV_CODES:
            if not provincia in datos_año:
                datos_año[provincia] = 0

        cantidades = datos_año.values()
        cantidades = [math.log(c + 1) for c in cantidades]
        max_value = max(cantidades)
        min_value = min(cantidades)

        def color(valor):
            i = math.floor((len(COLORES)-1) * (math.log(valor + 1) - min_value) / (max_value - min_value))
            return COLORES[i]

        for provincia, valor in datos_año.items():
            pathid = PROV_CODES[provincia]
            # TODO: color palido sólo para el 0
            style = 'fill:' + color(valor) + PATH_STYLE
            path = [p for p in paths if p.get('id') == pathid][0]
            path.set('style', style)

        with open("mapa%d.svg" % año, 'wb') as outfile:
            content = etree.tostring(root, pretty_print=True)
            outfile.write(content)

if __name__ == '__main__':
    generar_mapas( '../data/clasificados/provcounts.csv')