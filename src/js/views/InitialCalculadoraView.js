define(['backbone', 'underscore', 'jquery'], function(Backbone, _, $) {
    var InitialCalculadoraView = Backbone.View.extend({
        tagName:"div",
        id:"main_view",
        initialize: function(opts) {
            var self = this;
            self.$container = opts.container;
            self.render();
        },
        render: function() {
            var self = this,template = _.template( $("#main_template").html(), {} );
            self.$container.append(self.$el);
            self.$el.html( template ).addClass('container-fluid');
            return this;
        }        
    });
    return InitialCalculadoraView;
});