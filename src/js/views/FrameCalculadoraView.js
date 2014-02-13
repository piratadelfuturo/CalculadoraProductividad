define(['backbone', 'underscore', 'jquery', 'gagauge', "../models/EmpresaCalculadora", "../models/PersonaCalculadora"], function(backbone, _, $, Gagauge, EmpresaCalculadora, PersonaCalculadora) {
    var FrameCalculadoraView = Backbone.View.extend({
        initialize: function() {
            var self = this;
            self.render();
        },        
        render: function() {
            var self = this;
        }        
    });
    return FrameCalculadoraView;
});