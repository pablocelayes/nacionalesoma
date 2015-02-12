from lxml import etree
import csv
import sys
import lxml.html as lh
filename = "premiados2011.html"
htmlparser = etree.HTMLParser()
tree = etree.parse(filename, htmlparser)
rootnode = tree.getroot()

def get_text(node):
	if node.xpath("*") == []:
		return node.xpath("./text()") 
	result = node.xpath("./text()")
	for i in node.xpath("*"):
		result += get_text(i)
	return "".join(result)

#~ datalevels = rootnode.xpath("//blockquote/p[2]")
datalevels = rootnode.xpath("//ul[3]/li[2]/text()")
#~ datalevels = get_text(rootnode.xpath("//p[2]/*"))
#~ print(get_text(datalevels[0]))
print(datalevels)
	
