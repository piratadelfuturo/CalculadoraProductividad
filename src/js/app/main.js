requirejs.config(
        {
            paths: {
                "underscore": "../libs/underscore",
                "bootstrap": "../libs/bootstrap",
                "jquery": "../libs/jquery-2.1.0",
                "backbone": "../libs/backbone"
            },
            shim: {
                "underscore": {
                    exports: "_"
                },
                "bootstrap": {
                    deps: ["jquery"],
                    exports: "$.fn.popover"
                },
                "backbone": {
                    deps: ["underscore", "jquery"],
                    exports: "Backbone"
                },
                "jquery": {
                    exports: '$'
                }
            }
        });



require(['jquery', '../models/PersonaCalculadora'], function($, PersonaCalculadora) {
    var hoja3 = [];
    var hoja3Sectores = [];
    var promedio = [];
    
    var hoja3Request = $.ajax({url: '/data/personas/hoja3',dataType: 'text'});
    var hoja3SectoresRequest = $.ajax({ url: '/data/personas/sectores_hoja3', dataType: 'text'});
    $.when( hoja3SectoresRequest, hoja3Request ).done(function(s,d){     
            _.each(d[0].split("\n"),function(row){
                row = _.map(row.split("\t"),function(x){return parseFloat(x)});
                hoja3.push(row);
            });
            var counter = 0;
            _.each(s[0].split("\n"),function(row){
                hoja3Sectores.push(row);
                var row = [];
                for(var y=0;y<=5;y++){ 
                    row[y] = 0;
                    for(var x=0;x<=3;x++){
                        var value = parseFloat(hoja3[counter][(x*6)+y]);
                        row[y] += parseFloat(hoja3[counter][(x*6)+y]);
                    }
                    row[y] = row[y]/3;
                }
                promedio.push(row);
            });         
    });
    
    var x = new PersonaCalculadora();
});