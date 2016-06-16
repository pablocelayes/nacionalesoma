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
	}
	return res;
    }

    function paint_svg(tooltip_node,prog_prov){

        var margin = {top: 20, right: 20, bottom: 30, left: 40},
            width = 460 - margin.left - margin.right,
            height = 200 - margin.top - margin.bottom;

        var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1);

        var y = d3.scale.linear()
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(10, "%");

        var data = [
            {'letter': 'A', 'frecuency': 0.08167},
            {'letter':'B', 'frequency':0.01492},
            {'letter':'C', 'frequency':0.02782},
            {'letter':'D', 'frequency':0.04253},
            {'letter':'E', 'frequency':0.12702},
            {'letter':'F', 'frequency':0.02288},
            {'letter':'G', 'frequency':0.02015},
            {'letter':'H', 'frequency':0.06094},
            {'letter':'I', 'frequency':0.06966},
            {'letter':'J', 'frequency':0.00153},
            {'letter':'K', 'frequency':0.00772},
            {'letter':'L', 'frequency':0.04025},
            {'letter':'M', 'frequency':0.02406},
            {'letter':'N', 'frequency':0.06749},
            {'letter':'O', 'frequency':0.07507},
            {'letter':'P', 'frequency':0.01929},
            {'letter':'Q', 'frequency':0.00095},
            {'letter':'R', 'frequency':0.05987},
            {'letter':'S', 'frequency':0.06327},
            {'letter':'T', 'frequency':0.09056},
            {'letter':'U', 'frequency':0.02758},
            {'letter':'V', 'frequency':0.00978},
            {'letter':'W', 'frequency':0.02360},
            {'letter':'X', 'frequency':0.00150},
            {'letter':'Y', 'frequency':0.01974},
            {'letter':'Z', 'frequency':0.00074},
        ];
        var svg = d3.select("#tooltip").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        x.domain(data.map(function(d) { return d.letter; }));
        y.domain([0, d3.max(data, function(d) { return d.frequency; })]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Frequency");

        svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.letter); })
            .attr("width", x.rangeBand())
            .attr("y", function(d) { return y(d.frequency); })
            .attr("height", function(d) { return height - y(d.frequency); });

        svg.selectAll(".bar2")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar2")
            .attr("x", function(d) { return x(d.letter); })
            .attr("width", x.rangeBand())
            .attr("y", function(d) { return y(d.frequency); })
            .attr("height", function(d,i) {
                debugger;
                return height - y(d.frequency-0.03);
            })
            .attr("fill-opacity",0.3);

        function type(d) {
            d.frequency = +d.frequency;
            return d;
        }

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
