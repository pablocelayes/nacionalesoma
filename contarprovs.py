import codecs

data = codecs.open('data/aprobados/2000.html', 'r', 'iso-8859-1').read()

provre = re.compile("-(\w|\s)*</font>")

provcounts = {}

for m in provre.finditer(data):
    provincia = m.string[m.start() + 2:m.end() - 7].strip()
    provcounts.setdefault(provincia, 0)
    provcounts[provincia] += 1

del provcounts['PROVINCIA']
provcounts['Capital Federal'] += provcounts['Capital\n        Federal']
del provcounts['Capital\n        Federal']

for prov in sorted(provcounts.keys()):
    print("%s, %d" % (prov, provcounts[prov]))

import ipdb; ipdb.set_trace()

