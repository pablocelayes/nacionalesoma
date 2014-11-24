#!/usr/bin/env python
# -*- coding: utf-8 -*-
from lxml import etree
import csv
import sys

def limpiar(campo):
    campo = campo.replace('\n', '')
    campo = campo.replace('"', '')
    campo = ' '.join([p for p in campo.split(' ') if p])
    return campo

def arreglar_fila(fila):
    nivel, apellido, nombres, localidad, provincia = fila
    fila = [limpiar(campo) for campo in fila]
    if localidad == "Capital Federal" or provincia == "Capital Federal":
        fila[-1] = "Ciudad Autónoma de Buenos Aires"
    elif provincia == "Rosario":
        fila[-1] = "Santa Fe"
    elif fila[-1] == "":
        # import ipdb; ipdb.set_trace()
        print("Arreglar localidad: ", fila[-2])

    return fila                   


def procesar_html(filename):
    htmlparser = etree.HTMLParser()
    tree = etree.parse(filename, htmlparser)
    rootnode = tree.getroot()
    basefilename = filename.split('.')[0]
    
    with open('csvs/' + basefilename + '.csv', 'w', newline='') as csvfile:
        writer = csv.writer(csvfile)
        header = 'Nivel Apellido Nombres Localidad Provincia'.split()
        writer.writerow(header)

        año = int(basefilename[-4:])

        if año == 1998:
            dataniveles = rootnode.xpath('//pre')
            for i, data in enumerate(dataniveles):
                filas = data.text.split('\n')
                filas = [f for f in filas if f] #  removemos filas vacías
                filas = filas[1:] # removemos encabezado

                for f in filas:
                    if i == 0:
                        fila = [str(i + 1)] + [s.strip() for s in [f[:20], f[20:44], f[44:68], f[68:]]]
                    elif i == 1:
                        fila = [str(i + 1)] + [s.strip() for s in [f[:20], f[20:42], f[42:68], f[68:]]]
                    else:
                        fila = [str(i + 1)] + [s.strip() for s in [f[:20], f[20:39], f[39:65], f[65:]]]
                    writer.writerow(arreglar_fila(fila))
        elif año < 2002:
            dataniveles = rootnode.xpath('//ul')
            if not dataniveles:
                dataniveles = rootnode.xpath('//ol')

            for i, data in enumerate(dataniveles):
                filas = data.xpath('./li/font')
                filas = [f.text for f in filas]
                for f in filas:
                    parts = [p.strip() for p in f.split('-')]
                    ayn = parts[0]
                    localidad = parts[1] if len(parts) > 1 else ""
                    provincia = parts[2] if len(parts) > 2 else ""
                    apellido, nombres = [p.strip() for p in ayn.split(",")]
                    fila = (str(i+1), apellido, nombres, localidad, provincia)
                    writer.writerow(arreglar_fila(fila))
        else:
            dataniveles = rootnode.xpath('//table')[:3]
            for i, data in enumerate(dataniveles):
                filas = data.xpath('.//tr')
                filas = [[n.text for n in f.xpath('./td//p')] for f in filas]
                filas = [f for f in filas if f]
                fila = filas[1:]
                for f in filas:
                    if len(f) == 3 and f[2] in ['Buenos Aires - Ciudad Autónoma', 'Capital Federal']:
                        f[2] = 'Buenos Aires'
                        f.append('Ciudad Autónoma de Buenos Aires')
                    fila = [str(i+1)] + f
                    writer.writerow(arreglar_fila(fila))


if __name__ == '__main__':
    if len(sys.argv) > 1:
        procesar_html(sys.argv[1])
    else:
        for año in range(1998, 2015):
            procesar_html('clasificados%d.html' % año)
