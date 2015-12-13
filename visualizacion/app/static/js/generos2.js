var svgs_genero_init = {'progresiones_grales':[],
						'años':[],
						'progresiones_provincias':{'clasificados':[],
											  'aprobados':[],
											  'premiados':[]},
						'progresiones_porcentuales_provincias':{'clasificados':[],
											  'aprobados':[],
											  'premiados':[]}};

var svgs_genero_end = {'progresiones_nacionales':{},
					   'años':{},
					   'progresiones_provincias':{'clasificados':{},
											  'aprobados':{},
											  'premiados':{}},
					   'progresiones_porcentuales_provincias':{'clasificados':{},
											  'aprobados':{},
											  'premiados':{}}};

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
    

function detect_category(svg_list_cats,cat){
	//~ugliest patch because of unpredictable d3.xml calls results and disctincts orders of svgs lists
	var res = {};
	for(var i = 0;i<3;i++){
		if(svg_list_cats[i].URL.search(cat) != -1)
			return svg_list_cats[i];
	}  
}    

   
function transform_svgs(cats){
	console.log(cats);
	
	svgs_genero_end['progresiones_nacionales'] = 
	{
		'clasificados':detect_category(svgs_genero_init['progresiones_grales'],'clasificados'), 
		'aprobados':detect_category(svgs_genero_init['progresiones_grales'],'aprobados'),
		'premiados':detect_category(svgs_genero_init['progresiones_grales'],'premiados')
	};
	
	svgs_genero_end['años'] = {
		'clasificados':{},
		'aprobados':{},
		'premiados':{}
	};
	for(var i=0,j=1998;j<2015;i++,j++){	//clasificados
		svgs_genero_end['años']['clasificados'][j] = svgs_genero_init['años'][i];
	} 
	for(var i=17,j=1998;j<2015;i++,j++){	//aprobados
		svgs_genero_end['años']['aprobados'][j] = svgs_genero_init['años'][i];
	} 
	for(var i=34,j=1998;j<2015;i++,j++){	//premiados
		svgs_genero_end['años']['premiados'][j] = svgs_genero_init['años'][i];
	}
}
				   
function load_svgs_genero(){
	//cargando progresiones generales
	for(var i = 0; i < 3;i++){
		d3.xml("/static/img/plots/genero/F/progresion_anual_"+cats[i]+".svg",
			   "image/svg+xml",
			   function(xml)
			   {
				svgs_genero_init['progresiones_grales'].push(xml);
			   });
		load_progress_svgs(cats[i],provinces);	   
		for(var j = 1998;j < 2015;j++){
			d3.xml("/static/img/"+cats[i]+"/genero/mapa"+j+".svg",
				   "image/svg+xml",
				   function(xml)
				   {
					svgs_genero_init['años'].push(xml);
					if(svgs_genero_init['años'].length == 51 &&
					   svgs_genero_init['progresiones_grales'].length == 3)
					   {
						   transform_svgs(cats);
						   init_generos(svgs_genero_end);
					   }

				   });
		}
	}
	//~ console.log(svgs_genero_init);
	//~ console.log(svgs_genero_end);
}

function load_progress_svgs(cat){
	for(var i=0;i<24;i++)
	{
		set_progress_province(cat,provinces[i]);	
	}
}	

function set_progress_province(cat,prov){
	
		d3.xml("/static/img/plots/genero/F/"+cat+"/progresion_anual_"+prov+".svg",
			   "image/svg+xml",
			   function(xml)
			   {
				svgs_genero_end['progresiones_provincias'][cat][prov] = xml;
				//~ svgs_genero_init['progresiones_provincias'][cat].push(xml);
			   });
		d3.xml("/static/img/plots/genero/F/"+cat+"/porcentual/progresion_anual_"+prov+".svg",
			   "image/svg+xml",
			   function(xml)
			   {
				//~ svgs_genero_init['progresiones_porcentuales_provincias'][cat].push(xml);
				svgs_genero_end['progresiones_porcentuales_provincias'][cat][prov] = xml;
			   });
}

load_svgs_genero();
