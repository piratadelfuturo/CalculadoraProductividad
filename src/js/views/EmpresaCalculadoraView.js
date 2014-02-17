define(['backbone', 'underscore', "../models/EmpresaCalculadora", 'jquery', 'gagauge', 'mexico_paths', 'raphael',  'graphael'], function(backbone, _, EmpresaCalculadora, $, Gagauge, mexico_paths, Raphael) {
    var EmpresaCalculadoraView = Backbone.View.extend({
        tagName: "div",
        id: "ce_view",
        model: EmpresaCalculadora,
        r: [],
        initialize: function(opts) {
            var self = this;
            self.$container = opts.container;
            self.render();
        },
        events: {
            "click #ce_form_element_submit": "showProductivity",
            "click #ce_result_sharebtn": "showShare"
        },
        render: function() {
            var self = this, template = _.template($("#ce_main_template").html(), {});
            self.$container.append(self.$el);
            self.$el.html(template).addClass('container-fluid');
            return this;
        },
        renderMap: function() {
            var self = this,
                    paths = mexico_paths,
                    container = $('#ce_estado_map',this.$el),
                    r = null;
            this.r = Raphael(container[0]);
            r = this.r;
            r.setViewBox(0,0,650,450,true);
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
                    container = $('#ce_estado_map_estados',this.$el),
                    r = null;
            r = Raphael(container[0]);
            this.r.push(r);
            r.setViewBox(0,0,650,450,true);
            r.safari();            
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
                }, function() {
                    this.animate({
                        fill: attributes.fill,
                        stroke: attributes.stroke
                    }, 300);
                });
                obj.click(function() {
                    //location.href = paths[arr[this.id]].url;
                });
            }
        },
        renderMapFull: function() {
            var self = this,
                    paths = mexico_paths,
                    container = $('#ce_estado_map_full',this.$el),
                    r = null;
            r = Raphael(container[0]);
            this.r.push(r);
            r.setViewBox(0,0,650,450,true);
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
                    //location.href = paths[arr[this.id]].url;
                });
            }
        },
        removeMaps: function(){
            _.map(this.r,function(r){
                r && (r.remove && r.remove());                
            })
        },
        close: function(){
            this.removeMaps();
            this.remove();
        },
        hidePanels: function() {
            $('.panel', this.$el).addClass('hidden');
            this.removeMaps();
        },
        showEstado: function(){
            this.hidePanels();
            $('#ce_estado', this.$el).removeClass('hidden').addClass('visible');
            this.renderMapEstados();
            this.renderMapFull()
        },
        showForm: function(estado){
            this.hidePanels();
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
        },
        showForm: function() {


        }
    });
    return EmpresaCalculadoraView;
});