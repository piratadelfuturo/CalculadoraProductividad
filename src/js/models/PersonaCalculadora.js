define(['backbone', 'underscore', "../models/Calculadora"], function(backbone, _, Calculadora) {
    var PersonaCalculadora = Calculadora.extend(
            {
                defaults: _.extend(
                        {}, Calculadora.prototype.defaults,
                        {
                            sector: 0,
                            estudio: 0,
                            salarioMes: 4500.00,
                            horasDia: 8,
                            diasSemana: 5,
                            horasMes: 0,
                            salarioHora: 0.0,
                            salarioComparado: 0.0,
                            opcionesSectores: [''],
                            opcionesEstudios: [''],
                            datos: [],
                            promedio: []
                        }
                ),
                initialize: function() {
                    var self = this;
                    Calculadora.prototype.initialize.apply(this, arguments);
                    self.calculateHorasMes();
                    self.calculateSalarioHora();
                    self.on({
                        "change:diasSemana change:horasDia": self.calculateHorasMes,
                        "change:salarioMes change:horasMes": self.calculateSalarioHora,
                        "change:sector change:estudio change:promedio": self.calculateSalarioComparado,
                        "change:datos": self.calculatePromedio,
                        "change:salarioHora change:salarioComparado": self.calculateProductividad
                    });
                    self.calculateHorasMes();
                    self.calculateSalarioHora();
                },
                calculateHorasMes: function() {
                    var self = this,
                            horasDia = self.get('horasDia'),
                            diasSemana = self.get('diasSemana');
                    self.set('horasMes', horasDia * diasSemana * 4)
                },
                calculateSalarioHora: function() {
                    var self = this,
                            horasMes = self.get('horasMes'),
                            salarioMes = self.get('salarioMes'),
                            salarioHora = salarioMes / horasMes;

                    self.set('salarioHora', salarioHora.toFixed(2));
                },
                calculateSalarioComparado: function() {
                    var self = this,
                            sector = self.get('sector'),
                            estudio = self.get('estudio'),
                            promedio = self.get('promedio');

                    self.set('salarioComparado', promedio[sector][estudio]);
                },
                calculateProductividad: function(){
                    var self = this,
                            side = 1,
                    productividad = parseFloat(self.get('salarioHora') / self.get('salarioComparado'));
                    productividad = isNaN(productividad) ||  productividad === Infinity? 0 : productividad.toFixed(2);
                    if(productividad < 1){
                        productividad = 1 - productividad;
                        side = -1;
                    }else if(productividad > 1){
                        productividad = productividad - 1;                     
                    }else{
                        productividad = 0;
                    }
                    productividad = productividad * 100;
                    productividad = Math.floor(parseFloat(productividad) * 100) * side;
                    self.set('productividad', productividad );
                },
                loadData: function(s, e, d) {
                    var self = this,
                            datos = [],
                            sectores = s.split("\n"),
                            estudios = e.split("\n");

                    var dataSplit = d.split("\n");
                    if (!(dataSplit.length === sectores.length && dataSplit[0] && dataSplit[0].split("\t").length % estudios.length === 0)) {
                        throw "datos incorrectos";
                    }
                    _.each(dataSplit, function(row) {
                        row = _.map(row.split("\t"), function(x) {
                            var value = 0;
                            if (x !== '') {
                                value = x;
                            }
                            return parseFloat(value);
                        });
                        datos.push(row);
                    });

                    self.set('opcionesEstudios', estudios);
                    self.set('opcionesSectores', sectores);                    
                    self.set('datos', datos);
                    self.calculatePromedio();
                },
                calculatePromedio: function() {
                    var self = this,
                            promedio = [],
                            estudios = self.get('opcionesEstudios'),
                            sectores = self.get('opcionesSectores'),
                            datos = self.get('datos'),
                            secciones = datos[0].length / estudios.length;
                    _.each(sectores, function(sector, counter) {
                        var row = [];
                        for (var y = 0; y <= (estudios.length - 1); y++) {
                            row[y] = 0;
                            for (var x = 0; x <= (secciones - 1); x++) {
                                var position = (x * estudios.length) + y;                                
                                var value = parseFloat(datos[counter][position]);
                                row[y] += value;
                            }
                            row[y] = row[y] / secciones;
                            row[y] = row[y].toFixed(2);
                        }
                        promedio.push(row);
                    });
                    self.set('promedio', promedio);
                }
            });

    return PersonaCalculadora;
});


