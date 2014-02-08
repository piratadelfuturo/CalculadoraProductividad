define(['backbone', 'underscore', "../models/Calculadora"], function(backbone, _, Calculadora) {
    var EmpresaCalculadora = Calculadora.extend(
            {
                defaults: _.extend(
                        {}, Calculadora.prototype.defaults,
                        {
                            estado:0,
                            sector: 0,
                            produccionAnual: 4500.00,
                            totalTrabajadores: 8,
                            productividad: 0.0,
                            productividadComparada: 0.0,
                            opcionesSectores: [''],
                            opcionesConceptos:[''],
                            datos: {}
                        }
                ),
                initialize: function() {
                    var self = this;
                    Calculadora.prototype.initialize.apply(this, arguments);
                    self.calculateProductividad();
                    self.on({
                        "change:produccionAnual change:totalTrabajadores": self.calculateProductividad,
                        "change:sector": self.calculateProductividadComparada
                    });
                },
                calculateProductividadComparada: function() {
                    var self = this,
                            sector = self.get('sector'),
                            datos = self.get('datos');
                    if(!!datos[sector]){
                        self.set('productividadComparada', datos[sector][9]/datos[sector][1]);
                    }
                },
                calculateProductividad: function(){
                    var self = this;
                    self.set('productividad',self.get('produccionAnual') / self.get('totalTrabajadores'));
                },
                loadData: function(d) {
                    var self = this,
                            datos = self.get("datos");
                    var dataSplit = d.split("\n");
                    datos[self.get("estado")] = [];
                    _.each(dataSplit, function(row) {
                        row = _.map(row.split("\t"), function(x) {
                            var value = 0;
                            if (x !== '') {
                                value = x;
                            }
                            return parseFloat(value);
                        });
                        datos[self.get("estado")].push(row);
                    });

                    self.set('datos', datos);
                    self.calculateProductividadComparada();
                }
            });

    return EmpresaCalculadora;
});


