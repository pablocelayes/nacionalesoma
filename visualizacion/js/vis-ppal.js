var vis_cantidad = d3.select("#cantidad");
var vis_gini = d3.select("#gini");



vis_cantidad.on("mouseenter",function(event){mouse_enter_iframe(this.id)});
vis_cantidad.on("mouseout",function(event){mouse_over_iframe(this.id)});

vis_gini.on("mouseenter",function(event){mouse_enter_iframe(this.id)});
vis_gini.on("mouseout",function(event){mouse_over_iframe(this.id)});


function the_other(id){
	if(id=="gini")
		return vis_cantidad;
	return vis_gini;
};


function self(id){
	if(id=="gini")
		return vis_gini;
	return vis_cantidad;
}

function mouse_enter_iframe(id){
	the_other(id).style("display","none");
}

function mouse_over_iframe(id){
//	alert(id);
	the_other(id).style("display","block");
}