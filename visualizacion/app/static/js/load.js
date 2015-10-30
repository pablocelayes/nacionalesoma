ntabs = 4

function next_tab(n){
	if(n<ntabs-1)
		return n+1;
	return 0;
}

function prev_tab(n){
	if(n>0)
		return n-1;
	return ntabs-1;
}

prev = d3.select("#prev_tab");
next = d3.select("#next_tab");

the_tabs = d3.select("#tabs").select("nav")
							 .select("ul")
							 .selectAll("li");
							 
the_contents = d3.select(".content").selectAll("section");							 

prev.on("click",function(){update_tabs(prev_tab(current_tab()))});
next.on("click",function(){update_tabs(next_tab(current_tab()))});
							 
function current_tab(){
	for(i=0;i<the_tabs[0].length;i++){
		if (the_tabs[0][i].className != "")
			return i;
	}
}

function update_tabs(j){
	// alert(j);
	for(i=0;i<the_tabs[0].length;i++){
		if (i!=j){
			the_tabs[0][i].className = "";
			the_contents[0][i].className = "";
		}	
		else{
			the_tabs[0][i].className = "tab-current"; 	
			the_contents[0][i].className = "content-current";
		}		
	}
}							 



function load_all_vis(){
	// update_svg(1998,null,"cantidad");
	filtrar_poblacion_esc(1998,f_click_pob_esc);
	mapa_node.style("display","block");	
	add_years("Clasificados");
	cat_list_gen.property("value","Clasificados");
}
