define(['backbone', "../models/Calculadora"], function(backbone, Calculadora) {
    var PersonaCalculadora = Calculadora.extend(
            {
                defaults: _.extend(
                        {}, Calculadora.prototype.defaults,
                        {
                            sector: null,
                            estudio: null,
                            salarioMes: 0,
                            horasDia: 0,
                            diasSemana: 0,
                            horasMes: 0,
                            salarioHora: 0,
                            salarioComparado: 0,
                            opcionesSectores: [],
                            opcionesEstudios: [],
                            datos: [],
                            promedio: []
                        }
                ),
                initialize: function() {
                    var self = this;
                    Calculadora.prototype.initialize.apply(this, arguments);
                    this.on({
                        "change:diasSemana change:horasDia": this.calculateHorasMes,
                        "change:salarioMes change:horasMes": this.calculateSalarioHora,
                        "change:sector change:estudios": this.calculateSalarioComparado
                    });
                    this.loadData();
                },
                calculateHorasMes: function() {
                    var self = this;
                    var horasDia = self.get('horasDia');
                    var diasSemana = self.get('diasSemana');
                    self.set('horasMes', horasDia * diasSemana * 4)
                },
                calculateSalarioHora: function() {
                    var self = this;
                    var horasMes = self.get('horasMes');
                    var salarioMes = self.get('salarioMes');
                    self.set('salarioHora', salarioMes / horasMes);
                },
                calculateSalarioComparado: function() {
                    var self = this;
                    var sector = self.get('sector');
                    var estudios = self.get('estudios');
                    var promedio = self.get('promedio');
                    self.set('salarioComparado', promedio[sector][estudios]);
                },
                loadData: function(s, e, d) {
                    var self = this;

                    var datos = [];
                    var sectores = [];
                    var estudios = [];

                    var promedio = [];
                    _.each(d.split("\n"), function(row) {
                        row = _.map(row.split("\t"), function(x) {
                            var value = 0;
                            if (x !== '') {
                                value = x;
                            }
                            return parseFloat(value);
                        });
                        datos.push(row);
                    });
                    _.each(e.split("\n"), function(row) {
                        estudios.push(row);
                    });

                    var counter = 0;
                    _.each(s.split("\n"), function(row) {
                        sectores.push(row);
                        var row = [];
                        for (var y = 0; y <= 5; y++) {
                            row[y] = 0;
                            for (var x = 0; x <= (estudios.length - 1); x++) {
                                var value = parseFloat(datos[counter][(x * 6) + y]);
                                row[y] += value;
                            }
                            row[y] = row[y] / 3;
                        }
                        promedio.push(row);
                    });
                    self.set('opcionesEstudios', estudios);
                    self.set('opcionesSectores', sectores);
                    self.set('datos', datos);
                    self.set('promedio', promedio);
                }
            });

    return PersonaCalculadora;
});


