//cargando el svg inicial,
var svg_file1 = "static/img/Blank_Argentina_Map.svg";
d3.xml(svg_file1,"image/svg+xml", function(xml){
    document.getElementById("mapa").appendChild(xml.documentElement);
});

var mapa_node = d3.select("#mapa");
// escondiendo el svg durante la carga de datos
mapa_node.style("display","none");

// map de paths en el archivo base svg a todas las provincias correspondientes
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

// función genérica para crear los grouped barchart mostrados en ambas vistas
function paint_svg(tooltip_node,prog_prov, categories, colors, title, y_max){

    var data = prog_prov.data;

    // definiendo dimensiones del svg a crear
    var margin = {top: 10, right: 150, bottom: 30, left: 35},
        width = 600 - margin.left - margin.right,
        height = 225 - margin.top - margin.bottom;

    // creando escalas para ejes y datos asociados
    var x0 = d3.scale.ordinal()
        .rangeRoundBands([0, width], 0.1);

    var x1 = d3.scale.ordinal();

    var y = d3.scale.linear()
        .range([height, 0]);

    var color = d3.scale.ordinal()
        .range(colors);

    // creando ejes
    var xAxis = d3.svg.axis()
        .scale(x0)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    // creación y asignación a una variable del svg contenido en 'tooltip_node'
    var svg = tooltip_node.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    // procesamiento de la data para su posterior visualización
    var cats = categories;

    data.forEach(function(d) {
        d.years = cats.map(function(name) { return {name: name, value: +d[name]}; });
    });                         // TODO: refinar estructura final algo redundante

    // ajustando dominios para las escalas definidas
    x0.domain(data.map(function(d) { return d.date; }));
    x1.domain(cats).rangeRoundBands([0, x0.rangeBand()]);
    y.domain([0, y_max]);

    // inserción de ejes en el gráfico
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + 5 + ",0)")
        .call(yAxis);

    // inserción de la data (años) en el eje x
    var state = svg.selectAll(".state")
        .data(data)
        .enter().append("g")
        .attr("class", "state")
        .attr("transform", function(d) { return "translate(" + x0(d.date) + ",0)"; });

    // inserción de la data en forma de barras (elementos 'rect' del svg)
    state.selectAll("rect")
        .data(function(d) { return d.years; })
        .enter().append("rect")
        .attr("width", x1.rangeBand())
        .attr("x", function(d) { return x1(d.name)+5; })
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); })
        .style("fill", function(d) { return color(d.name); });

    // adicion de la leyenda
    if (title) {
        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", 0)
            .attr("text-anchor", "middle")
            .style("font-size", "13px")
            .style("text-decoration", "underline")
            .text(title);
    }

}

// carga de la data desde el servidor
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

// llamada a las funciones con la data completa
function initialize_values(years_partic){
    var svg_map = d3.select('#svg2');
    svg_map.attr("transform","scale(0.75)");
    var paths = mapa_node.selectAll("path");
    // alert("in initialize_values: "+paths);
    init_participacion(years_partic,paths);
    init_generos(years_partic);
}

function init_participacion(years_partic,paths){

    // guardando selecciones en D3 de nodos necesarios
    // para visualizaciones
    var n_paths = 44;
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

    // Extracción de la data relativa a la progresión de una provincia
    // para mostrar en el gráfico del tooltip
    function get_province_prog(prov, data){
	var res = {'prog':prov,'data':[]};
        var axis_factor = 1000;
	for(var i=0;i<data.length;i++){
	    res.data.push(JSON.parse(data[i]).pob_esc[prov]);
            res.data[i].date = i+1998;
            var pob_esc = res.data[i]['Población'];
            // necesario para escalar valores indíce que son muy pequeños
            res.data[i]['Aprobados/Población'] = (res.data[i].Aprobados/pob_esc) * axis_factor;
            res.data[i]['Clasificados/Población'] = (res.data[i].Clasificados/pob_esc)* axis_factor;
	}
	return res;
    }

    //
    function tooltip(year,id,event,data)
    {
	d3.select("#"+id).style('stroke-width', 2)
	    .style('stroke', 'steelblue');

	var prov_name = path_to_provs[id];
	var data_json = JSON.parse(data[year-1998]).pob_esc;
	if(prov_name !== undefined){
	    prov = prov_name.replace(/\s/g, '_');
	    tooltip_node.html(""); //para evitar que "crezca" el tooltip
	    var svg_val;
	    var content;
	    var prog_prov = get_province_prog(prov_name,data);

            // TODO: encontrar la manera de hacer esto de forma más limpia en js (D3)
            // o abstraerlo en un template aparte
	    content = "<p><b>Año:</b> "+year+"</p>"+
	    	"<p><b>Provincia:</b> "+path_to_provs[id]+"</p>"+
	    	"<p><b>Poblabión escolar: </b>"+
	    	data_json[prov_name]['Población']+"</p>"+
                "<div class='my-legend row' style='margin-left:10px;'><div class='legend-title'></div>"+
                "<div class='legend-scale'>"+
                "<ul class='legend-labels'>"+
                "<li><span style='background:#E0B6B6;'></span>"+
                data_json[prov_name].Clasificados+" clasificados(s)</li>"+
                "<li><span style='background:#B79191;'></span>"+
                data_json[prov_name].Aprobados+" aprobado(s)</li>"+
                "</ul></div></div></br><div style='text-align:center;'><p>"+
                "Progresión respecto a población escolar</p>"+
                "<p style='font-size:14px;'>(por cada 10<sup>3</sup> alumnos)</p></div>";

            // limpiando cualquier dato y gráfico anterior
            tooltip_node.html(content);
            // creación del svg de la progresión de la provincia
            var categories = ["Clasificados/Población", "Aprobados/Población"];
            var colores = ["#E0B6B6", "#B79191"];
	    paint_svg(tooltip_node,prog_prov,categories,colores,[],0.6);
	    tooltip_node.style("display","block");
	}}

    // actualización del mapa de acuerdo al año escogido en el slider
    function update_svg(año)
    {
	d3.select("#year-title").text(" "+año);
	d3.select("#year").property("year", año);
	tooltip_node.style('display', 'none');
	var data_prov = JSON.parse(years_partic[año-1998]);

        // seteando los colores de cada provincia de acuerdo a
        // la data y los callbacks para cada tooltip por provincia

	for(var i = 0; i < n_paths; i++){

	    var path = paths[0][i];
	    if (path_to_provs[path.id] !== undefined){
		var fill;
		var prov = path_to_provs[path.id];
		var data_json = data_prov.pob_esc[prov];
		if(prov !== undefined){
		    fill = data_json.Color;
		}

	        d3.select(path)
		    .transition()
		    .style('fill',fill);
	        d3.select(path)
                    .on('mouseenter',function(event)
			           {
				       tooltip(año,this.id,
					       d3.event,years_partic);
			           }).on('mouseout',function(event)
				         {
					     d3.select("#"+this.id).style('stroke-width', 1)
					         .style('stroke', 'white');
				         })
		    .on('click',function(event)
		        {
                            // Mostrando svg del tooltip en una ventana parte
                            var provincia = path_to_provs[this.id];
			    if(provincia !== undefined){
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

        // mostrando el mapa una  vez que todo está cargado
	mapa_node.style("display","block");
    }

    update_svg(1998);
}
