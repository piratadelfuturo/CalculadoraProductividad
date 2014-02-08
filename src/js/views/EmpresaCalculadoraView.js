define(['backbone', 'underscore', "../models/EmpresaCalculadora", 'jquery', 'gagauge'], function(backbone, _, EmpresaCalculadora, $, Gagauge) {
    var EmpresaCalculadoraView = Backbone.View.extend({
        dataUrls: {
            opcionesSectoresUrl: './data/empresas/sectores',
            opcionesEstadosUrl: './data/empresas/estados',
            datosUrl: './data/empresas/datos'
        },
        model: new EmpresaCalculadora(),
        gauge: null,
        initialize: function() {
            var self = this;
            self.render();
        },
        loadOptions: function(callback, error) {
            callback = !callback ? function() {
            } : callback;
            error = !error ? function() {
                throw "invalid data"
            } : error;

            var self = this,
                    estadosRequest = $.ajax({
                        url: self.dataUrls.opcionesEstadosUrl,
                        dataType: 'text',
                    }),
                    sectoresRequest = $.ajax({
                        url: self.dataUrls.opcionesSectoresUrl,
                        dataType: 'text',
                    });
            $.when(sectoresRequest, estadosRequest).then(function(sectores, estados) {
                self.model.set("opcionesSectores", sectores[0].split("\n"));
                self.model.set("opcionesEstados", _.map(estados[0].split("\n"), function(o) {
                    return o.split("\t")[1]
                }));
                callback.apply(self, self.model.get("opcionesSectores"), self.model.get("opcionesEstados"));
            }, function(e) {
                if (!error) {
                    throw "datos no disponibles";
                } else {
                    error.apply(e, this);
                }
            });

        },
        loadData: function(callback) {
            callback = !callback ? function() {
            } : callback;
            var self = this,
                    val = parseInt(self.model.get("estado")) + 1,
                    datosRequest = $.ajax({
                        url: self.dataUrls.datosUrl + '/' + val,
                        dataType: 'text',
                        success: function(m) {
                            self.model.loadData(m);
                            callback.apply(self);
                        },
                        error: function() {
                            throw "no data";
                        }
                    });
        },
        render: function() {
            var self = this,
                    el = self.$el,
                    template = _.template($("#ce_template").html(), {});
            el.html(template);
            var estadosSelect = $("#ce_residencia", el).empty(),
                    sectoresSelect = $("#ce_sector", el).empty(),
                    trabajadoresInput = $("#ce_trabajadores", el),
                    produccionInput = $("#ce_produccion", el),
                    productividadEmpresaInput = $('#ce_productividad_empresa',el),
                    productividadSectorInput =  $('#ce_productividad_sector',el);

            trabajadoresInput.val(self.model.get("totalTrabajadores")).change(function() {
                self.model.set("totalTrabajadores", trabajadoresInput.val());
            });
            produccionInput.val(self.model.get("produccionAnual")).change(function() {
                self.model.set("produccionAnual", produccionInput.val());
            });
            
            productividadEmpresaInput.val(self.model.get("productividad")).change(function(){
                    self.model.set("productividad", productividadEmpresaInput.val());
            });
            productividadSectorInput.val(self.model.get("productividadComparada")).change(function(){
                    self.model.set("productividadComparada", productividadSectorInput.val());
            });
            
            
            self.loadOptions(function() {
                
                var estados = self.model.get("opcionesEstados"),
                    sectores = self.model.get("opcionesSectores");
                
                self.listenTo(self.model, "change:estado", function() {
                    self.loadData(
                            function(){
                                $("#ce_fs2",self.$el).removeAttr("disabled");
                            }
                            )
                });

                $(estadosSelect).on("change select DOMSubtreeModified", function() {
                    var value = $(this).val();
                    if (value !== '') {
                        self.model.set("estado", value);
                    }
                });
                $(sectoresSelect).on("select change DOMSubtreeModified", function() {
                    var value = $(this).val();
                    if (value !== '') {
                        self.model.set("sector", value);
                    }
                });
                _.each(estados, function(text, i) {
                    estadosSelect.append($("<option></option>").val(i).text(text));
                });
                _.each(sectores, function(text, i) {
                    sectoresSelect.append($("<option></option>").val(i).text(text));
                });
            });
        },
        renderWait: function() {

        },
        updateValues: function(x) {
            var self = this,
                    el = this.$el,
                    horasMesInput = $("#cp_horas_mes", el),
                    salarioHoraInput = $("#cp_salario_hora", el),
                    salarioComparadoInput = $("#cp_salario_comparado", el),
                    productividadBox = $('.controls .productividad .porcentaje', el),
                    horasMes = self.model.get('horasMes'),
                    salarioHora = self.model.get('salarioHora'),
                    salarioComparado = self.model.get('salarioComparado'),
                    productividad = self.model.get('productividad'),
                    color = '#66FF99', bgcolor = '#fff', side = 1;
            horasMesInput.val(horasMes);
            salarioHoraInput.val(salarioHora);
            salarioComparadoInput.val(salarioComparado);

            if (productividad < 1) {
                productividad = 1 - productividad;
                color = '#FF3366';
                bgcolor = '#000';
                side = -1;
            } else if (productividad > 1) {
                productividad = productividad - 1;
                color = '#66FF99';
                bgcolor = '#fff';
                side = 1;
            } else {
                productividad = 0;
                color = '#000';
                bgcolor = '#000';
                side = 1;
            }
            productividad = productividad * 100;
            productividad = parseFloat(productividad).toFixed(2);

            self.gauge.set(Math.round(productividad * side));
            self.gauge.color(color, bgcolor);
        },
        renderGauge: function() {
            var gauge = new Gagauge($('#cp_gauge')[0]); // create sexy gauge!
            gauge.set(0); // set actual value
            this.gauge = gauge;
        }
    });
    return EmpresaCalculadoraView;
});