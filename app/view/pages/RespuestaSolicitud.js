Ext.define('a2m.view.pages.RespuestaSolicitud', {
    extend: 'a2m.view.pages.PaginaBase',
    xtype: 'view.pages.RespuestaSolicitud',

    listeners: {
        cargadatos : 'onRespuestaSolicitud',
    },

    items: [
        {
            cls: 'base-page-container',
            html: '<div class=\'fa-outer-class\'><span class=\'x-fa fa-user-md\'></span></div>' +
                '<h1>Respuesta solicitud de deviración</h1><span class=\'base-page-text\'>En caso de asignarle el paciente, será notificado</span>'
        }
    ]
});