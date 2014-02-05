define(['backbone', 'underscore', "../models/PersonaCalculadora", 'jquery'], function(backbone, _, PersonaCalculadora, $) {
    var PersonaCalculadoraView = Backbone.View.extend({
        dataUrls: {
            opcionesSectoresUrl: '/data/personas/sectores',
            opcionesEstudiosUrl: '/data/personas/estudios',
            datosUrl: '/data/personas/datos'
        },
        model: new PersonaCalculadora(),
        initialize: function() {
            this.renderWait();

        },
        loadData: function() {
            var self = this;
            var sectoresRequest = $.ajax({
                url: self.dataUrls.opcionesSectoresUrl,
                dataType: 'text'
            });
            var estudiosRequest = $.ajax({
                url: self.dataUrls.opcionesEstudiosUrl,
                dataType: 'text'
            });
            var datosRequest = $.ajax({
                url: self.dataUrls.datosUrl,
                dataType: 'text'
            });
            $.when(sectoresRequest, estudiosRequest, datosRequest).then(function(sectores, estudios, datos) {
                this.model.loadData(sectores[0], estudios[0], datos[0]);
            }, function(e) {
                throw "datos no disponibles";
            });

        },
        renderWait: function() {

        },
        renderCalculadora: function() {
            var template = _.template($("#ce_template").html(), {});
            this.$el.html(template);
        },
    });

    return PersonaCalculadoraView;
});