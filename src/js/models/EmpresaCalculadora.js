define(['backbone', 'underscore', "../models/Calculadora"], function(backbone, _, Calculadora) {
    var EmpresaCalculadora = Calculadora.extend(
            {
                defaults: _.extend(
                        {}, Calculadora.prototype.defaults,
                        {
                            estado:0,
                            sector: 0,
                            produccionAnual: 150000000.00,
                            totalTrabajadores: 1000,
                            productividadEmpresa: 0.0,
                            productividadComparada: 0.0,
                            opcionesSectores: [''],
                            opcionesConceptos:[''],
                            datos: {}
                        }
                ),
                initialize: function() {
                    var self = this;
                    Calculadora.prototype.initialize.apply(this, arguments);
                    self.calculateProductividadEmpresa();
                    self.on({
                        "change:produccionAnual change:totalTrabajadores": self.calculateProductividadEmpresa,
                        "change:sector": self.calculateProductividadComparada,
                        "change:datos": self.calculateProductividadComparada,
                        "change:productividadEmpresa change:productividadComparada": self.calculateProductividad
                    });
                },
                calculateProductividadComparada: function() {
                    var self = this,
                            sector = self.get('sector'),
                            datos = self.get('datos'),
                            estado = self.get('estado'),
                            comparada = self.get('productividadComparada');
                    
                    if(!!datos[estado] && !! datos[estado][sector]){
                        comparada = datos[estado][sector][9]/datos[estado][sector][1];
                        self.set('productividadComparada', parseFloat((comparada)*1000).toFixed(2));
                    }
                },
                calculateProductividadEmpresa: function(){
                    var self = this,
                            prod = parseFloat(self.get('produccionAnual') / self.get('totalTrabajadores')).toFixed(2);
                    
                    self.set('productividadEmpresa',prod);
                },
                calculateProductividad: function(){
                    var self = this,
                            side = 1,
                    productividad = parseFloat(self.get('productividadEmpresa') / self.get('productividadComparada'));
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


