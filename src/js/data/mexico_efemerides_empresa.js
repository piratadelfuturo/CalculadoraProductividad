define(['underscore', '../data/mexico_empresa_estados', '../data/mexico_empresa_sectores'], function(_, estados, sectores) {

    var efemerides = {};

    _.map(sectores, function(v, i) {
        efemerides[v] = {};
        _.map(estados, function(vv, ii) {
            efemerides[v][vv.id] = '';
        })
    })

    efemerides[0][19] = '¿Sabías qué Nuevo León ocupa el 1º lugar en productividad en cuanto al sector de agricultura y ganadería?';


    return efemerides;
});