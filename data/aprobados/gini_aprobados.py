#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
    Índice de Gini histórico para
    cantidades de aprobados por provincia
"""
import pandas as pd
# from utils import gini
def gini(values):
    values = sorted(values, key=lambda x:-x)
    n = len(values)

    uneven = sum([(n - i) * v for (i, v) in enumerate(values)])
    even = 0.5 * n * sum(values)

    return (uneven - even) / even

años = list(range(1998, 2016))

csvfile = 'csvs/aprobados%d.csv'

ginis = []

for año in años:
    df = pd.read_csv(csvfile % año, parse_dates=True)
    provcounts = df.groupby(['Provincia']).size()
    ginis.append([año, gini(provcounts.values)])

df = pd.DataFrame(columns=["Año", "Gini"], data=ginis)
df.to_csv("gini_aprobados.csv", index=False)
