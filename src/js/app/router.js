define([
    'jquery',
    'underscore',
    'backbone',
    '../views/EmpresaCalculadoraView',
    '../views/PersonaCalculadoraView'
], function($, _, Backbone, EmpresaCalculadoraView, PersonaCalculadoraView) {
    var AppRouter = Backbone.Router.extend({
        routes: {
            // Define some URL routes
            '': 'loader',
            'personas/': 'showPersonaCalculadora',
            'empresas/': 'showEmpresaCalculadora',
            // Default
            '*actions': 'defaultAction'
        }
    });

    var initialize = function() {
        var app_router = new AppRouter(),
                base = $('#calculadora_base'),
                empresaCalculadoraView = null, personaCalculadoraView = null;
        app_router.on('route:showEmpresaCalculadora', function() {
            empresaCalculadoraView = new EmpresaCalculadoraView({el: base});
            //empresaCalculadoraView.render();
        });

        app_router.on('route:showPersonaCalculadora', function() {
            personaCalculadoraView = new PersonaCalculadoraView({el: base});
            //personaCalculadoraView.render({el: $('#calculadora_base')});
        });
        app_router.on('route:loader', function(actions) {
            // We have no matching route, lets just log what the URL was
            console.log('No route!', actions);
        });
        app_router.on('route:defaultAction', function(actions) {
            // We have no matching route, lets just log what the URL was
            console.log('No route:', actions);
        });
        Backbone.history.start();
    };
    return {
        initialize: initialize
    };
});