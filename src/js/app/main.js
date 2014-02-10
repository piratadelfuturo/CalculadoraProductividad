requirejs.config(
        {
            paths: {
                "underscore": "../libs/underscore",
                "bootstrap": "../libs/bootstrap.min",
                "jquery": "../libs/jquery-2.1.0.min",
                "backbone": "../libs/backbone-min",
                "gagauge": "../libs/gagauge"
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
                },
                "gauge": {
                    exports: 'Gauge'
                }
            }
        });




require(['../app/app', ], function(App) {
    App.initialize();
});