define(['backbone', 'underscore', "../models/EmpresaCalculadora", 'jquery', 'gagauge', 'mexico_paths', 'raphael', 'graphael'], function(backbone, _, EmpresaCalculadora, $, Gagauge, mexico_paths, Raphael) {
    var EmpresaCalculadoraView = Backbone.View.extend({
        tagName: "div",
        id: "ce_view",
        model: new EmpresaCalculadora(),
        r: [],
        dataUrls: {
            opcionesSectoresUrl: './data/empresas/sectores',
            datosUrl: './data/empresas/datos'
        },
        estados: {
            "nacional": {id: 0, name: "NACIONAL"},
            "aguascalientes": {id: 1, name: "AGUASCALIENTES"},
            "baja-california": {id: 2, name: "BAJA CALIFORNIA"},
            "baja-california-sur": {id: 3, name: "BAJA CALIFORNIA SUR"},
            "campeche": {id: 4, name: "CAMPECHE"},
            "coahuila": {id: 5, name: "COAHUILA"},
            "colima": {id: 6, name: "COLIMA"},
            "chiapas": {id: 7, name: "CHIAPAS"},
            "chihuahua": {id: 8, name: "CHIHUAHUA"},
            "df": {id: 9, name: "DISTRITO FEDERAL"},
            "durango": {id: 10, name: "DURANGO"},
            "guanajuato": {id: 11, name: "GUANAJUATO"},
            "guerrero": {id: 12, name: "GUERRERO"},
            "hidalgo": {id: 13, name: "HIDALGO"},
            "jalisco": {id: 14, name: "JALISCO"},
            "mexico": {id: 15, name: "MÉXICO"},
            "michoacan": {id: 16, name: "MICHOACÁN"},
            "morelos": {id: 17, name: "MORELOS"},
            "nayarit": {id: 18, name: "NAYARIT"},
            "nuevo-leon": {id: 19, name: "NUEVO LEON"},
            "oaxaca": {id: 20, name: "OAXACA"},
            "puebla": {id: 21, name: "PUEBLA"},
            "queretaro": {id: 22, name: "QUERÉTARO"},
            "quintana-roo": {id: 23, name: "QUINTANA ROO"},
            "san-luis-potosi": {id: 24, name: "SAN LUIS POTOSI"},
            "sinaloa": {id: 25, name: "SINALOA"},
            "sonora": {id: 26, name: "SONORA"},
            "tabasco": {id: 27, name: "TABASCO"},
            "tamaulipas": {id: 28, name: "TAMAULIPAS"},
            "tlaxcala": {id: 29, name: "TLAXCALA"},
            "veracruz": {id: 30, name: "VERACRUZ"},
            "yucatan": {id: 31, name: "YUCATÁN"},
            "zacatecas": {id: 32, name: "ZACATECAS"}
        },
        initialize: function(opts) {
            var self = this;
            self.$container = opts.container;
            self.loadOptions();
            self.render();
        },
        events: {
            "click #ce_form_element_submit": "showProductivity",
            "click #ce_result_sharebtn": "showShare",
            "click #ce_estado_element_submit" : "loadForm"
        },
        render: function() {
            var self = this, template = _.template($("#ce_main_template").html(), {});
            self.$container.append(self.$el);
            self.$el.html(template).addClass('container-fluid');
            var estadosElement = $('#ce_estado_element_estado', self.$el);
            estadosElement.empty();
            for (var slug in self.estados) {
                estadosElement.append($('<option></option>').val(slug).text(self.estados[slug].name))
            }
            return this;
        },
        loadOptions: function(callback, error) {
            callback = !callback ? function() {
            } : callback;
            error = !error ? function() {
                throw "invalid data"
            } : error;
            var self = this,
                    sectoresRequest = $.ajax({
                        url: self.dataUrls.opcionesSectoresUrl,
                        dataType: 'text',
                    });
            $.when(sectoresRequest).then(function(sectores) {
                self.model.set("opcionesSectores", sectores[0].split("\n"));
                callback.apply(self);
            }, function(e) {
                if (!error) {
                    throw "datos no disponibles";
                } else {
                    error.apply(e, this);
                }
            });

        },
        renderMap: function() {
            var self = this,
                    paths = mexico_paths,
                    container = $('#ce_estado_map', this.$el),
                    r = null;
            this.r = Raphael(container[0]);
            r = this.r;
            r.setViewBox(0, 0, 650, 450, true);
            r.safari();
            var _label = r.popup(50, 50, "").hide();
            var attributes = {
                fill: '#485e96',
                stroke: '#1e336a',
                'stroke-width': 1.5,
                'stroke-linejoin': 'round'
            };
            var arr = new Array();
            for (var correntPath in paths) {
                var obj = r.path(paths[correntPath].path);
                arr[obj.id] = correntPath;
                obj.attr(attributes);
                obj.hover(function() {
                    this.animate({
                        fill: '#733A6A',
                        stroke: '#1F131D'
                    }, 300);
                    var bbox = this.getBBox();
                    _label.attr({
                        text: paths[arr[this.id]].name}).update(bbox.x, bbox.y + bbox.height / 2, bbox.width).toFront().show();
                }, function() {
                    this.animate({
                        fill: attributes.fill,
                        stroke: attributes.stroke
                    }, 300);
                    _label.hide();
                });
                obj.click(function() {
                    //location.href = paths[arr[this.id]].url;
                });
            }
        },
        renderMapEstados: function() {
            var self = this,
                    paths = mexico_paths,
                    container = $('#ce_estado_map_estados', this.$el),
                    r = null,
                    select = $('#ce_estado_element_estado',self.$el);
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
            _.map(paths,function(o,i){
                var obj = r.path(o.path);
                arr[obj.id] = i;
                obj.attr(attributes);
                obj.hover(function() {
                    this.animate({
                        fill: '#733A6A',
                        stroke: '#1F131D'
                    }, 300);
                }, function() {
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
                    r = null;
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
            for (var correntPath in paths) {
                var obj = r.path(paths[correntPath].path);
                arr[obj.id] = correntPath;
                obj.attr(attributes);
                obj.click(function() {
                    window.location.href = '#/empresas/nacional';
                    return false;
                });
            }
        },
        removeMaps: function() {
            _.map(this.r, function(r) {
                r && (r.remove && r.remove());
            })
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
            sectorElement = $('#cp_form_element_sector', self.$el).empty(),
                    estudiosElement = $('#cp_form_element_estudio', self.$el).empty(),
                    horasElement = $('#cp_form_element_horas', self.$el).empty(),
                    salarioElement = $('#cp_form_element_salario', self.$el).val(''),
                    diasElement = $('#cp_form_element_dias', self.$el).empty();

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

                sectorElement.val(self.model.get("sector")).change(function() {
                    self.model.set("sector", sectorElement.val());
                });
                estudiosElement.val(self.model.get("estudio")).change(function() {
                    self.model.set("estudio", estudiosElement.val());
                });
                horasElement.val(self.model.get("horasDia")).change(function() {
                    self.model.set("horasDia", horasElement.val());
                });
                diasElement.val(self.model.get("diasSemana")).change(function() {
                    self.model.set("diasSemana", diasElement.val());
                });

                salarioElement.val(self.model.get("salarioMes")).on("keyup change", function(e) {
                    var oldVal = self.model.get("salarioMes"),
                            numStr = parseFloat(salarioElement.val()).toFixed(2);
                    if (!isNaN(numStr)) {
                        self.model.set("salarioMes", numStr);
                        return numStr;
                    } else {
                        salarioElement.val(oldVal);
                        e.preventDefault;
                        return false;
                    }
                });

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
        loadForm: function(){
            window.location = '#/empresas/'+$('#ce_estado_element_estado', this.$el).val();
        },
        showForm: function(estado) {
            this.hidePanels();
            if(!this.estados[estado]){
                window.location = '#/empresas/';
            }
            this.estados[estado];
            $('#ce_form', this.$el).removeClass('hidden').addClass('visible');
        },
        showProductivity: function() {
            this.hidePanels();
            $('#ce_result', this.$el).removeClass('hidden').addClass('visible');
        },
        showShare: function(e) {
            e.preventDefault();
            this.hidePanels();
            $('#ce_share', this.$el).removeClass('hidden').addClass('visible');
        }
    });
    return EmpresaCalculadoraView;
});