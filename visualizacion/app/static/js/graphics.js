/* Funciones solo para la generación de gráficos en forma svg */

function barchart(tooltip_node,prog_prov){
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
