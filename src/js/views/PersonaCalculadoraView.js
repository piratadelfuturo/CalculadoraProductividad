define(['backbone','underscore', "../models/PersonaCalculadora",'jquery'], function(backbone, _ ,PersonaCalculadora, $) {
    var PersonaCalculadoraView = Backbone.View.extend({
        model: new PersonaCalculadora({}),
        initialize: function() {
            this.render();
        },
        renderWait: function(){
            
            
        },        
        renderCalculadora: function(){
            var template = _.template( $("#ce_template").html(), {} );
            this.$el.html( template );
        },
    });


    return PersonaCalculadoraView;
});