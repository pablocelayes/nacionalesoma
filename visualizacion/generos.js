//cargando el svg inicial
var svg_file1 = "clasificados/genero/mapa1998.svg";

var n_paths = 44;

var categories = {clasificados:[],aprobados:[],premiados:[]};

categories.clasificados = d3.range(1998,2015);
categories.aprobados = d3.range(1998,2015);

for(var i = 1998; i<2015;i++){
    if(i!=2000)
    {categories.premiados.push(i);}
};
	

var cat_list = d3.select("#cat-listbox");  
var year_list = d3.select("#year-listbox");

cat_list.on("change",function(){show_years_list(this.value,categories)});

function show_years_list (cat,categories){
    // alert(cat);
    // alert(categories.premiados);
    d3.selectAll("#year-listbox").data(categories.premiados)
        .enter()
        .append("option")
        .text(function(d) { return d; });
}

// cat_list.style("display","none");
// year_list.style("display","none");

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

d3.xml(svg_file1, "image/svg+xml", function(xml){
    
    document.getElementById("mapa").appendChild(xml.documentElement);		  
});




