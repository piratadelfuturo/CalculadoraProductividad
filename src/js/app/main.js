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



require(['jquery', '../views/PersonaCalculadoraView'], function($, PersonaCalculadoraView) {
    var x = new PersonaCalculadoraView({
        el : $('#calculadora_base')        
    });
});