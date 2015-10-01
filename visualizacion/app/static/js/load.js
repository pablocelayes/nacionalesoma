// var actual_tab = 1;
// var format_tab = "#section-";

// var ntabs = 5;

// function next_tab(n){
	// return n%ntabs + 1; 
// }

// function prev_tab(n){
	// if(n>1)
		// return n-1;
	// return ntabs;
// }

// function section(i){
	// return format_tab+i;
// }

// var prev = d3.select("#prev_tab");
// var next = d3.select("#next_tab");

// prev.attr("href",section(prev_tab(actual_tab)))
// next.attr("href",section(next_tab(actual_tab)))

// prev.on("click",function()
				// {
					// actual_tab = prev_tab(actual_tab);
					// prev.attr("href",section(prev_tab(actual_tab)));
					// next.attr("href",section(next_tab(actual_tab)))
					// // alert(actual_tab);	
				// });

// next.on("click",function()
				// {
					// actual_tab = next_tab(actual_tab);
					// prev.attr("href",section(prev_tab(actual_tab)));
					// next.attr("href",section(next_tab(actual_tab)));
					// // window.open(section(actual_tab));
					// // alert(actual_tab);
				// });				

function load_all_vis(){
	update_svg(1998);
	add_years("Clasificados");
	cat_list_gen.property("value","Clasificados");
}