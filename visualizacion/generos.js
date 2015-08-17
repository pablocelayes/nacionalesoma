var svg_file1 = "clasificados/genero/mapa1998.svg";

var n_paths = 44;

var cat_selected = "Clasificados";
var initial_year = 1998;

var vpremiados = [];
var vclasificados = d3.range(1998,2015);
var vaprobados = vclasificados;

var categories = 
	{
		Aprobados:vaprobados,
		Premiados:vpremiados,
		Clasificados:vclasificados
	};

for(var i = 1998; i<2015;i++){
    if(i!=2000)
    {vpremiados.push(i);}
};
	
var path_to_provs = 
    {
	path2413:"Buenos Aires",
	path3180:"Catamarca",
	path3189:"Chaco",
	path3194:"Chubut",
	path2265:"Ciudad Autónoma de Buenos Aires",
	path3195:"Corrientes",
	path3166:"Córdoba",
	path3201:"Entre Ríos",
	FO:"Formosa",
	path3185:"Jujuy",
	path3164:"La Pampa",
	path3178:"La Rioja",
	path3174:"Mendoza",
	path3228:"Misiones",
	path3172:"Neuquén",
	path2388:"Río Negro",
	path3182:"Salta",
	path3176:"San Juan",
	path3170:"San Luis",
	path3192:"Santa Cruz",
	path3224:"Santa Fe",
	path3193:"Santiago del Estero",
	path2384:"Tierra del Fuego",
	path3187:"Tucumán",
    };	
	

var cat_list = d3.select("#cat_listbox");  
var year_list = d3.select("#year_listbox");
var year_title = d3.select("#year");
var cat_title = d3.select("#categoria");
var prog_prov = d3.select("#prog_prov");
var prog_nac = d3.select("#prog_nac");

cat_list.on("change",function(){add_years(this.value);});
year_list.on("change",function(){add_svg(this.value)});

function add_years(cat){
	year_list.html("");
	cat_selected = cat;
	cat_title.text(cat);
	year_title.text(initial_year);
	for(var i=0;i<categories[cat].length;i++){
		year_list.append("option")
			.text(categories[cat][i])
	};
	update_svg(cat_selected,initial_year);
}

function add_svg(year){
    year_title.text(year);
    update_svg(cat_selected,year);
}

function update_svg(cat,year){

    var route_to_svg = cat.toLowerCase()+"/genero/mapa"+year+".svg";
    d3.xml(route_to_svg,"image/svg+xml", function(xml){
	d3.select("#mapa").html("");
	document.getElementById("mapa").appendChild(xml.documentElement);
	
	show_national_progression(cat,year);
	//TODO: mostrar un svg al costado derecho del mapa con la progresión nacional anual de la 
	//la categoría en ese año 
	var paths = d3.selectAll("path");
	// adicionando tooltip a todas las provincias ...
	for(var i = 0; i < n_paths; i++){
	    
	    var path = paths[0][i];
	    if (path_to_provs[path.id] != undefined){
	    d3.select(path)
		.on('mouseenter',function(event)
		    {
			// alert(cat+"|"+year+"|"+this.id+"|"+d3.event); 
			// show_province_progression(cat,year,this.id,d3.event); 
		    })
		.on('mouseout',function(event)
		    {
			d3.select("#"+this.id).style('stroke-width', 1)
			    .style('stroke', 'white')
		    })
		.on('click',function(event)
		    {
			// var provincia = path_to_provs[this.id];
			// if(provincia != undefined){
			// 	provincia = provincia.replace(/\s/g, '_');
			// 	window.open("plots/"+provincia+"-completo.svg");
			// }
		    });

	    }
	}
	
    });
    
}

function show_national_progression(cat,year){
    prog_nac.html("");
    var svg_file = "plots/genero/F/progresion_anual_"+cat.toLowerCase()+".svg";
	d3.xml(svg_file,"image/svg+xml", function(xml){
	document.getElementById("prog_nac").appendChild(xml.documentElement);
	});
}


d3.xml(svg_file1, "image/svg+xml", function(xml){
    
    document.getElementById("mapa").appendChild(xml.documentElement);		  
});

add_years("Clasificados");

