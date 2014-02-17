requirejs.config(
        {
            paths: {
                "underscore": "../libs/underscore",
                "bootstrap": "../libs/bootstrap.min",
                "jquery": "../libs/jquery-2.1.0.min",
                "backbone": "../libs/backbone-min",
                "gagauge": "../libs/gagauge",
                "mexico_paths": "../libs/mexico_paths",
                "raphael": '../libs/raphael-min',
                "graphael": "../libs/g.raphael-min",
            },
            shim: {
                "graphael":[ 'raphael' ],
                "mexico_paths": {
                    exports: "mexico_paths"
                },
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
                },
                "gauge": {
                    exports: 'Gauge'
                }
            }
        });




requirejs(['../app/app', ], function(App) {
    App.initialize();
});