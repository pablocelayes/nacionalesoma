#!/usr/bin/env python
# -*- coding: utf-8 -*-

#TODOs: 
#1-manejar filas con número de campos no homogéneos
#2-normalizar 'Sta. Fe' 

from lxml import etree
import csv
import sys
import lxml.html as lh
import re

# Scheme .csv files = 'Premio Nivel NombreApellidos Colegio Localidad Provincia'
range_init = 2006
range_end = 2014


def process_html(filename):
	"""
	Generar .csv file  
	"""
	scheme = 'Premio Nivel NombresApellidos Colegio Localidad Provincia'
	htmlparser = etree.HTMLParser()
	tree = etree.parse(filename, htmlparser)
	rootnode = tree.getroot()
	basefilename = filename.split('.')[0]
	short_rows_report = []
	bigger_rows_report = []
	
	#roots_xpaths:
	#Lugares compartidos: (2,2,2) significa en el nivel 2
	#se ha compartido puesto del 2do subcampeon por 2 premiados
	#(se incluye su xpath pues tienen además distinto "formato" al resto de los nodos)
	#missing = premiado que falta	
	leaders = {
	2006:["//p[%d]"%i for i in [2,3,4,6,7,8,10,11,12]],
	2007:{0:["/html/body/p[%d]"%i for i in [2,6,9]],
		  1:["//p[%d]"%i for i in [3,7,10]],
          2:["//p[4]"]+[["//blockquote/p[%i]"%i for i in [1,2]]]+[["//p[%d]"%i for i in [12,13]]]}, 			
	2008:["//blockquote[%d]"%i for i in range(1,10)],
	2009:["//ul[{0}]/li[{1}]".format(i,j) for i in [1,2,3] for j in [1,2,3]],
	2010:{0:["//ul[%d]/li[1]"%i for i in [1,2]]+[["//ul[3]/li[1]/text()"]],
		  1:["//ul[%d]/li[2]"%i for i in [1,2,3]],
		  2:["//ul[%d]/li[3]"%i for i in [1,2,3]]},
	2011:{0:["//ul[%d]/li[1]"%i for i in [1,2]] + [["//ul[3]/li[1]/text()"]],	#'shared':[(3,1,2,None),(3,3,2,None),(3,2,0,None)],
		  1:["//ul[%d]/li[2]"%i for i in [1,2]]+["//impossible"],
		  2:["//ul[%d]/li[3]"%i for i in [1,2]]+[["//ul[3]/li[2]/text()"]]},
	2012:["//ul[{0}]/li[{1}]".format(i,j) for i in [1,2,3] for j in [1,2,3]],
	2013:["//ul[{0}]/li[{1}]".format(i,j) for i in [1,2,3] for j in [1,2,3]],
	2014:["//ul[{0}]/li[{1}]".format(i,j) for i in [1,2,3] for j in [1,2,3]],
	}
	mentions = {
	2006:["//ul[%d]/li/p/font/span"%i for i in [1,2,3]], 		
	#2006 y 2007:el texto esta repartido entre los hijos				   
	2007:["//ul[{0}]/li/p/font{1}".format(i,"/span" if i != 1 else "") for i in [1,2,3]],		
	2008:["//blockquote[%d]/p"%i for i in [10,11,12]],
	2009:["//ul[%d]/li/text()"%i for i in [4,5,6]],
	2010:["//ul[%d]/li/text()"%i for i in [4,5,6]],
	2011:["//ul[%d]/li/text()"%i for i in [4,5,6]],
	2012:["//ul[%d]/li/text()"%i for i in [4,5,6]],
	2013:["//ul[%d]/li/text()"%i for i in [4,5,6]],
	2014:["//ul[{0}]/li/{1}text()".format(i,"span/" if i == 5 else "") for i in [4,5,6]],
	}
	
	def is_BsAs(string):
		ba = re.compile(r'^Buenos[ ]*Aires|^[Bb]s[ .]+[Aa]s')
		return ba.search(string)
	
	def is_CABA(string):
		caba = re.compile(r'^.*[D( ){,1}d]e[ ]+Buenos[ ]*Aires|^.*[D( ){,1}d]e[ ]+[Bb]s[ .]+[Aa]s|Capital Federal')
		return caba.search(string)

	def normalize_spaces(string):
		spaces = re.compile(r'[ ]{2,}')
		return spaces.sub(' ',string)
		
	def clean(field,*args):
		for i in args:
			field = field.replace(i,'')
		return field
	
	def replacer(field,*args):
		for i in args:
			field = field.replace(i,'-')
		return field

	def format_data(string):
		"""
		Convierte texto plano en data lista para
		guardar en csv.
		"""
		string = replacer(string,',','–','\x96')		
		res = [normalize_spaces(i.strip()) for i in clean(string,'\x95\xa0','\xa0','°','\n','·','"',"'").split('-') if i]
		
		#para entradas finales "vacías"
		if not res[-1]:
			del res[-1]
			
		dot_champions = re.compile(r'^.*:') # para eliminar "1 Campeón:" like entries...
		try:
			res[2] = dot_champions.sub('',res[2])
		except IndexError:
			pass
		if year == 2012 and res[0]!= 'Mención':
			res[-1],res[-2] = res[-2],res[-1]
		    		
		
		#lidiando con la normalización de los campos
		if is_CABA(res[-1]):
			res[-1] = "Ciudad Autónoma de Buenos Aires"
			res.insert(-1,"Capital Federal")
		elif is_BsAs(res[-1]):
			res[-1] = "Buenos Aires"
		
		len_res = len(res)    		
		## ---Para ver filas no homogéneas:
		if len_res < 6:
			res = ['<short row>'] + res
			# short_rows_report.append(res)
		elif len_res > 6:
			res = ['<big row>'] + res
			# bigger_rows_report.append(res)
		return res

	def get_text(node):				
		res = node.xpath(".//text()")
		return "".join(res)
			
	def process_mentions(year):
		values = [[] for i in range(3)]  
		for i in range(3):
			xpath_values = rootnode.xpath(mentions[year][i])
			if year <= 2008:		#i no es texto sino nodo "span" con hijos(a veces nietos) con el "texto" buscado
				for j in range(len(xpath_values)):				
					xpath_values[j] = get_text(xpath_values[j]) 	
			values[i] = ["Mención-{0}-{1}".format(i+1,j) for j in xpath_values]
		return [j for i in values for j in i]

	def process_leaders(year):
		premio = ["Campeón", "Primer Subcampeón", "Segundo Subcampeón"]
		values = []
		if type(leaders[year]) != type({}): #no casos especiales
			xpath_values = [rootnode.xpath(i)[0] for i in leaders[year]]
			for i in range(len(xpath_values)):
				values += ["{0}-{1}-{2}".format(premio[i%3],int(i/3)+1,get_text(xpath_values[i]))] 
			return values
		#hay premios compartidos y/o hay algun premio desierto
		#...otra estructura
		for i in range(3):
			for j in range(3):
				xpath_constant = leaders[year][i][j]
				if type(xpath_constant) != type([]):
					dom_val = rootnode.xpath(xpath_constant)[0] if rootnode.xpath(xpath_constant) else []
					values += ["{0}-{1}-{2}".format(premio[i],j+1,get_text(dom_val))] if dom_val else []
				elif year == 2007:
					dom_vals = [rootnode.xpath(z)[0] for z in xpath_constant]
					values += ["{0} compartido-{1}-{2}".format(premio[i],j+1,get_text(z)) for z in dom_vals]
				else:
					dom_vals = [rootnode.xpath(z) for z in xpath_constant]
					values += ["{0} compartido-{1}-{2}".format(premio[i],j+1,z) for z in dom_vals[0]]
		return values	
		
	def process_year(year):
		return process_leaders(year) + process_mentions(year)
		
	def save_csvs(year):
		with open('csvs/' + basefilename + '.csv', 'w',encoding='utf-8',newline='') as csvfile:
			writer = csv.writer(csvfile)
			header = scheme.split()
			writer.writerow(header)
			for i in process_year(year):
				writer.writerow(format_data(i))
	
	def save_reports(year,data,filename):
		with open('csvs/{0}-rows-{1}.csv'.format(filename,year), 'w',encoding='utf-8',newline='') as csvfile:
			for i in data:
				writer = csv.writer(csvfile)
				writer.writerow(i)

	
	save_csvs(year)
	# save_reports(year,bigger_rows_report,'big')
	# save_reports(year,short_rows_report,'short')

if __name__ == '__main__':
	if len(sys.argv) > 1:
		process_html(sys.argv[1])
	else:
		for year in range(range_init, range_end+1):
			process_html('premiados%d.html' % year)	
