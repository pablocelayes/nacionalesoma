import urllib.request


urls = ["http://oma.org.ar/nacional/clasificados-oma%dnac.html",
    "http://oma.org.ar/nacional/clasificados-oma%dnac.htm",
    "http://oma.org.ar/nacional/resultados-oma%dreg.html",
    "http://oma.org.ar/nacional/resultados-oma%dreg.htm",]

for i in range(11, 20):
    n = 31 - i
    
    for url in [u % n for u in urls]:
        try:
            response = urllib.request.urlopen(url)
            break
        except Exception: # .htm file
            continue

    data = response.read()      # a `bytes` object
    año = 2014 - i
    with open("clasificados%d.html" % año, 'wb') as f:
        f.write(data)
