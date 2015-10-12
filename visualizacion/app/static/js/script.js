//cargando el svg inicial
var svg_file1 = "static/img/clasificados/mapa1998.svg";

d3.xml(svg_file1, "image/svg+xml", function(xml){
    document.getElementById("mapa").appendChild(xml.documentElement);		  
});

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
var gini = d3.select("#gini"); 
var form = d3.select("#sender");
var input_cantidad = d3.select("#cant");
var input_pob_esc = d3.select("#pob_esc");

input_node.property("value",1998);
tooltip_node.attr("class", "tooltip1");

function year_to_server(){
		// $.post("/update",{year: year_title.property("year")},
				// function(data,status){alert(status);});
		$.post("/index",{year: year_title.property("year")},
				function(data,status){alert(status);});
}
input_pob_esc.on("click",function(){year_to_server()});
// input_cantidad.on("click",function()
						// {
							// function (){
								// if(input_form_selected != "cantidad")
								// {
									// input_form_selected = "cantidad";
									// update_svg(year_title.property("year"))
								// }
							// }
						// });

var svg_array = [];

function fill_svg_array(){
    var svg = "static/img/clasificados/mapa"
    for (var i = 1998; i < 2015; i++) 
    {
	d3.xml(svg+i+".svg","image/svg+xml", function(xml)
	       {
		   svg_array.push(xml);
	       })
    }	
}

fill_svg_array();	


//asociaciones....
input_node.on("input", function(){update_svg(+this.value);});
gini.on("mouseenter",function(){gini.attr("class","any");});
gini.on("mouseout",function(){gini.attr("class","nany");});
gini.on("click",function(){window.open("static/img/bokeh/gini.html");});					
	
function tooltip(year,id,event)				
{
    d3.select("#"+id).style('stroke-width', 2)
	.style('stroke', 'steelblue');
    
    var html_str = "<p><b>Año:</b> "+year+"</p>"+
	"<p><b>Provincia:</b> "+path_to_provs[id]+"</p>";
    
    var prov = path_to_provs[id];
    
    if(prov != undefined){
	prov = prov.replace(/\s/g, '_');
	
	tooltip_node.html("");				//para evitar que "crezca" el tooltip
	
	d3.csv("static/img/clasificados/provcounts.csv",function(rows)
	       {
		   rows.map(function(d)
			    {
				if(d.Año == year && d.Provincia == path_to_provs[id]){
				    html_str += "<p>"+d.Cantidad+" clasificado(s)</p>";
				}
			    });
	       });

	
	d3.csv("static/img/aprobados/provcounts.csv",function(rows)
	       {
		   rows.map(function(d)
			    {
				if(d.Año == year && d.Provincia == path_to_provs[id]){
				    // alert(d.Provincia);
				    html_str+="<p>"+d.Cantidad+" aprobado(s)</p>";	
				}
			    });
		   
		   tooltip_node.html(html_str+"<p>Progresión:"+
			     "<img align='left' height='140' src="+'static/img/plots/'+prov+".svg></img></p>")
		       .style('display', 'block');
	       });
    }  
}

function update_svg(año)
{
    // alert(año);
	//actualizando label
    d3.select("#year-title").text(" "+año);
    d3.select("#year").property("year", año);
    tooltip_node.style('display', 'none');
    
    //leyendo archivo svg correspondiente al año desde svg_array
    var paths = d3.selectAll("path");
    // alert(paths);
    
    for(var i = 0; i < n_paths; i++){
	
	var path = paths[0][i];
	// alert(svg_array.length);
	d3.select(path)
	    .transition()
	    .style('fill',svg_array[año - 1998].documentElement.getElementById(path.id).style.fill);
	    // alert(provincia);
	    d3.select(path).on('mouseenter',function(event)
			       {
				   tooltip(año,this.id,d3.event);
			       }).on('mouseout',function(event)
				     {
					 d3.select("#"+this.id).style('stroke-width', 1)
					     .style('stroke', 'white')
				     })
		.on('click',function(event)
		    {
			var provincia = path_to_provs[this.id];
			if(provincia != undefined){
			    provincia = provincia.replace(/\s/g, '_');
			    window.open("./static/img/plots/"+provincia+"-completo.svg");
			}
		  });
    }
}

function update_svg_dynamic(year,dat,input_form_selected){
	alert(dat);
}

update_svg(1998);