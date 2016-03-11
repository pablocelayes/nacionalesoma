//cargando el svg inicial
var svg_file1 = "static/img/Blank_Argentina_Map.svg";
d3.xml(svg_file1,"image/svg+xml", function(xml){
    document.getElementById("mapa").appendChild(xml.documentElement);
});

var mapa_node = d3.select("#mapa");
mapa_node.style("display","none");

function initialize_values(years_partic){

    // console.log(years_partic);
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
	var res = {'prog':prov,'data':[]};
	for(var i=0;i<data.length;i++){
	    res['data'].push(JSON.parse(data[i])['pob_esc'][prov]);
	}
	return res;
    }

    function paint_svg(tooltip_node,prog_prov){

	var w_init = 500;
	var h_init = 200;
	var barPadding = 5;
	var width = 500,
	margin = 25,
	offset = 50,
	axisWidth = width - 2 * margin;

	var padding = 20;
	var shrink_factor = 100;

	var scale = d3.scale.linear();

	var svg = tooltip_node.append("svg")
	    .attr("id","svg_tooltip")
	    .attr("width", w_init)
	    .attr("height", h_init);

	scale.domain([0,d3.max(prog_prov['data'],
			       function(d){
				   return d['Índice'];
			       })]);

	h = h_init - shrink_factor;
	w = w_init - shrink_factor;

	scale.range([0,h]);

	scale.clamp();

	svg.append("g").attr("transform","translate(30,30)")
	    .selectAll("rect")
	    .attr("transform", "translate(20,20)")
	    .data(prog_prov['data'])
	    .enter()
	    .append("rect")
	    .attr("x", function(d, i) {
		return i * (w / prog_prov['data'].length);
	    })
	    .attr("y", function(d) {
		return h - scale(d['Aprobados']/d['Población']);
	    })
	    .attr("width", w / prog_prov['data'].length - barPadding)
	    .attr("height", function(d) {
		return scale(d['Aprobados']/d['Población'])
	    })
	    .attr("fill","#b79191");

	svg.append("g").attr("transform","translate(30,30)")
	    .selectAll("rect")
	    .attr("transform", "translate(20,20)")
	    .data(prog_prov['data'])
	    .enter()
	    .append("rect")
	    .attr("fill-opacity", 0.5)
	    .attr("x", function(d, i) {
		return i * (w / prog_prov['data'].length);
	    })
	    .attr("y", function(d) {
		return h - scale(d['Índice']);
	    })
	    .attr("width", w / prog_prov['data'].length - barPadding)
	    .attr("height", function(d) {
		return scale(d['Índice'])
	    })
	    .attr("fill","#e0b6b6");

	svg.append("g").attr("transform","translate(20,30)")
	    .append("line")
	    .attr({
		x1: 0,
		y1: 0,
		x2: 0,
		y2: h+10,
		stroke: "#CCC"
	    });

	svg.append("g").attr("transform","translate(20,30)")
	    .append("line")
	    .attr({
		x1: 0,
		y1: h+10,
		x2: w+20,
		y2: h+10,
		stroke: "#CCC"
	    });


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
			    var svg_node = d3.select("#svg_tooltip")[0][0];
			    console.log(svg_node);
			    var w = window.open();
			    w.document.body.appendChild(svg_node)
			}
		    });
	    }}
	mapa_node.style("display","block");
    }

    update_svg(1998);
}
