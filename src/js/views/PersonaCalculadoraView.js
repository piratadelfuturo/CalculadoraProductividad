define(['backbone', 'underscore', "../models/PersonaCalculadora", 'jquery', 'gagauge'], function(backbone, _, PersonaCalculadora, $, Gagauge) {
    var PersonaCalculadoraView = Backbone.View.extend({
        dataUrls: {
            opcionesSectoresUrl: './data/personas/sectores',
            opcionesEstudiosUrl: './data/personas/estudios',
            datosUrl: './data/personas/datos'
        },
        model: new PersonaCalculadora(),
        gauge: null,
        initialize: function() {
            var self = this;
            this.renderWait();
            this.loadData(function() {
                self.renderCalculadora();
            });
        },
        loadData: function(callback, error) {
            callback = !callback ? function() {
            } : callback;
            var self = this;
            var sectoresRequest = $.ajax({
                url: self.dataUrls.opcionesSectoresUrl,
                dataType: 'text',
                iframe: true
            });
            var estudiosRequest = $.ajax({
                url: self.dataUrls.opcionesEstudiosUrl,
                dataType: 'text',
                iframe: true
            });
            var datosRequest = $.ajax({
                url: self.dataUrls.datosUrl,
                dataType: 'text',
                iframe: true
            });
            $.when(sectoresRequest, estudiosRequest, datosRequest).then(function(sectores, estudios, datos) {
                self.model.loadData(sectores[0], estudios[0], datos[0]);
                callback.apply(self, callback);
            }, function(e) {
                if (!error) {
                    throw "datos no disponibles";
                } else {
                    error.apply(e, error);
                }
            });
        },
        renderWait: function() {

        },
        renderCalculadora: function() {
            var self = this;
            var el = this.$el;
            var template = _.template($("#ce_template").html(), {});
            el.html(template);
            var sectorSelect = $('#cp_sector', el);
            var estudiosSelect = $('#cp_estudios', el);
            var salarioInput = $("#cp_salario", el);
            var horasDiaInput = $("#cp_horas_dia", el);
            var diasSemanaInput = $("#cp_dias_semana", el);

            sectorSelect.empty().on("change select DOMSubtreeModified", function() {
                self.model.set("sector", $(this).val());
            });
            estudiosSelect.empty().on("change select DOMSubtreeModified", function() {
                self.model.set("estudio", $(this).val());
            });
            _.each(self.model.get('opcionesSectores'), function(a, b) {
                var option = $("<option></option>");
                option.val(b).text(a)
                sectorSelect.append(option);
            });
            _.each(self.model.get('opcionesEstudios'), function(a, b) {
                var option = $("<option></option>");
                option.val(b).text(a)
                estudiosSelect.append(option);
            });

            salarioInput.val(self.model.get("salarioMes")).change(function() {
                self.model.set("salarioMes", $(this).val())
            });
            horasDiaInput.val(self.model.get("horasDia")).change(function() {
                self.model.set("horasDia", $(this).val());
            });
            diasSemanaInput.val(self.model.get("diasSemana")).change(function() {
                self.model.set("diasSemana", $(this).val());
            });

            self.listenTo(self.model, "change", self.updateValues);
            self.renderGauge();
            self.updateValues();
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
            self.gauge.color(color,bgcolor);
        },
        renderGauge: function() {
            var gauge = new Gagauge($('#cp_gauge')[0]); // create sexy gauge!
            gauge.set(0); // set actual value
            this.gauge = gauge;
        }
    });
    return PersonaCalculadoraView;
});