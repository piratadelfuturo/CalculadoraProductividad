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



require(['../models/PersonaCalculadora'], function(PersonaCalculadora) {
        /*
         $.ajax({
         url: '/data/personas/hoja5.csv',
         success: function(e) {
         console.log(e.split("\r"));
         },
         dataType: 'text'
         });
         */
        var x = new PersonaCalculadora();
});