define(['underscore', '../data/mexico_persona_estudios'], function(_, estudios) {

    var efemerides = {};

    _.map(estudios, function(v,i) {
        efemerides[i] = [];
    })
    
    efemerides[0].push('Sabías qué el sector más productivo para una persona con primaria incompleta es el de servicios profesionales, científicos y técnicos.');
    efemerides[1].push('Sabías qué el sector más productivo para una persona con primaria completa es el servicios de esparcimiento, culturales y deportivos, y otros servicios recreativos');
    efemerides[2].push('Sabías qué el sector más productivo para una persona con secundaria completa es el de dirección de corporativos y empresas.');
    efemerides[3].push('Sabías qué el sector más productivo para una persona con educación media superior y superior es el de dirección de corporativos y empresas.');
    efemerides[4].push('Ahora sabes tu grado de productividad, para una mayor eficacia le sugerímos seleccionar un grado de estudios.');
   
    return efemerides;
});