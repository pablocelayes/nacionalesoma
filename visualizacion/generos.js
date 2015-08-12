//cargando el svg inicial
var svg_file1 = "clasificados/genero/mapa1998.svg";

var n_paths = 44;

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
var year_title = d3.select("#year-value");
var cat_title = d3.select("#categoria");

cat_list.on("change",function(){add_years(this.value)});
year_list.on("change",function(){add_svg(cat_title.value,this.value)});

function add_years(cat,years){
	year_list.html("");
	cat_title.text(cat);
	for(var i=0;i<categories[cat].length;i++){
		year_list.append("option")
			.text(categories[cat][i])};
}

function add_svg(cat,year){
	alert(cat);	 //ver porque no lo coge
	alert(year);
}


// cat_list.style("display","none");
// year_list.style("display","none");	

d3.xml(svg_file1, "image/svg+xml", function(xml){
    
    document.getElementById("mapa").appendChild(xml.documentElement);		  
});




