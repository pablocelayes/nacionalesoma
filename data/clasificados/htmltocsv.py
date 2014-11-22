from lxml import etree
import csv

filename = 'clasificados1998'

htmlparser = etree.HTMLParser()
tree = etree.parse(filename + '.html', htmlparser)

dataniveles = tree.getroot().xpath('//pre')

with open(filename + '.csv', 'w', newline='') as csvfile:
	writer = csv.writer(csvfile)
	header = 'Nivel Apellido Nombres Localidad Provincia'.split()
	writer.writerow(header)

	for i, data in enumerate(dataniveles):
		filas = data.text.split('\n')
		filas = [f for f in filas if f] #  removemos filas vacías
		filas = filas[1:] # removemos encabezado

		if i == 0:
			for f in filas:
				fila = [i + 1] + [s.strip() for s in [f[:20], f[20:44], f[44:68], f[68:]]]
				writer.writerow(fila)
		elif i == 1:
			for f in filas:
				fila = [i + 1] + [s.strip() for s in [f[:20], f[20:42], f[42:68], f[68:]]]
				writer.writerow(fila)
		else:
			for f in filas:
				fila = [i + 1] + [s.strip() for s in [f[:20], f[20:39], f[39:65], f[65:]]]
				writer.writerow(fila)