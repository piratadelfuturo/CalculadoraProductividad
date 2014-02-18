define([
    'jquery',
    'underscore',
    'backbone',
    '../views/InitialCalculadoraView',
    '../views/EmpresaCalculadoraView',
    '../views/PersonaCalculadoraView'
], function($, _, Backbone, InitialCalculadoraView ,EmpresaCalculadoraView, PersonaCalculadoraView) {
    var AppRouter = Backbone.Router.extend({
        view: null,
        viewName:'',
        views: {
            "empresa":EmpresaCalculadoraView,
            "persona":PersonaCalculadoraView,
            "initial":InitialCalculadoraView
        },
        routes: {
            'personas/': 'showPersonaCalculadora',
            'empresas/': 'showEmpresaCalculadora',
            'empresas/*estado': 'showEmpresaCalculadoraEstado',
            '*actions': 'loader'
        },
        loadView: function(name,opts){
            var base = $('#container'), view = null;
            if(this.viewName != name){
                this.view && (this.view.close ? this.view.close() : this.view.remove());
                var oldView = this.view;
                delete oldView;
                this.view = new this.views[name]({container:base});
                this.view.app = this;
            }

            return this.view;            
        },
    });

    var initialize = function() {
        var app_router = new AppRouter();
        app_router.on('route:showEmpresaCalculadora', function() {
            var view = this.loadView('empresa');
            view.showEstado();
        });
        app_router.on('route:showEmpresaCalculadoraEstado', function(estado) {
            var view = this.loadView('empresa');
            view.showForm(estado);
        });

        app_router.on('route:showPersonaCalculadora', function() {
            var view = this.loadView('persona');
            view.showForm();
        });
        app_router.on('route:loader', function(actions) {
            var view = this.loadView('initial');
        });
        Backbone.history.start();
    };
    return {
        initialize: initialize
    };
});