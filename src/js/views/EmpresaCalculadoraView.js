define(['backbone', 'underscore', "../models/EmpresaCalculadora", 'jquery', 'gagauge', "../data/mexico_paths", "../data/mexico_empresa_estados", "../data/mexico_empresa_sectores", 'raphael', 'graphael', 'bootstrap'], function(backbone, _, EmpresaCalculadora, $, Gagauge, mexico_paths, mexico_empresa_estados, mexico_empresa_sectores, Raphael) {
    var EmpresaCalculadoraView = Backbone.View.extend({
        tagName: "div",
        id: "ce_view",
        model: new EmpresaCalculadora(),
        r: [],
        dataUrls: {
            datosUrl: './data/empresas/datos/'
        },
        estados: {},
        initialize: function(opts) {
            var self = this;
            self.$container = opts.container;
            self.loadOptions();
            self.render();
        },
        events: {
            "click #ce_form_element_submit": "showProductivity",
            "click #ce_result_sharebtn": "showShare",
            "click #ce_estado_element_submit": "loadForm"
        },
        render: function() {
            var self = this,
                    template = _.template($("#ce_main_template").html(), {});
            self.$container.append(self.$el);
            self.$el.html(template).addClass('container-fluid');
            var estadosElement = $('#ce_estado_element_estado', self.$el);
            estadosElement.empty();
            for (var slug in self.estados) {
                estadosElement.append($('<option></option>').val(slug).text(self.estados[slug].name))
            }
            var sectorSelect = $('#ce_form_element_sector', this.$el).empty();
            _.map(mexico_empresa_sectores, function(o, i) {
                sectorSelect.append($('<option></option>').text(o).val(i));
            });

            var trabajadoresElement = $('#ce_form_element_trabajadores');
                trabajadoresElement.val(self.model.get("totalTrabajadores")).on("keyup change", function(e) {
                var oldVal = self.model.get("totalTrabajadores"),
                        numStr = parseInt(trabajadoresElement.val());
                if (!isNaN(numStr)) {
                    self.model.set("totalTrabajadores", numStr);
                    return numStr;
                } else {
                    trabajadoresElement.val(oldVal);
                    e.preventDefault;
                    return false;
                }
            });
            
            var produccionElement = $('#ce_form_element_produccion');
            produccionElement.val(self.model.get("produccionAnual")).on("keyup change", function(e) {
                var oldVal = self.model.get("produccionAnual"),
                        numStr = parseFloat(produccionElement.val()).toFixed(2);
                if (!isNaN(numStr)) {
                    self.model.set("produccionAnual", numStr);
                    return numStr;
                } else {
                    produccionElement.val(oldVal);
                    e.preventDefault;
                    return false;
                }
            });
            return this;
        },
        loadOptions: function(callback, error) {
            callback = !callback ? function() {
            } : callback;
            error = !error ? function() {
                throw "invalid data"
            } : error;
            var self = this;
            if (!self.loadedOptions) {
                self.estados = mexico_empresa_estados;
                self.model.set("opcionesSectores", mexico_empresa_sectores);
                self.model.set("opcionesEstados", _.map(mexico_empresa_estados, function(o) {
                    return o.name;
                }));
                self.loadedOptions = true
            }
            callback.apply(self);
        },
        renderMapEstados: function() {
            var self = this,
                    paths = mexico_paths,
                    container = $('#ce_estado_map_estados', this.$el),
                    r = null,
                    select = $('#ce_estado_element_estado', self.$el);
            r = Raphael(container[0]);
            this.r.push(r);
            r.setViewBox(0, 0, 650, 450, true);
            r.safari();
            var attributes = {
                fill: '#485e96',
                stroke: '#1e336a',
                'stroke-width': 1.5,
                'stroke-linejoin': 'round'
            };
            var arr = new Array();
            _.map(paths, function(o, i) {
                var obj = r.path(o.path);
                arr[obj.id] = i;
                obj.attr(attributes);
                $(obj).tooltip({title: self.estados[o.name].name});
                obj.hover(function() {
                    this.animate({
                        fill: '#733A6A',
                        stroke: '#1F131D'
                    }, 300);
                    $('#ce_estado_map_estados_box h4').text(self.estados[o.name].name);
                }, function() {
                    $('#ce_estado_map_estados_box h4').text('ESTADO');
                    this.animate({
                        fill: attributes.fill,
                        stroke: attributes.stroke
                    }, 300);
                });
                obj.click(function(e) {
                    select.val(o.name);
                    self.loadForm();
                    return false;
                });
            });
        },
        renderMapFull: function() {
            var self = this,
                    paths = mexico_paths,
                    container = $('#ce_estado_map_full', this.$el),
                    r = null,
                    select = $('#ce_estado_element_estado', self.$el);
            r = Raphael(container[0]);
            this.r.push(r);
            r.setViewBox(0, 0, 650, 450, true);
            r.safari();
            var attributes = {
                fill: '#1e336a',
                stroke: '#1e336a',
                'stroke-width': 2,
                'stroke-linejoin': 'round'
            };
            var arr = new Array();
            _.map(paths, function(o, i) {
                var obj = r.path(o.path);
                arr[obj.id] = i;
                obj.attr(attributes);
                obj.click(function() {
                    select.val('nacional');
                    self.loadForm();
                    return false;

                });
            });
        },
        removeMaps: function() {
            _.map(this.r, function(r) {
                r && (r.remove && r.remove());
            })
        },
        loadFormData: function(estado, callback, error) {
            callback = !callback ? function() {
            } : callback;
            var self = this;

            if (!self.loadedFormData) {
                var datosRequest = $.ajax({
                    url: self.dataUrls.datosUrl + this.estados[estado].id,
                    dataType: 'text',
                    success: function(m) {
                        self.model.loadData(m);
                        callback.apply(self);
                    },
                    error: function() {
                        throw "no data";
                    }
                });

                callback.apply(self, callback);
                this.loadedFormData = true;

            }
        },
        close: function() {
            this.removeMaps();
            this.remove();
        },
        hidePanels: function() {
            $('.panel', this.$el).addClass('hidden');
            this.removeMaps();
        },
        showEstado: function() {
            var self = this;
            self.hidePanels();
            $('#ce_estado', self.$el).addClass('visible').removeClass('hidden');
            this.renderMapEstados();
            this.renderMapFull()
        },
        loadForm: function() {
            this.app.navigate(
                    '/empresas/' + $('#ce_estado_element_estado', this.$el).val(),
                    {trigger: true}
            );
        },
        showForm: function(estado) {
            this.hidePanels();
            if (!this.estados[estado]) {
                this.app.navigate(
                        '/empresas/', {trigger: true}
                );
            }
            this.loadFormData(estado);
            var base = $('#ce_form', this.$el).removeClass('hidden').addClass('visible'),
                    data = this.estados[estado];
            $('#ce_form_element_residencia', base).text(data.name);

        },
        showProductivity: function() {
            this.hidePanels();
            $('#ce_result', this.$el).removeClass('hidden').addClass('visible');

            var self = this, opcionesSectores = this.model.get('opcionesSectores'),
                    estado = this.model.get('estado'),
                    prod = 0,
                    text = '',
                    estadoText = '';
            
            $('#ce_result .c-result-text-sector', this.$el).text(opcionesSectores[self.model.get('sector')]);
            
            estadoText = self.estados[estado].name
            
            $('#ce_result .c-result-text-estado', this.$el).text(estadoText);

            prod = self.model.get('productividad');
            text = prod+'% ';
            if(prod < 0){
                text += 'menos';
            }else if(prod > 0){
                text += 'mas';
            }else{
                text = 'igual de ';
            }
            
            $('#ce_result .c-result-text-prod', this.$el).text(text);            
            
            this.renderGauge();
            this.updateGauge(); 
        },
        showShare: function(e) {
            e.preventDefault();
            this.hidePanels();
            $('#ce_share', this.$el).removeClass('hidden').addClass('visible');
        },
        renderGauge: function() {
            var gauge = new Gagauge($('#ce_result canvas',this.$el)[0]); // create sexy gauge!
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
    return EmpresaCalculadoraView;
});