import pandas as pd
import matplotlib.pyplot as plt

provs = pd.read_csv("./clasificados/provcounts.csv")

provincia = "Córdoba"
provincia_rows = provs[provs['Provincia'] == provincia]

plt.bar(provincia_rows['Año'],provincia_rows['Cantidad'])		  
		  
plt.show()
