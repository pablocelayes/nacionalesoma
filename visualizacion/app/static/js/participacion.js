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


        var causes = ["wounds", "other", "disease"];

        var parseDate = d3.time.format("%m/%Y").parse;

        var margin = {top: 20, right: 50, bottom: 30, left: 20},
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        var x = d3.scale.ordinal()
            .rangeRoundBands([0, width]);

        var y = d3.scale.linear()
            .rangeRound([height, 0]);

        var z = d3.scale.category10();

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .tickFormat(d3.time.format("%b"));

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("right");

        var svg = d3.select("#tooltip").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var crimea = [
            {'date':parseDate('4/1854'), 'total':	8571,'disease':	1,'wounds':	0,'other':	5},
            {'date':parseDate('5/1854'),'total':	23333,'disease':	12,'wounds':	0,'other':	9},
            {'date':parseDate('6/1854'),'total':	28333,'disease':	11,'wounds':	0,'other':	6},
            {'date':parseDate('7/1854'),'total':	28772,'disease':	359,'wounds':	0,'other':	23},
            {'date':parseDate('8/1854'),'total':	30246,'disease':	828,'wounds':	1,'other':	30},
            {'date':parseDate('9/1854'),'total':	30290,'disease':	788,'wounds':	81,'other':	70},
            {'date':parseDate('10/1854'),'total':	30643,'disease':	503,'wounds':	132,'other':	128},
            {'date':parseDate('11/1854'),'total':	29736,'disease':	844,'wounds':	287,'other':	106},
            {'date':parseDate('12/1854'),'total':	32779,'disease':	1725,'wounds':	114,'other':	131},
            {'date':parseDate('1/1855'),'total':	32393,'disease':	2761,'wounds':	83,'other':	324},
            {'date':parseDate('2/1855'),'total':	30919,'disease':	2120,'wounds':	42,'other':	361},
            {'date':parseDate('3/1855'),'total':	30107,'disease':	1205,'wounds':	32,'other':	172},
            {'date':parseDate('4/1855'),'total':	32252,'disease':	477,'wounds':	48,'other':	57},
            {'date':parseDate('5/1855'),'total':	35473,'disease':	508,'wounds':	49,'other':	37},
            {'date':parseDate('6/1855'),'total':	38863,'disease':	802,'wounds':	209,'other':	31},
            {'date':parseDate('7/1855'),'total':	42647,'disease':	382,'wounds':	134,'other':	33},
            {'date':parseDate('8/1855'),'total':	44614,'disease':	483,'wounds':	164,'other':	25},
            {'date':parseDate('9/1855'),'total':	47751,'disease':	189,'wounds':	276,'other':	20},
            {'date':parseDate('10/1855'),'total':	46852,'disease':	128,'wounds':	53,'other':	18},
            {'date':parseDate('11/1855'),'total':	37853,'disease':	178,'wounds':	33,'other':	32},
            {'date':parseDate('12/1855'),'total':	43217,'disease':	91,'wounds':	18,'other':	28},
            {'date':parseDate('1/1856'),'total':	44212,'disease':	42,'wounds':	2,'other':	48},
            {'date':parseDate('2/1856'),'total':	43485,'disease':	24,'wounds':	0,'other':	19},
            {'date':parseDate('3/1856'),'total':	46140,'disease':	15,'wounds':	0,'other':	35},
        ]

        var layers = d3.layout.stack()(causes.map(function(c) {
            return crimea.map(function(d) {
                return {x: d.date, y: d[c]};
            });
        }));

        x.domain(layers[0].map(function(d) { return d.x; }));
        y.domain([0, d3.max(layers[layers.length - 1], function(d) { return d.y0 + d.y; })]).nice();

        var layer = svg.selectAll(".layer")
            .data(layers)
            .enter().append("g")
            .attr("class", "layer")
            .style("fill", function(d, i) { return z(i); });

        layer.selectAll("rect")
            .data(function(d) { return d; })
            .enter().append("rect")
            .attr("x", function(d) { return x(d.x); })
            .attr("y", function(d) { return y(d.y + d.y0); })
            .attr("height", function(d) { return y(d.y0) - y(d.y + d.y0); })
            .attr("width", x.rangeBand() - 1);

        svg.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "axis axis--y")
            .attr("transform", "translate(" + width + ",0)")
            .call(yAxis);

        function type(d) {
            d.date = parseDate(d.date);
            causes.forEach(function(c) { d[c] = +d[c]; });
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
