//cargando el svg inicial
var svg_file1 = "static/img/Blank_Argentina_Map.svg";
d3.xml(svg_file1,"image/svg+xml", function(xml){
    document.getElementById("mapa").appendChild(xml.documentElement);
});

var mapa_node = d3.select("#mapa");
mapa_node.style("display","none");

function colores_participacion(n) {
    var colores = ["#B79191", "#E0B6B6"];
    return colores[n % colores.length];
}

function paint_svg(tooltip_node,prog_prov, categories, f_colors, title){

    var data = prog_prov['data'];

    var parseDate = d3.time.format("%Y").parse;

    var margin = {top: 30, right: 150, bottom: 30, left: 20},
        width = 600 - margin.left - margin.right,
        height = 225 - margin.top - margin.bottom;

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width]);

    var y = d3.scale.linear()
        .rangeRound([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickFormat(d3.time.format('%Y'));

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var svg = tooltip_node.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    if (title) {
        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("text-decoration", "underline")
            .text(title);
    }

    var layers = d3.layout.stack()(categories.map(function(c) {
        return data.map(function(d) {
            return {x: parseDate('' + d.date),
                    y: d[c]};
        });
    }));

    x.domain(layers[0].map(function(d) { return d.x; }));
    y.domain([0, d3.max(layers[layers.length - 1], function(d) { return d.y0 + d.y; })]).nice();

    var layer = svg.selectAll(".layer")
        .data(layers)
        .enter().append("g")
        .attr("class", "layer")
        .style("fill", function(d, i) { return f_colors(i); });

    layer.selectAll("rect")
        .data(function(d) { return d; })
        .enter().append("rect")
        .attr("x", function(d) { return x(d.x) + 12; })
        .attr("y", function(d) { return y(d.y + d.y0); })
        .attr("height", function(d) { return y(d.y0) - y(d.y + d.y0); })
        .attr("width", x.rangeBand() - 1);

    svg.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(10," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "axis axis--y")
        .attr("transform", "translate(" + 15 + ",0)")
        .call(yAxis);

    function type(d) {
        d.date = parseDate(d.date);
        categories.forEach(function(c) { d[c] = +d[c]; });
        return d;
    }

}


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

    function get_province_prog(prov, data){
	var res = {'prog':prov,'data':[]};
        var axis_factor = 1000; // Sería inverso en el eje...
	for(var i=0;i<data.length;i++){
	    res['data'].push(JSON.parse(data[i])['pob_esc'][prov]);
            res['data'][i]['date'] = i+1998;
            var pob_esc = res['data'][i]['Población'];
            res['data'][i]['Aprobados/Población'] = (res['data'][i]['Aprobados']/pob_esc) * axis_factor;
            res['data'][i]['Clasificados/Población'] = (res['data'][i]['Clasificados']/pob_esc)* axis_factor;
	}
	return res;
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
                "<div class='my-legend row' style='margin-left:10px;'><div class='legend-title'></div>"+
                "<div class='legend-scale'>"+
                "<ul class='legend-labels'>"+
                "<li><span style='background:#B79191;'></span>"+
                data_json[prov_name]['Clasificados']+" clasificados(s)</li>"+
                "<li><span style='background:#E0B6B6;'></span>"+
                data_json[prov_name]['Aprobados']+" aprobado(s)</li>"+
                "</ul></div></div></br><div style='text-align:center'>Progresión respecto a población escolar (*10<sup>-3</sup>)</div>";

	    tooltip_node.html(content);
            var categories = ["Clasificados/Población", "Aprobados/Población"];
	    paint_svg(tooltip_node,prog_prov,categories,colores_participacion,[]);
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
			        var svg_node = d3.select("#tooltip");
			        var w = d3.select(window.open().document.body);
                                w.append('svg') // TODO: ver como pasarle los estilos como el svg "padre"
                                    .attr("transform", "translate(30,30)")
				    .attr("width", 600)
				    .attr("height", 400)
				    .html(svg_node.html());
			    }
		        });
	    }}
	mapa_node.style("display","block");
    }

    update_svg(1998);
}
