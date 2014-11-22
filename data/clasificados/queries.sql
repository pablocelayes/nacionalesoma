UPDATE clasificados_oma_3 SET provincia='Ciudad de Buenos Aires' WHERE localidad='C. A. de Buenos Aires';

SELECT COUNT(*) FROM clasificados_oma_2014 GROUP BY provincia;

INSERT INTO untitled_table_1 (provincia, n_clasificados)
(SELECT provincia, COUNT(*) FROM clasificados_oma_3 GROUP BY provincia);