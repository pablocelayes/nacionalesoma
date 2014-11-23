#!/usr/bin/env python
# -*- coding: utf-8 -*-
import pandas as pd
from datetime import date
"""
    Procesamiento de csvs de varios años
    y generación de conteos por año y provincia
"""

años = range(1998, 2002)

csvfile = 'csvs/clasificados%d.csv'
df = pd.read_csv(csvfile % años[0], parse_dates=True)
df['Año'] = date(años[0], 11, 15)

for año in años[1:]:
    newdf = pd.read_csv(csvfile % año, parse_dates=True)
    newdf['Año'] = date(año, 11, 15)
    df = df.append(newdf)

provcounts = df.groupby(['Provincia','Año']).aggregate(sum)
provcounts.to_csv('provcounts.csv')
