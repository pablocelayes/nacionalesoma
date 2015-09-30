var svg_file1 = "static/img/clasificados/genero/mapa1998.svg";

var n_paths = 44;

var cat_selected = "Clasificados";
var initial_year = 1998;
var previous_year = null;		//para usar en compute_year


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
	

var cat_list_gen = d3.select("#cat_listbox_gen");  
var year_label_gen = d3.select("#year_label_gen");  
var year_list_gen = d3.select("#year_range_gen");
var year_title_gen = d3.select("#year_gen");
var cat_title_gen = d3.select("#categoria_gen");
var prog_prov_gen = d3.select("#prog_prov_gen");
var prog_nac = d3.select("#prog_nac_gen");
var actual_prov = d3.select("#prov_gen");
var actual_prov_percent = d3.select("#percent_gen");
var prog_prov_percent = d3.select("#prog_prov_percent_gen");

// prog_nac.attr("padding-rigth","100px"); //TODO el padding


function compute_year(year_val){        
	//para 'saltarse' el año 2000 en los premiados, pues no tiene data	
	if(cat_selected == "Premiados" && (year_val == 1999 || year_val == 2001)){
		previous_year = year_val;
		return year
	}
	else{
		if(cat_selected == "Premiados" && year_val == 2000){
			if (previous_year == null){
				previous_year = 1999;
			}
			else{
				previous_year = previous_year + 2*(2000 - previous_year);
			}			
			return previous_year; 
		}	
	}
	previous_year = null;
	return year_val;
}

cat_list_gen.on("change",function(){add_years(this.value);});
year_list_gen.on("change",function(){add_svg(compute_year(+this.value))});


function add_years(cat){
    actual_prov.html("");
    actual_prov_percent.html("");
//    year_list_gen.html("");
    cat_selected = cat;
    cat_title_gen.text(cat);
    year_title_gen.text(initial_year);
    year_list_gen.property("value",1998);
	year_label_gen.text(" "+initial_year);
    update_svg_gen(cat_selected,initial_year);
}

function add_svg(year){
    actual_prov.html("");
    actual_prov_percent.html("");
    year_title_gen.text(year);
    year_label_gen.text(" "+year);
    update_svg_gen(cat_selected,year);
}

function update_svg_gen(cat,year){

	// alert(cat);
    var route_to_svg = "static/img/"+cat.toLowerCase()+"/genero/mapa"+year+".svg";
    d3.xml(route_to_svg,"image/svg+xml", function(xml){
	d3.select("#mapa_gen").html("");
	document.getElementById("mapa_gen").appendChild(xml.documentElement);
	
	show_national_progression(cat,year);

	var paths = d3.selectAll("path");
	// adicionando tooltip a todas las provincias ...
	for(var i = 0; i < n_paths; i++){
	    
	    var path = paths[0][i];
	    if (path_to_provs[path.id] != undefined){
	    d3.select(path)
		.on('mouseenter',function(event)
		    {
			d3.select("#"+this.id).style('stroke-width', 2)
			    .style('stroke', 'purple')
			alert(cat+"|"+year+"|"+this.id+"|"+d3.event); 
			// alert(this);
			show_prov_prog(cat,year,this.id);
			show_prov_percent(cat,year,this.id);
		    })
		.on('mouseout',function(event)
		    {
			d3.select("#"+this.id).style('stroke-width', 1)
			    .style('stroke', 'white')
		    });
	    }
	}
    });
    
}

function f_part(x){
    return x - Math.floor(x);
}

function take_decimals(x,n){
    return Math.floor(x*Math.pow(10,n));
}

function truncate(x,n){
    return +(Math.floor(x)+"."+(take_decimals(f_part(x),n)));
}

function show_prov_percent(cat,year,id){
    alert(cat);
	var true_cat = cat.toLowerCase();
    var csv_file = "static/img/"+true_cat+"/genero/"+true_cat+"_por_provincia_y_genero.csv";
    d3.csv(csv_file,
	   function(rows)
	   {
	       rows.map(function(d)
			{
			    if(d.Año == year && d.Provincia == path_to_provs[id]){
				var all = (+d.F) + (+d.M);
				var percent;
				if(all > 0)
				    percent = (d.F/all)*100;
				else
				    percent = 0;
				actual_prov_percent.text(truncate(percent,2)+"%");
				return;
			    }
			});
	   });
}

function show_prov_prog(cat,year,id){
    alert(cat);
	prog_prov_gen.html("");
	prog_prov_percent.html("");
    var prov = path_to_provs[id];
    var svg_file1 = "static/img/plots/genero/F/"+cat.toLowerCase()+"/progresion_anual_"+prov+".svg";
    var svg_file2 = "static/img/plots/genero/F/"+cat.toLowerCase()+"/porcentual/progresion_anual_"+prov+".svg";
    actual_prov.text(prov);
    
    $.when($.ajax(svg_file1))
	.then(
	    function(){
		prog_prov_gen.append("img").attr("src",svg_file1)
    		    .attr("height","250px");
		prog_prov_percent.append("img").attr("src",svg_file2)
				.attr("height","250px");},
	    function(){
		prog_prov_gen.append("div")
		    .attr("class","prog-prov")
		    .html("<strong>"+prov+"</strong>: provincia sin "+
			  cat.toLowerCase()+" femeninos en ningún año.");
	    });
}
 

function show_national_progression(cat,year){
    prog_nac.html("");
    var svg_file = "static/img/plots/genero/F/progresion_anual_"+cat.toLowerCase()+".svg";
    prog_nac.append("img").attr("src",svg_file)
	.attr("height","250px");
}


d3.xml(svg_file1, "image/svg+xml", function(xml){
    document.getElementById("mapa_gen").appendChild(xml.documentElement);		  
});

add_years("Clasificados");


