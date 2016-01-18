var mapa_node = d3.select("#mapa");
mapa_node.style("display","none");
//cargando el svg inicial
var svg_file1 = "static/img/Blank_Argentina_Map.svg";

d3.xml(svg_file1,"image/svg+xml", function(xml){
document.getElementById("mapa").appendChild(xml.documentElement);		  
});


//cargando data provincias 
//1) para mapas por años

years_partic = [];

function get_years(init,end){
	for(var i=init;i<end;i++){
		d3.xhr("/update")
			.header("Content-Type", "application/x-www-form-urlencoded")
			.post("year="+i, function(error, data){
				// callback
				years_partic.push(data.response);
				
			});
	}
} 

get_years(1998,2015);
