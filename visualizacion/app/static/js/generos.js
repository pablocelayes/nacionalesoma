// Cargando inicialmente el mapa del año 1998, generado previamente con matplotlib
var svg_file1 = "static/img/clasificados/genero/mapa1998.svg";

d3.xml(svg_file1, "image/svg+xml", function(xml){
    var elem = document.getElementById("mapa");
    elem.innerHTML = "";
    elem.appendChild(xml.documentElement);
});

// función principal
function init_generos(years_partic){

    // guardando selecciones en D3 de nodos necesarios
    // y otras variables a usar
    var n_paths = 44;
    var cat_selected = "Clasificados";
    var initial_year = 1998;

    var cat_list_gen = d3.select("#cat_listbox_gen");
    var year_label_gen = d3.select("#year_label_gen");
    var year_list_gen = d3.select("#year_range_gen");
    var year_title_gen = d3.select("#year_gen");
    var cat_title_gen = d3.select("#categoria_gen");
    var prog_prov_gen = d3.select("#prog_prov_gen");

    var prog_nac_gen = d3.select("#prog_nac_gen");
    prog_nac_gen.attr("border-spacing","20px"); //TODO el padding

    var actual_prov_gen = d3.select("#prov_gen");
    var actual_prov_percent_gen = d3.select("#percent_gen");
    var prog_prov_percent_gen = d3.select("#prog_prov_percent_gen");
    var mapa = d3.select("#mapa");


    var gris = "#dcdcdc";        //valor neutro rgb(220,220,220)
    var celeste = "#6496ff";         //todos masculinos = "rgb(100,150,255)"
    var rosa = "#ff6496";        //todos femeninos =  "rgb(255,100,150)"
    var purpura = "#800080";

    //colores desde el más celeste hasta el más rosa

    var colores = ["#6496ff","#7da7ff","#96b8ff","#b0c9ff","#c9dbff",
           "#ffc9db","#ffb0c9","#ff96b8","#ff7da7","#ff6496"];

    cat_list_gen.on("change", function(){add_years(this.value);});
    year_list_gen.on("input", function(){add_svg(+this.value);});

    // funcion que actualiza los valores del mapa, año y mapa
    // de acuerdo a la categoría elegida
    function add_years(cat){
        prog_prov_gen.html("");
        actual_prov_gen.html("");
        actual_prov_percent_gen.html("");
        cat_title_gen.text(cat);
        year_title_gen.text(initial_year);
        year_list_gen.property("value", initial_year);
        year_label_gen.text(" " + initial_year);
        update_svg_gen(cat, initial_year);
        cat_selected = cat;
    }

    // funcion que actualiza los valores del mapa, año y mapa
    // de acuerdo a la año elegido
    function add_svg(year){
        actual_prov_gen.html("");
        actual_prov_percent_gen.html("");
        year_title_gen.text(year);
        year_label_gen.text(" "+year);
        update_svg_gen(cat_selected, year);
    }

    // función que determina el color a mostrar
    // de acuerdo a la cantidad de ambos sexos pasadas
    // por parámetro
    function color_picker(f_count,m_count) {
        if((f_count == m_count) && (f_count > 0))
            return purpura;
        if((f_count == m_count) && (f_count === 0))
            return gris;
        if(f_count === 0)
            return celeste;
        if(m_count === 0)
            return rosa;
        var index = Math.floor((10*f_count)/(m_count+f_count));
        return colores[index];
    }

    // devuelve la data global necesaria para visualizar
    // en esta vista a partir de la data recibida desde el server
    function process_data_gen(years_partic) {
    var res = [];
        for(var i=0;i<years_partic.length;i++){
            res.push(JSON.parse(years_partic[i]).genero);
        }
        return res;
    }

    var global_data = process_data_gen(years_partic);

    // Extracción de la data relativa a la progresión de una provincia
    // por géneros de la categoría seleccionada
    // para mostrar en el gráfico del tooltip
    function get_data_prov_gen(global_data,prov,cat) {
        var res = {'prog':prov,'data':[]};
            var empty_data = true;
        for(var i=0;i<global_data.length;i++){
                var entry = global_data[i][cat][prov];
            res.data.push(entry);
                res.data[i].date = i+1998;
                if (entry.F + entry.M > 0) {
                    empty_data = false;
                }
        }
        if (empty_data) {
            return undefined;
        }
        else {
            return res;
        }
    }

    // Extracción de la data relativa a la progresión nacional por géneros
    // de la categoría seleccionada para mostrar en el gráfico del tooltip
    function get_data_nacional_gen(cat,global_data){
        var res = {'country':'AR','data':[]};
        for(var i=0;i<global_data.length;i++){
            var year_data = global_data[i][cat];
            var f = 0;
            var m = 0;
            for(var prov in year_data){
                f += year_data[prov].F;
                m += year_data[prov].M;
            }
            res.data.push({'date':i+1998,
                              'F':f,
                              'M':m});
        }
        return res;
    }

    // actualización del mapa de acuerdo al año escogido en el slider
    function update_svg_gen(cat,year){
        var data_json = JSON.parse(years_partic[year-1998]).genero;
        show_national_progression(cat);
        var paths = mapa.selectAll("path");
        // adicionando tooltip a todas las provincias ...
        for(var i = 0; i < n_paths; i++){
            var path = paths[0][i];
            // alert(path);
            if (path_to_provs[path.id] !== undefined){
            var fill;
            var prov = path_to_provs[path.id];
            var data_prov = data_json[cat][prov];
            if(prov !== undefined){
                var f_count = data_prov.F;
                var m_count = data_prov.M;
                fill = color_picker(f_count,m_count);
            }

                    d3.select(path)
                .transition()
                .style('fill',fill);
            d3.select(path)
                .on('mouseenter',function(event) {
                mapa.select("#"+this.id).style('stroke-width', 2)
                    .style('stroke', 'purple');
                show_prov_prog(cat,year,this.id);
                show_prov_percent(cat,year,this.id);
                })
                .on('mouseout',function(event) {
                mapa.select("#"+this.id).style('stroke-width', 1)
                    .style('stroke', 'white');
                });
            }
        }
    }

    // funciones para mostrar los valores porcentuales en la forma más adecuada
    // Nota: probablemente haya una forma mejor y más corta de hacer esto
    function f_part(x){
        return x - Math.floor(x);
    }

    function take_decimals(x,n){
        return Math.floor(x*Math.pow(10,n));
    }

    function truncate(x,n){
        return +(Math.floor(x)+"."+(take_decimals(f_part(x),n)));
    }

    // función que calcula y muestra el porcentaje
    function show_prov_percent(cat,year,id){
        var prov = path_to_provs[id];
        var data_json = JSON.parse(years_partic[year-1998]).genero;
        var data_prov = data_json[cat][prov];
        var f = data_prov.F;
        var m = data_prov.M;
        var percent;
        var all = f + m;
        if(all > 0)
            percent = (f/all)*100;
        else
            percent = 0;
        actual_prov_percent_gen.text(prov + " " +truncate(percent,2)+"%");
    }

    // función para crear  el tooltip de progresión provincial de géneros
    function show_prov_prog(cat,year,id){
        var prov = path_to_provs[id];
        var title = "Progresión anual de "+cat+" por género de "+prov;
        prog_prov_gen.append("div")
        .attr("class","prog-prov")
        .html("<strong>"+prov+"</strong>: provincia sin "+
          cat.toLowerCase()+" femeninos en ningún año.");
        prog_prov_gen.html("");
        var prov_cat_data = get_data_prov_gen(global_data,prov,cat);
        var categories = ["F","M"];
        var colores = ["#ff6496", "#6496ff"];
        if (prov_cat_data) {
            paint_svg(prog_prov_gen,prov_cat_data,categories,colores,title,250);
        }
        else {
        prog_prov_gen.append("div")
        .attr("class","prog-prov")
        .html("<strong>"+prov+"</strong>: <p>provincia sin "+
              cat.toLowerCase()+" en ningún año.</p>");
        }
    }

    // función para crear  el tooltip de progresión nacional de géneros
    function show_national_progression(cat){
        var title = "Progresión nacional anual de "+cat;
        prog_nac_gen.html("");
        var prog_nac_data = get_data_nacional_gen(cat,global_data);
        var categories = ["F","M"];
        var colores = ["#ff6496", "#6496ff"];
        paint_svg(prog_nac_gen,prog_nac_data,categories,colores,title,500);
    }

    add_years("Clasificados");
    cat_list_gen.property("value","Clasificados");
    update_svg_gen("Clasificados", 1998);
}
