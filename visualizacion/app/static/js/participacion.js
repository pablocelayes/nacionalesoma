//cargando el svg inicial
var svg_file1 = "static/img/Blank_Argentina_Map.svg";
d3.xml(svg_file1,"image/svg+xml", function(xml){
    document.getElementById("mapa").appendChild(xml.documentElement);		  
});

var mapa_node = d3.select("#mapa");
mapa_node.style("display","none");

function initialize_values(years_partic){

    var paths = mapa_node.selectAll("path");
    // alert("in initialize_values: "+paths);
    participacion(years_partic,paths);
}


years_partic = [];

function get_year(year,last){
    d3.xhr("/update")
	.header("Content-Type", "application/x-www-form-urlencoded")
	.post("year="+year, function(error, data){
	    // callback
	    years_partic.push(data.response);
	    if(year == last){
		//~ console.log(years_partic);
		initialize_values(years_partic);
		//participacion(years_partic);
	    }
	});
}

function get_years(init,end){
    for(var i=init;i<end;i++){
	get_year(i,end-1);
    }
} 

function participacion(years_partic,paths){
    //initialize_values();
    var n_paths = 44;

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

    var year_title = d3.select("#year");
    var tooltip_node = d3.select("#tooltip");
    var input_node = d3.select("input"); 
    var form = d3.select("#sender");
    var legend_node = d3.select(".list-inline");
    var subtitle = d3.select("#subtitle");

    // alert("paths in part = "+paths);

    //asociaciones....
    input_node.property("value",1998);
    tooltip_node.attr("class", "tooltip1");

    input_node.on("input", function(){update_svg(+this.value);});

    //funciones
    function colores(filtro){			//para la leyenda
	if(filtro == "pob_esc")
	    return ["#ffe9e9",
		    "#e0b6b6",
		    "#db9696",
		    "#7e4747",
		    "#410e0e",
		   ];
	// if (filtro == "niveles")
	// return colores_niveles();
	return ["#edf8e9",
		"#c7e9c0",
		"#a1d99b",
		"#41ab5d",
		"#005a32"];}
    
    function update_legend(list){
	// alert(list);
	for(i=0;i<5;i++){
	    legend_node.selectAll("li")[0][i].style = "border-top-color:"+list[i]
	}
    }

    function get_province_prog(prov,data){
	// alert("in get_province_prog");
	var res = {'prog':prov,'data':[]};
	for(var i=0;i<data.length;i++){
	    res['data'].push(JSON.parse(data[i])[prov]);
	}
	return res;
    }

    function paint_svg(tooltip_node,prog_prov){
	var dataset = [ 5, 10, 13, 19, 21, 25, 22, 18, 15, 13,
		11, 12, 15, 20, 18, 17, 16, 18, 23, 25 ];
	
	var w = 500;
	var h = 100;
	var barPadding = 1;
	
	var svg = tooltip_node.append("svg")
	    .attr("width", w)
	    .attr("height", h);

	svg.selectAll("rect")
	    .data(prog_prov['data'])
	    .enter()
	    .append("rect")
	    .attr("x", function(d, i) {
		return i * (w / prog_prov['data'].length); //Bar width of 20 plus 1 for padding
	    })
	    .attr("y", function(d) {
		return h - d['Índice']*100000;
	    })
	    .attr("width", w / prog_prov['data'].length - barPadding)
	    .attr("height", function(d) {
		return d['Índice']*100000 ; //Just the data value
	    })
	    .attr("fill","#410e0e");	
	
    }

    function tooltip(year,id,event,data)				
    {
	d3.select("#"+id).style('stroke-width', 2)
	    .style('stroke', 'steelblue');
	
	var prov_name = path_to_provs[id];
	var data_json = JSON.parse(data[year-1998])
	if(prov_name != undefined){
	    prov = prov_name.replace(/\s/g, '_');
	    
	    tooltip_node.html(""); //para evitar que "crezca" el tooltip
	    var svg_val;
	    var content;
	    var prog_prov = get_province_prog(prov_name,data);
	    console.log(prog_prov);
	    content = "<p><b>Año:</b> "+year+"</p>"+
	    	"<p><b>Provincia:</b> "+path_to_provs[id]+"</p>"+ 
	    	"<p><b>Poblabión escolar: </b>"+
	    	data_json[prov_name]['Población']+"</p>"+
	    	"<p>"+data_json[prov_name]['Clasificados']+" clasificados(s)</p>"+
	    	"<p>"+data_json[prov_name]['Aprobados']+" aprobado(s)</p>"+
	    	"<p>Progresión respecto a población escolar:</p>";

	    tooltip_node.html(content);

	    paint_svg(tooltip_node,prog_prov);
	    
	    // svg_val = "<svg width='600' height='600'>"+ mini_svgs[prov_name].documentElement.innerHTML+"</svg>";
	    

	    

	    tooltip_node.style("display","block");
	}}

    function update_svg(año)
    {
	// alert(año);
	//actualizando label
	//cargando data provincias 
	//1) para mapas por años
	d3.select("#year-title").text(" "+año);
	d3.select("#year").property("year", año);
	tooltip_node.style('display', 'none');
	// alert("parts in update_svg = "+paths);
	
	for(var i = 0; i < n_paths; i++){
	    
	    var path = paths[0][i];
	    if (path_to_provs[path.id] != undefined){
		var fill;
		//~ alert("pro"prov);
		//~ alert(years_partic[año-1998]);
		var prov = path_to_provs[path.id];
		var data_json = JSON.parse(years_partic[año-1998])[prov];
		if(prov != undefined){
		    // prov = prov.replace(/\s/g, '_');
		    // alert(prov);
		    fill = data_json['Color'];
		    //~ alert("Filling..."+data_json);
		}
	    }

	    d3.select(path)
		.transition()
		.style('fill',fill);
	    // alert(provincia);
	    d3.select(path).on('mouseenter',function(event)
			       {
				   tooltip(año,this.id,
					   d3.event,years_partic);
			       }).on('mouseout',function(event)
				     {
					 d3.select("#"+this.id).style('stroke-width', 1)
					     .style('stroke', 'white')
					 
				     })
		.on('click',function(event)
		    {
			var provincia = path_to_provs[this.id];	
			if(provincia != undefined){
			    var provincia_clean = provincia.replace(/\s/g, '_');
			    window.open("./static/img/plots/poblacion_escolar/"+provincia_clean+"-completo.svg");
			    // window.open(completos_svgs[provincia]);
			}
		    });
	}
	mapa_node.style("display","block");			 
    }
    
    update_svg(1998);
}

// get_years(1998,2015);
