define(['underscore', '../data/mexico_persona_estudios'], function(_, estudios) {

    var efemerides = {};

    _.map(estudios, function(v,i) {
        efemerides[i] = [];
    })
    
    efemerides[0].push('Sabías qué el sector más productivo para una persona con primaria incompleta es el de servicios profesionales, científicos y técnicos.');


    return efemerides;
});