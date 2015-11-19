function begin_participacion(){
    var provinces = 
    ["Buenos Aires",
     "Catamarca",
     "Chaco",
     "Chubut",
     "Ciudad Autónoma de Buenos Aires",
     "Corrientes",
     "Córdoba",
     "Entre Ríos",
     "Formosa",
     "Jujuy",
     "La Pampa",
     "La Rioja",
     "Mendoza",
     "Misiones",
     "Neuquén",
     "Río Negro",
     "Salta",
     "San Juan",
     "San Luis",
     "Santa Cruz",
     "Santa Fe",
     "Santiago del Estero",
     "Tierra del Fuego",
     "Tucumán"
    ];

	var mini_svgs;
	var completos_svgs;
	
	var svg_objects = {'mini':[],'completo':[]};
	
    function fill_svg_objects(){
    var svg = "/static/img/plots/poblacion_escolar/"
    for (var i = 0; i < provinces.length; i++) 
    {
            d3.xml(svg+provinces[i].replace(/\s/g, '_')+".svg","image/svg+xml", 
           function(xml)
           {
               svg_objects['mini'].push(xml);
               if(svg_objects['mini'].length == 24)
               // ya se han cargado todos los svgs      
               {
               mini_svgs = to_svg_provinces('mini');
               }
           });
    } 
    for (var j = 0; j < provinces.length; j++)
    {
    		d3.xml(svg+provinces[j].replace(/\s/g, '_')+"-completo.svg"
	   ,"image/svg+xml", 
	   function(xml)
	   {
		   svg_objects['completo'].push(xml);
		   if(svg_objects['completo'].length == 24)
		   // ya se han cargado todos los svgs      
		   {
		   completos_svgs = to_svg_provinces('completo');
		   return init_participacion(mini_svgs,completos_svgs);
		   }
	   });

	
    }
	}	
    
    function to_svg_provinces(type){
        var res = {};
        for (var i = 0; i < provinces.length; i++)
        {
            res[provinces[i]] = svg_objects[type][i];
        }
        return res;
    }
	
	fill_svg_objects();
}
