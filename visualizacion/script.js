//cargando el svg inicial
var svg_file1 = "Blank_Argentina_Map_color.svg";

d3.xml(svg_file1, "image/svg+xml", function(xml)
       {
	   document.body.appendChild(xml.documentElement);	
       });
	   

var input_node = d3.select("input"); 
	input_node.property	("value",1998); 

var n_provinces = 44;

var div1 = d3.select("body")
    .attr("class","map")
    .append("div")   
    .attr("class", "tooltip3");
	
var div2 = d3.select("#chart");
 
var svg_array = [];
// var csv_array = [];

function fill_svg_array(){
	var svg = "clasificados/mapa"
	for (var i = 1998; i < 2015; i++) 
	{
		d3.xml(svg+i+".svg","image/svg+xml", function(xml)
		{
			svg_array.push(xml);
		})
	}	
}

fill_svg_array()
	
var play_label = "Animar";
	
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
	   
//asociando el slider al mapa...
d3.select("#year").on("input", function(){update_svg(+this.value,"input");});

function tooltip(year,id,event)
{
    d3.select("#"+id).style('stroke-width', 2)
	.style('stroke', 'steelblue');
    d3.csv("clasificados/provcounts.csv",function(rows)
	   {
	       rows.map(function(d)
			{
			    // div2.html("Progressión of province of "+ d.Provincia+":"+rows);
				if(d.Año == year && d.Provincia == path_to_provs[id]){
				div1.html("<p><b>Año:</b> "+d.Año+"</p>"+
					  "<p><b>Provincia:</b> "+d.Provincia+"</p>"+
					  "<p>"+d.Cantidad+" clasificados</p>")
				    .style('top',  event.pageY + 'px')
				    .style('left', event.pageX + 'px')
				    .style('display', 'block');
			    }
			});
	   });
    
}

function update_svg(año,caller)
{
	// "use strict";
	// alert(typeof año);
	// alert(year);
	//actualizando label
	// input_node.property	("value",año);  
	d3.select("#year-value").text(año);
    d3.select("#year").property("year", año);
    div1.style('display', 'none');
    
	//leyendo archivo svg correspondiente al año desde svg_array
	var paths = d3.selectAll("path");
	
	for(var i = 0; i < n_provinces; i++){
		
		var path = paths[0][i];
		// alert(año - 1998);
		d3.select(path)
		  .transition()
		  .style('fill',svg_array[año - 1998].documentElement.getElementById(path.id).style.fill);
		
		if (caller == "input")
		{
		  // alert(path);
		  d3.select(path).on('mouseenter',function(event)
		  {
		  tooltip(año,this.id,d3.event);
		  }).on('mouseout',function(event)
			{
			d3.select("#"+this.id).style('stroke-width', 1)
				.style('stroke', 'white');
			})
			.on('click',function(){window.open("bokeh/gini.html");})
		}
		

	}
}