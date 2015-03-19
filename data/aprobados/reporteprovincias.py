#!/usr/bin/env python
# -*- coding: utf-8 -*-
import pandas as pd
from datetime import date
"""
    Procesamiento de csvs de varios años
    y generación de conteos por año y provincia
"""

años = range(1998, 2015)

csvfile = 'csvs/aprobados%d.csv'
df = pd.read_csv(csvfile % años[0], parse_dates=True)
df['Año'] = años[0]

for año in años[1:]:
    newdf = pd.read_csv(csvfile % año, parse_dates=True)
    newdf['Año'] = año
    df = df.append(newdf)

provcounts = df.groupby(['Provincia','Año']).size()
provcounts.to_csv('provcounts.csv',encoding='utf-8')

# TODO: Rosario no es provincia!
