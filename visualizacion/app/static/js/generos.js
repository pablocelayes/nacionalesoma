var svg_file1 = "static/img/clasificados/genero/mapa1998.svg";

d3.xml(svg_file1, "image/svg+xml", function(xml){
    document.getElementById("mapa_gen").appendChild(xml.documentElement);
});

function init_generos(years_partic){

    console.log(years_partic);

    var n_paths = 44;

    var cat_selected = "Clasificados";
    var initial_year = 1998;

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

    var prog_nac_gen = d3.select("#prog_nac_gen");
    prog_nac_gen.attr("border-spacing","20px"); //TODO el padding

    var actual_prov_gen = d3.select("#prov_gen");
    var actual_prov_percent_gen = d3.select("#percent_gen");
    var prog_prov_percent_gen = d3.select("#prog_prov_percent_gen");
    var mapa_gen = d3.select("#mapa_gen");


    var gris = "#dcdcdc"; 		 //valor neutro rgb(220,220,220)
    var celeste = "#6496ff";  		 //todos masculinos = "rgb(100,150,255)"
    var rosa = "#ff6496"	 	 //todos femeninos =  "rgb(255,100,150)"
    var purpura = "#800080";

    //colores desde el más celeste hasta el más rosa

    var colores = ["#6496ff","#7da7ff","#96b8ff","#b0c9ff","#c9dbff",
		   "#ffc9db","#ffb0c9","#ff96b8","#ff7da7","#ff6496"];

    cat_list_gen.on("change",function(){add_years(this.value);});
    year_list_gen.on("input",function(){add_svg(+this.value);});

    function add_years(cat){
	actual_prov_gen.html("");
	actual_prov_percent_gen.html("");
	cat_title_gen.text(cat);
	year_title_gen.text(initial_year);
	year_list_gen.property("value",1998);
	year_label_gen.text(" "+initial_year);
	update_svg_gen(cat,initial_year);
	cat_selected = cat;
    }

    function add_svg(year){
	actual_prov_gen.html("");
	actual_prov_percent_gen.html("");
	year_title_gen.text(year);
	year_label_gen.text(" "+year);
	update_svg_gen(cat_selected,year);
    }
    function color_picker(f_count,m_count){
	if((f_count == m_count) && (f_count > 0))
	    return purpura;
	if((f_count == m_count) && (f_count == 0))
	    return gris;
	if(f_count == 0)
	    return celeste;
	if(m_count == 0)
	    return rosa;
	var index = Math.floor((10*f_count)/(m_count+f_count));
	//console.log(f_count,m_count,index);
	return colores[index];
    }

    function update_svg_gen(cat,year){

	console.log(cat);
	//~ console.log(years_partic['años'][cat.toLowerCase()][year]);

	show_national_progression(cat,year);
	var data_json = JSON.parse(years_partic[year-1998])['genero'];
	console.log("generos",data_json);
	var paths = mapa_gen.selectAll("path");
	// alert(paths);
	// adicionando tooltip a todas las provincias ...
	for(var i = 0; i < n_paths; i++){

	    var path = paths[0][i];
	    // alert(path);
	    if (path_to_provs[path.id] != undefined){
		var fill;
		var prov = path_to_provs[path.id];
		var data_prov = data_json[cat][prov];
		if(prov != undefined){
		    var f_count = data_prov['F'];
		    var m_count = data_prov['M'];
		    fill = color_picker(f_count,m_count);
		}
		d3.select(path)
		    .transition()
		    .style('fill',fill);
		d3.select(path)
		    .on('mouseenter',function(event)
			{
			    mapa_gen.select("#"+this.id).style('stroke-width', 2)
				.style('stroke', 'purple')
			    // alert(cat+"|"+year+"|"+this.id+"|"+d3.event);
			    // alert(this);
			    show_prov_prog(cat,year,this.id);
			    show_prov_percent(cat,year,this.id);
			})
		    .on('mouseout',function(event)
			{
			    mapa_gen.select("#"+this.id).style('stroke-width', 1)
				.style('stroke', 'white')
			});
	    }
	}

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
	// alert(cat);
	var true_cat = cat.toLowerCase();
	var csv_file = "static/img/"+true_cat+"/genero/"+true_cat+"_por_provincia_y_genero.csv";
	// alert(csv_file);
	d3.csv(csv_file,
	       function(rows)
	       {
		   rows.map(function(d)
			    {
				// alert(d.Año+d.Provincia);
				// alert(d.Provincia+" "+path_to_provs[id]);
				if(d.Año == year && d.Provincia == path_to_provs[id]){
				    // alert("entering");
				    var all = (+d.F) + (+d.M);
				    var percent;
				    if(all > 0)
					percent = (d.F/all)*100;
				    else
					percent = 0;
				    actual_prov_percent_gen.text(d.Provincia + " " + truncate(percent,2)+"%");
				    return;
				}
			    });
	       });
    }

    function show_prov_prog(cat,year,id){
	// alert(cat);
	// prog_prov_gen.html("");

	// prog_prov_percent_gen.html("");

	// var prov = path_to_provs[id];

	// // var svg_xml_1 = years_partic['progresiones_porcentuales_provincias'][cat.toLowerCase()][prov];
	// // var svg_xml_2 = years_partic['progresiones_provincias'][cat.toLowerCase()][prov];

	// if(svg_xml_1){

	//     var svg_val_1 = "<svg height='290' width='330' viewBox='0 0 500 500'>"+svg_xml_1.documentElement.innerHTML+"</svg>";
	//     var svg_val_2 = "<svg height='290' width='330' viewBox='0 0 500 500'>"+svg_xml_2.documentElement.innerHTML+"</svg>";

	//     prog_prov_gen.html(svg_val_1);
	//     prog_prov_percent_gen.html(svg_val_2);

	// }
	// else{
	//     prog_prov_gen.append("div")
	// 	.attr("class","prog-prov")
	// 	.html("<strong>"+prov+"</strong>: provincia sin "+
	// 	      cat.toLowerCase()+" femeninos en ningún año.");
	// }
    }


    function show_national_progression(cat,year){
	// prog_nac_gen.html("");
	// var svg_prog = years_partic['progresiones_nacionales'][cat.toLowerCase()].documentElement.innerHTML;
	// var svg_val = "<svg height='290' width='330' viewBox='0 0 500 500'>"+svg_prog+"</svg>";
	// prog_nac_gen.html(svg_val);
    }

    add_years("Clasificados");
    cat_list_gen.property("value","Clasificados");
    update_svg_gen("Clasificados",1998);
}
