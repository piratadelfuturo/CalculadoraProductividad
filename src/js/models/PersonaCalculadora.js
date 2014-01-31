define(['backbone',"../models/Calculadora"], function(backbone,Calculadora) {
    var PersonaCalculadora = Calculadora.extend({
        defaults: _.extend(
                {}, Calculadora.prototype.defaults,
                {
                    sector: '',
                    estudios: '',
                    salarioMensual: '',
                    horasDia: 0,
                    horasSemana: 0,
                    horasMes: 0,
                    salarioHora: 0,
                    salarioPromedioComparado: 0
                }
        ),
        initialize: function() {
            Calculadora.prototype.initialize.apply(this, arguments);
        }
    });
    
    return PersonaCalculadora;
});


