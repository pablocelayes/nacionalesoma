var svgs_genero = {'progresiones_grales':[],
				   'años':[],
				   'progresiones_provincias':{'clasificados':[],
											  'aprobados':[],
											  'premiados':[]},
				   'progresiones_porcentuales_provincias':{'clasificados':[],
											  'aprobados':[],
											  'premiados':[]}};
var cats = ["clasificados","aprobados","premiados"];

var provinces = 
    ["Buenos Aires",
     "Catamarca",
     "Chaco",
     "Chubut",
     "Ciudad Autónoma de Buenos Aires",
     "Corrientes",
     "Córdoba",
     "Entre Ríos",
     "Formosa",
     "Jujuy",
     "La Pampa",
     "La Rioja",
     "Mendoza",
     "Misiones",
     "Neuquén",
     "Río Negro",
     "Salta",
     "San Juan",
     "San Luis",
     "Santa Cruz",
     "Santa Fe",
     "Santiago del Estero",
     "Tierra del Fuego",
     "Tucumán"
    ];
				   
function load_svgs_genero(){
	//cargando progresiones generales
	for(var i = 0; i < 3;i++){
		d3.xml("/static/img/plots/genero/F/progresion_anual_"+cats[i]+".svg",
			   "image/svg+xml",
			   function(xml)
			   {
				svgs_genero['progresiones_grales'].push(xml);
			   });
		load_progress_svgs(cats[i],provinces);	   
		for(var j = 1999;j < 2015;j++){
			d3.xml("/static/img/"+cats[i]+"/genero/mapa"+j+".svg",
				   "image/svg+xml",
				   function(xml)
				   {
					svgs_genero['años'].push(xml);
				   });
		}
	}
	console.log(svgs_genero);
}

function load_progress_svgs(cat){
	for(var i=0;i<24;i++)
	{
		d3.xml("/static/img/plots/genero/F/"+cat+"/progresion_anual_"+provinces[i]+".svg",
			   "image/svg+xml",
			   function(xml)
			   {
				svgs_genero['progresiones_provincias'][cat].push(xml);
			   });
		d3.xml("/static/img/plots/genero/F/"+cat+"/porcentual/progresion_anual_"+provinces[i]+".svg",
			   "image/svg+xml",
			   function(xml)
			   {
				svgs_genero['progresiones_porcentuales_provincias'][cat].push(xml);
			   });	
	}
}	

load_svgs_genero();