#!/usr/bin/env python
# -*- coding: utf-8 -*-
from lxml import etree
import csv
import sys
import lxml.html as lh

#Capitalizar Strings Compuestos
def capitalize_cstrings(provincia):
    lista = [s.capitalize() for s in provincia.split(" ")]
    return " ".join(lista)

def limpiar(campo):
    campo = campo.replace('\n', '')
    campo = campo.replace('"', '')
    campo = ' '.join([p for p in campo.split(' ') if p])
    return campo

def arreglar_fila(fila):
    fila = [limpiar(campo) for campo in fila]
    nivel, apellido, nombres, localidad, provincia = fila
    renombresprovincias = {"Cordoba":"Córdoba"
    , "Tucuman":"Tucumán",
    "Rio Negro":"Río Negro",
    "Rio Gallegos":"Río Gallegos",
    "":"Ciudad Autónoma de Buenos Aires"}
    if provincia in renombresprovincias:
        fila[-1] = renombresprovincias[provincia]

    elif fila[-1] == "":
        # import ipdb; ipdb.set_trace()
        print("Arreglar localidad: ", fila[-2])
    return fila
                    
def process_html(year,category,tables_scheme,encoding,f):
    filename_input = '%s%d.html' % (category,year)
    filename_output = 'csvs/%s%d.csv'%(category,year)
    with open(filename_output, 'w', newline='') as csvfile:
        writer = csv.writer(csvfile)
        header = tables_scheme.split()
        writer.writerow(header)
        content = open(filename_input, 'r', encoding=encoding).read()
        tree = lh.fromstring(content)
        rootnode = tree.getroottree()
        f(writer,rootnode)

def f_2015(writer,rootnode):
    xpath_tables = '//table[%d]'
    xpath_rows = './/tr'
    tables = [rootnode.xpath(xpath_tables % i) for i in range(1,4)]
    rows_per_table = [[n for n in f[0].xpath(xpath_rows)] for f in tables]
    final_rows = [[[k.text_content() for k in j.xpath('.//td')] for j in i] for i in rows_per_table]
    for i in range(3):
        for j in final_rows[i][1:]:
            row = [i+1]+j
            writer.writerow(row)                    

if __name__ == '__main__':
    process_html(2015,'aprobados','Nivel Apellido Colegio Escuela Localidad Provincia','iso-8859-1',f_2015)
