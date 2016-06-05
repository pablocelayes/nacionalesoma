//cargando el svg inicial
var svg_file1 = "static/img/Blank_Argentina_Map.svg";
d3.xml(svg_file1,"image/svg+xml", function(xml){
    document.getElementById("mapa").appendChild(xml.documentElement);
});

var mapa_node = d3.select("#mapa");
mapa_node.style("display","none");

function initialize_values(years_partic){
    var svg_map = d3.select('#svg2');
    svg_map.attr("transform","scale(0.75)");
    var paths = mapa_node.selectAll("path");
    // alert("in initialize_values: "+paths);
    participacion(years_partic,paths);
    init_generos(years_partic);
}

years_partic = [];

function get_year(year,last){
    d3.xhr("/update")
	.header("Content-Type", "application/x-www-form-urlencoded")
	.post("year="+year, function(error, data){
	    // callback
	    years_partic.push(data.response);
	    if(year == last){
		initialize_values(years_partic);
	    }
	});
}

function get_years(init,end){
    for(var i=init;i<end;i++){
	get_year(i,end-1);
    }
}

function participacion(years_partic,paths){
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
	return ["#edf8e9",
		"#c7e9c0",
		"#a1d99b",
		"#41ab5d",
		"#005a32"];}

    function update_legend(list){
	for(i=0;i<5;i++){
	    legend_node.selectAll("li")[0][i].style = "border-top-color:"+list[i]
	}
    }

    function get_province_prog(prov,data){
	var res = {'prog':prov,'data':[]};
	for(var i=0;i<data.length;i++){
	    res['data'].push(JSON.parse(data[i])['pob_esc'][prov]);
            res['data'][i]['Año'] = i+1998;
	}
	return res;
    }

    function paint_svg(tooltip_node,prog_prov){
        debugger;
        var svg = dimple.newSvg("#tooltip", "100%", "100%");
        var chart = new dimple.chart(svg, prog_prov['data']);
        chart.setBounds(60,20,300,330);
        var x = chart.addCategoryAxis("x", "Año");
        var y1 = chart.addMeasureAxis("y", "Clasificados");
        var y2 = chart.addMeasureAxis("y", "Aprobados");
        var bars = chart.addSeries("Aprobados", dimple.plot.bar, [x,y2]);
        var lines = chart.addSeries("Clasificados", dimple.plot.bar, [x,y1]);

        // Do a bit of styling to make it look nicer
        // lines.lineMarkers = true;
        // bars.barGap = 0.5;
        // // Colour the bars manually so they don't overwhelm the lines
        chart.assignColor("Unit Sales", "black", "black", 0.15);
        // chart.assignColor("Clasificados", "blue", "blue", 0.15);

        // x.dateParseFormat = "%m/%Y";
        // x.addOrderRule("Date");


        // Here's how you add a legend for just one series.  Excluding the last parameter
        // will include every series or an array of series can be passed to select more than
        // one
        // chart.addLegend(60, 5, 300, 10, "right", lines);
        chart.setBounds(75, 30, 330, 330);
        chart.draw();

        // Once Draw is called, this just changes the number format in the tooltips which for these particular
        // numbers is a little too heavily rounded.  I assume your real data isn't like this
        // so you probably won't want this line, but it's a useful tip anyway!
        //y1.tickFormat = ",d";
    }

    function tooltip(year,id,event,data)
    {
	d3.select("#"+id).style('stroke-width', 2)
	    .style('stroke', 'steelblue');

	var prov_name = path_to_provs[id];
	var data_json = JSON.parse(data[year-1998])['pob_esc']
	if(prov_name != undefined){
	    prov = prov_name.replace(/\s/g, '_');

	    tooltip_node.html(""); //para evitar que "crezca" el tooltip
	    var svg_val;
	    var content;
	    var prog_prov = get_province_prog(prov_name,data);
	    content = "<p><b>Año:</b> "+year+"</p>"+
	    	"<p><b>Provincia:</b> "+path_to_provs[id]+"</p>"+
	    	"<p><b>Poblabión escolar: </b>"+
	    	data_json[prov_name]['Población']+"</p>"+
	    	"<p>"+data_json[prov_name]['Clasificados']+" clasificados(s) <div class='min-square-clasif'></div></p>"+
	    	"<p>"+data_json[prov_name]['Aprobados']+" aprobado(s) <div class='min-square-aprob'></div></p>"+
	    	"<p>Progresión respecto a población escolar:</p>";

	    tooltip_node.html(content);

	    paint_svg(tooltip_node,prog_prov)
	    tooltip_node.style("display","block");
	}}

    function update_svg(año)
    {
	d3.select("#year-title").text(" "+año);
	d3.select("#year").property("year", año);
	tooltip_node.style('display', 'none');
	var data_prov = JSON.parse(years_partic[año-1998]);

	for(var i = 0; i < n_paths; i++){

	    var path = paths[0][i];
	    if (path_to_provs[path.id] != undefined){
		var fill;
		var prov = path_to_provs[path.id];
		var data_json = data_prov['pob_esc'][prov];
		if(prov != undefined){
		    fill = data_json['Color'];
		}


	    d3.select(path)
		.transition()
		.style('fill',fill);
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
			    var svg_node = d3.select("#svg_tooltip");
			    var w = d3.select(window.open().document.body);
			    w.append('svg')
				.attr("width", 500)
				.attr("height", 400)
				.html(svg_node.html());
			}
		    });
	    }}
	mapa_node.style("display","block");
    }

    update_svg(1998);
}
