//cargando el svg inicial
var svg_file1 = "Blank_Argentina_Map_color.svg";

d3.xml(svg_file1, "image/svg+xml", function(xml)
       {
	   document.body.appendChild(xml.documentElement);	
       });

var svg_node = d3.select("svg");

var button_node = d3.select("button");

var input_node = d3.select("input"); 

var n_provinces = 44;

var div1 = d3.select("body")
    .attr("class","map")
    .append("div")   
    .attr("class", "tooltip3");
 
var xml_array = [];	
	
var play_label = "Animar";

button_node.on('click',function()
	{
		for(var j=1998;j<2015;j++)
		{
			update_svg(j,"button");
		}
	});
	
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

function update_svg(year,caller)
{
    //actualizando label
    d3.select("#year-value").text(year);
    d3.select("#year").property("year", year);
    div1.style('display', 'none');
    
    //leyendo archivo svg correspondiente al año
    var svg = "clasificados/mapa"+year+".svg";
	    
	d3.xml(svg,"image/svg+xml", function(xml)
	   {
			if (caller == "button")
			{
				// alert("entering");
				input_node.transition().delay(1000).duration(200).attr("class","inputt");
				// alert("after styling");
			}   
			
			for(i = 0; i < n_provinces; i++){
		   
			//actualizando los colores
			path = d3.selectAll("path")[0][i];
		   
			d3.select(path).transition().style('fill',xml.documentElement.getElementById(path.id).style.fill);
		   
			//asociando el tooltip por provincia y año
			d3.select(path).on('mouseenter',function(event)
				      {
					  tooltip(year,this.id,d3.event);
				      }).on('mouseout',function(event)
					    {
						d3.select("#"+this.id).style('stroke-width', 1)
						    .style('stroke', 'white');
					    });
			}
			xml_array.push(xml);
			//actualizando slider "input"
			input_node.property	("value",year);
	   });
}