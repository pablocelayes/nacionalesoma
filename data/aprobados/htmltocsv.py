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


def procesar_html(filename):
    htmlparser = etree.HTMLParser()
    tree = etree.parse(filename, htmlparser)
    rootnode = tree.getroot()
    basefilename = filename.split('.')[0]
    
    with open('csvs/' + basefilename + '.csv', 'w') as csvfile:
        writer = csv.writer(csvfile)
        header = 'Nivel Apellido Nombres Localidad Provincia'.split()
        writer.writerow(header)

        año = int(basefilename[-4:])

        if año <= 1999:
            dataniveles = rootnode.xpath('//pre')
            for i, data in enumerate(dataniveles):
                filas = data.text.split('\n')
                filas = [f for f in filas if f] #  removemos filas vacías
                if año == 1997:
                    filas = filas[2:] # removemos encabezado
                if len(filas) > 3:
                    if año == 1997:
                        for f in filas:
                            if i == 0:
                                fila_aux = [str(i + 1)] + [s.strip() for s in [f[:18], f[18:41], "Localidad Desconocida", f[51:]]]
                                fila = [capitalize_cstrings(elem) for elem in fila_aux]
                            elif i == 1:
                                fila_aux = [str(i + 1)] + [s.strip() for s in [f[:18], f[18:41], "Localidad Desconocida", f[51:]]]
                                fila = [capitalize_cstrings(elem) for elem in fila_aux]
                            else:
                                fila_aux = [str(i + 1)] + [s.strip() for s in [f[:18], f[18:41], "Localidad Desconocida", f[51:]]]
                                fila = [capitalize_cstrings(elem) for elem in fila_aux]
                            writer.writerow(arreglar_fila(fila))
                    elif año == 1998:
                        for f in filas:
                            if i == 0:
                                fila_aux = [str(i + 1)] + [s.strip() for s in [f[:21], f[21:45], f[45:71], f[71:]]]
                                fila = [capitalize_cstrings(elem) for elem in fila_aux]
                            elif i == 1:
                                fila_aux = [str(i + 1)] + [s.strip() for s in [f[:21], f[21:45], f[45:71], f[71:]]]
                                fila = [capitalize_cstrings(elem) for elem in fila_aux]
                            else:
                                fila_aux = [str(i + 1)] + [s.strip() for s in [f[:21], f[21:45], f[45:71], f[71:]]]
                                fila = [capitalize_cstrings(elem) for elem in fila_aux]
                            writer.writerow(arreglar_fila(fila))   
                    elif año == 1999:
                        for f in filas:
                            if i == 0:
                                fila_aux = [str(i + 1)] + [s.strip() for s in [f[:22], f[22:42], f[42:68], f[68:]]]
                                fila = [capitalize_cstrings(elem) for elem in fila_aux]
                            elif i == 1:
                                fila_aux = [str(i + 1)] + [s.strip() for s in [f[:22], f[22:42], f[42:68], f[68:]]]
                                fila = [capitalize_cstrings(elem) for elem in fila_aux]
                            else:
                                fila_aux = [str(i + 1)] + [s.strip() for s in [f[:22], f[22:42], f[42:68], f[68:]]]
                                fila = [capitalize_cstrings(elem) for elem in fila_aux]
                            writer.writerow(arreglar_fila(fila))

"""

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
        elif año != 2004:
            content = open(filename, 'r', encoding='iso-8859-1').read()
            tree = lh.fromstring(content)
            rootnode = tree.getroottree()
            tables = rootnode.xpath('//table')
            if año >= 2005:
                dataniveles = [tables[i] for i in [1, 3, 5]]
            else:
                dataniveles = tables[:3]

            for i, data in enumerate(dataniveles):
                filas = data.xpath('.//tr')
                filas = [[n.text_content().strip() for n in f.xpath('./td')] for f in filas]
                filas = [f for f in filas if f]
                filas = filas[1:]
                for f in filas:
                    if len(f) == 3:
                        f.append("")
                    if f[2] in ['Buenos Aires - Ciudad Autónoma', 'Capital Federal', 'Ciudad Autónoma de Buenos Aires']:
                        f[2] = 'Buenos Aires'
                        f[3] = 'Ciudad Autónoma de Buenos Aires'
                    fila = [str(i+1)] + f
                    if len(fila) > 5: # Borrar escuela
                        if año < 2009:
                            del fila[-3] 
                        else:
                            fila = fila[:-1]

                    writer.writerow(arreglar_fila(fila))
        else:
            content = open(filename, 'r', encoding='iso-8859-1').read()
            tree = lh.fromstring(content)
            rootnode = tree.getroottree()
            filas = rootnode.xpath('.//tr')
            filas = [[n.text_content().strip() for n in f.xpath('./td')] for f in filas]
            filas = [f for f in filas if f]
            for f in filas[1:-2]:
                if len(f) == 3:
                    f.append("")
                if f[2] in ['Buenos Aires - Ciudad Autónoma', 'Capital Federal', 'Ciudad Autónoma de Buenos Aires']:
                    f[2] = 'Buenos Aires'
                    f[3] = 'Ciudad Autónoma de Buenos Aires'
                writer.writerow(arreglar_fila(f))


"""
if __name__ == '__main__':
    procesar_html('aprobados1998.html')
