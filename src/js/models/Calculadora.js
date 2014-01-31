define(['backbone'], function() {
    var Calculadora = Backbone.Model.extend({
        defaults: {
            productividad: null
        },
        validate: function(attributes) {

            /*
             if (attributes.age < 0 && attributes.name != "Dr Manhatten") {
             return "You can't be negative years old";
             }
             */
        },
        initialize: function() {
            this.bind("error", function(model, error) {
                alert(error);
            });
            this.on(
                    "change",
                    function(model) {


                    }
            )

        }
    });
    
    return Calculadora;
});