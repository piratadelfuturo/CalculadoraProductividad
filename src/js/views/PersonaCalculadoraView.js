define([
    'backbone',
    'underscore',
    "../models/PersonaCalculadora",
    'jquery',
    'gagauge',
    "../data/mexico_efemerides_persona",
    'accounting'
],
        function(
                backbone,
                _,
                PersonaCalculadora,
                $,
                Gagauge,
                efemerides,
                accounting
                ) {
            var PersonaCalculadoraView = Backbone.View.extend({
                tagName: "div",
                id: "main_view",
                model: new PersonaCalculadora(),
                dataUrls: {
                    opcionesSectoresUrl: './data/personas/sectores',
                    opcionesEstudiosUrl: './data/personas/estudios',
                    datosUrl: './data/personas/datos'
                },
                initialize: function(opts) {
                    var self = this;
                    self.$container = opts.container;
                    self.render();
                },
                events: {
                    "click #cp_form_element_submit": "validateForm",
                    "click #cp_result_sharebtn": "showShare"
                },
                render: function() {
                    var self = this, template = _.template($("#cp_main_template").html(), {});
                    self.$container.append(self.$el);
                    self.$el.html(template).addClass('container-fluid');
                    return this;
                },
                close: function() {
                    delete this.gauge;
                    this.remove();
                },
                loadData: function(callback, error) {
                    callback = !callback ? function() {
                    } : callback;
                    var self = this,
                            sectoresRequest = $.ajax({
                                url: self.dataUrls.opcionesSectoresUrl,
                                dataType: 'text'
                            }),
                    estudiosRequest = $.ajax({
                        url: self.dataUrls.opcionesEstudiosUrl,
                        dataType: 'text'
                    }),
                    datosRequest = $.ajax({
                        url: self.dataUrls.datosUrl,
                        dataType: 'text'
                    }),
                    sectorElement = $('#cp_form_element_sector', self.$el),
                            estudiosElement = $('#cp_form_element_estudio', self.$el),
                            horasElement = $('#cp_form_element_horas', self.$el).empty(),
                            salarioElement = $('#cp_form_element_salario', self.$el).val(''),
                            diasElement = $('#cp_form_element_dias', self.$el).empty(),
                            submitElement = $("#cp_form_element_submit"),
                            error = false;

                    $.when(sectoresRequest, estudiosRequest, datosRequest).then(function(sectores, estudios, datos) {
                        self.model.loadData(sectores[0], estudios[0], datos[0]);

                        _.map(self.model.get("opcionesSectores"), function(v, i) {
                            sectorElement.append($('<option></option>').val(i).text(v))
                        })
                        _.map(self.model.get("opcionesEstudios"), function(v, i) {
                            estudiosElement.append($('<option></option>').val(i).text(v));
                        });
                        for (var i = 1; i <= 24; i++) {
                            horasElement.append($('<option></option>').val(i).text(i));
                        }
                        for (var i = 1; i <= 7; i++) {
                            diasElement.append($('<option></option>').val(i).text(i));
                        }

                        callback.apply(self, callback);
                        self.dataLoaded = true;
                    }, function(e) {
                        if (!error) {
                            throw "datos no disponibles";
                        } else {
                            error.apply(e, error);
                        }
                    });

                },
                validateForm: function(e) {
                    e && e.preventDefault && e.preventDefault();
                    var self = this,
                            error = false,
                            sectorElement = $('#cp_form_element_sector', self.$el),
                            estudiosElement = $('#cp_form_element_estudio', self.$el),
                            horasElement = $('#cp_form_element_horas', self.$el),
                            salarioElement = $('#cp_form_element_salario', self.$el),
                            diasElement = $('#cp_form_element_dias', self.$el),
                            error = false;
                    $('#cp_form').find('.alert').addClass('hidden');

                    if (sectorElement.val() === '') {
                        sectorElement.closest('.form-group').find('.alert').removeClass('hidden');
                        error = true;
                    }
                    if (estudiosElement.val() === '') {
                        estudiosElement.closest('.form-group').find('.alert').removeClass('hidden');
                        error = true;
                    }
                    if (horasElement.val() === '') {
                        horasElement.closest('.form-group').find('.alert').removeClass('hidden');
                        error = true;
                    }

                    if (diasElement.val() === '') {
                        diasElement.closest('.form-group').find('.alert').removeClass('hidden');
                        error = true;
                    }

                    if (salarioElement.val() === '' || isNaN(parseFloat(salarioElement.val()).toFixed(2))) {
                        salarioElement.closest('.form-group').find('.alert').removeClass('hidden');
                        error = true;
                    }

                    if (error === false) {
                        self.model.set("sector", sectorElement.val());
                        self.model.set("estudio", estudiosElement.val());
                        self.model.set("horasDia", horasElement.val());
                        self.model.set("diasSemana", diasElement.val());
                        self.model.set("salarioMes", parseFloat(salarioElement.val()).toFixed(2));
                        self.loadProductivity();
                    }

                    return false;
                },
                hidePanels: function() {
                    $('.panel', this.$el).addClass('hidden');
                },
                showForm: function() {
                    this.hidePanels();
                    !this.dataLoaded && this.loadData();
                    $('#cp_form', this.$el).removeClass('hidden').addClass('visible');
                },
                loadProductivity: function() {
                    this.showProductivity();
                },
                showProductivity: function() {
                    this.hidePanels();
                    $('#cp_result', this.$el).removeClass('hidden').addClass('visible');

                    var self = this, opcionesSectores = this.model.get('opcionesSectores'),
                            opcionesEstudios = this.model.get('opcionesEstudios'),
                            prod = 0,
                            text = '',
                            estudio = '';

                    $('#cp_result .c-result-text-sector', this.$el).text(opcionesSectores[self.model.get('sector')]);

                    if (self.model.get('estudio') === 1) {
                        estudio = ' con un nivel de educacion de ' + opcionesEstudios[self.model.get('estudio')];
                    } else {
                        estudio = ' con cualquier nivel de educacion.';
                    }

                    $('#cp_result p .c-result-text-estudio', this.$el).text(estudio);
                    $('#cp_result li .c-result-text-estudio', this.$el).text(opcionesEstudios[self.model.get('estudio')]);

                    prod = self.model.get('productividad');
                    text = prod + '% ';
                    if (prod < 0) {
                        text += '';
                    } else if (prod > 0) {
                        text += 'mayor';
                    } else {
                        text = 'igual de ';
                    }

                    $('#cp_result .c-result-text-prod', this.$el).text(text);
                    $('#cp-result-referencia', this.$el).text(accounting.formatMoney(self.model.get('salarioComparado')));

                    if (efemerides[self.model.get('estudio')] && efemerides[self.model.get('estudio')].length > 0) {
                        var efem = efemerides[self.model.get('estudio')][Math.floor(Math.random() * efemerides[self.model.get('estudio')].length)];
                        $('#cp_result .c-result-text-efem', this.$el).text(efem);
                    }

                    this.renderGauge();
                    this.updateGauge();
                },
                showShare: function(e) {
                    var self = this, prod = 0, text = '';
                    e.preventDefault();
                    this.hidePanels();
                    $('#cp_share', this.$el).removeClass('hidden').addClass('visible');
                    prod = self.model.get('productividad');
                    text = prod + '% ';
                    if (prod < 0) {
                        text += ' ';
                    } else if (prod > 0) {
                        text += 'mayor ';
                    } else {
                        text = 'igual de ';
                    }

                    $('#cp_share .c-share-text-prod', this.$el).text(text);

                    var shareText = $('#cp_share div.well', this.$el).text().trim();

                    shareText = encodeURIComponent(shareText) + ": " + window.location;
                    $('#cp_share .c-share-link-em', self.$el).attr('href', 'mailto:?to=&subject=calculadora%20de%20productividad&body=' + shareText);
                    $('#cp_share .c-share-link-fb', self.$el).attr('href', 'http://www.facebook.com/sharer/sharer.php?u=' + window.location);
                    $('#cp_share .c-share-link-tw', self.$el).attr('href', 'http://twitter.com/home?status=' + shareText);

                },
                renderGauge: function() {
                    var gauge = new Gagauge($('#cp_result canvas', this.$el)[0]); // create sexy gauge!
                    gauge.set(0); // set actual value
                    this.gauge = gauge;
                },
                updateGauge: function() {
                    var self = this,
                            el = this.$el,
                            productividad = self.model.get('productividad'),
                            color = '#66FF99', bgcolor = '#fff';

                    if (productividad < 0) {
                        color = '#FF3366';
                        bgcolor = '#000';
                    } else if (productividad > 0) {
                        color = '#66FF99';
                        bgcolor = '#fff';
                    } else {
                        color = '#000';
                        bgcolor = '#000';
                    }
                    self.gauge.set(productividad);
                    self.gauge.color(color, bgcolor);
                },
            });
            return PersonaCalculadoraView;
        });