var mapa_node = d3.select("#mapa");
mapa_node.style("display","none");
//cargando el svg inicial
var svg_file1 = "static/img/Blank_Argentina_Map.svg";

d3.xml(svg_file1,"image/svg+xml", function(xml){
document.getElementById("mapa").appendChild(xml.documentElement);		  
});

function init_participacion(mini_svgs,completos_svgs){
    console.log(mini_svgs,completos_svgs);
	//valores globales						
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
    var input_cantidad = d3.select("#cant");
    var input_pob_esc = d3.select("#pob_esc");
    var legend_node = d3.select(".list-inline");
    var subtitle = d3.select("#subtitle");
    var ajax_result;		//debug-only

    //asociaciones....
    input_node.property("value",1998);
    tooltip_node.attr("class", "tooltip1");

    input_node.on("input", function(){update_svg(+this.value,null,"cantidad");});

    input_pob_esc.on("click",function(){
	filtrar_poblacion_esc(year_title.property("year"))
    });

    input_cantidad.on("click",function(){
	filtrar_cantidad(year_title.property("year"))
    });

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

    function filtrar_cantidad(year){
	input_node.on("input", function(){update_svg(+this.value,null,"cantidad");});
	f_click_cantidad();
	update_svg(year,null,"cantidad");
    } 			
    
    function on_click_radio(subtitle_val,input_form_selected){
	//Cambiar subtítulo
	subtitle.text(subtitle_val);
	//esconder el tooltip(si estuviera activo)
	tooltip_node.style("display","none");
	//cambiar colores de la leyenda
	update_legend(colores(input_form_selected));
    }

    function the_post(year,f){
	$.post("/update",{year: year},
	       function(data,status)
	       {	
		   ajax_result = data;	//debug-only
		   f();
		   update_svg(year,data,"pob_esc");	
	       });
    }			

    function f_click_pob_esc(){
	subtitle_val = "Análisis clasificados según población escolar";
	on_click_radio(subtitle_val,"pob_esc");
    }

    function f_click_cantidad(){
	subtitle_val = "Análisis clasificados según cantidad.";
	on_click_radio(subtitle_val,"cantidad");
    }

    function nothing(){};	
    
    function filtrar_poblacion_esc(year,f){
	input_node.on("input", function(){the_post(+this.value,nothing)});
	the_post(year,f_click_pob_esc);
    }
    function update_legend(list){
	// alert(list);
	for(i=0;i<5;i++){
	    legend_node.selectAll("li")[0][i].style = "border-top-color:"+list[i]
	}
    }

    function tooltip(year,id,event,input_form_selected,data)				
    {
	d3.select("#"+id).style('stroke-width', 2)
	    .style('stroke', 'steelblue');
	
	var prov_name = path_to_provs[id];
	
	if(prov_name != undefined){
	    prov = prov_name.replace(/\s/g, '_');
	    
	    tooltip_node.html(""); //para evitar que "crezca" el tooltip
		var svg_val;
	    var content;
		
	    if (input_form_selected == "pob_esc"){
		svg_val = "<svg width='600' height='600'>"+ mini_svgs[prov_name].documentElement.innerHTML+"</svg>";
		content = "<p><b>Año:</b> "+year+"</p>"+
		    "<p><b>Provincia:</b> "+path_to_provs[id]+"</p>"+ 
		    "<p><b>Poblabión escolar: </b>"+
		    data[prov_name]['Población']+"</p>"+
		    "<p>"+data[prov_name]['Clasificados']+" clasificados(s)</p>"+
		    "<p>"+data[prov_name]['Aprobados']+" aprobado(s)</p>"+
		    "<p>Progresión respecto a población escolar:</p>"+svg_val;

		tooltip_node.html(content);
		
		tooltip_node.style("display","block");
	    }  
	}
    }

    function update_svg(año,data,input_form_selected)
    {
	// alert(año);
	//actualizando label
	d3.select("#year-title").text(" "+año);
	d3.select("#year").property("year", año);
	tooltip_node.style('display', 'none');
	
	//leyendo archivo svg correspondiente al año desde svg_array
	var paths = mapa_node.selectAll("path");
	// alert(paths);
	
	for(var i = 0; i < n_paths; i++){
	    
	    var path = paths[0][i];
	    if (path_to_provs[path.id] != undefined){
		// alert(svg_array.length);
		var fill;
		var prov = path_to_provs[path.id];
		if(prov != undefined){
		    // prov = prov.replace(/\s/g, '_');
		    // alert(prov);
		    fill = data[prov]['Color'];
		}
	    }

	    d3.select(path)
		.transition()
		.style('fill',fill);
	    // alert(provincia);
	    d3.select(path).on('mouseenter',function(event)
			       {
				   tooltip(año,this.id,
					   d3.event,input_form_selected,data);
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
    }
	
	filtrar_poblacion_esc(1998,f_click_pob_esc);
}
