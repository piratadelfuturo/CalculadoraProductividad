requirejs.config(
        {
            paths: {
                "underscore": "../libs/underscore",
                "bootstrap": "../libs/bootstrap.min",
                "jquery": "../libs/jquery-2.1.0.min",
                "backbone": "../libs/backbone-min",
                "gagauge": "../libs/gagauge",
                "raphael": '../libs/raphael-min',
                "graphael": "../libs/g.raphael-min",
                'facebook': '//connect.facebook.net/en_US/all'
            },
            shim: {
                'facebook' : {
                    exports: 'FB'
                },
                "graphael":[ 'raphael' ],
                "underscore": {
                    exports: "_"
                },
                "bootstrap": {
                    deps: ["jquery"]
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




requirejs(['../app/app' ], function(App) {
    App.initialize();
});