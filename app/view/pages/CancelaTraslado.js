Ext.define('a2m.view.pages.CancelaTraslado', {
    extend: 'a2m.view.pages.PaginaBase',
    xtype: 'view.pages.CancelaTraslado',

    listeners: {
        cargadatos : 'onCancelaTraslado',
    },

    items: [
        {
            cls: 'base-page-container',
            html: '<div class=\'fa-outer-class\'><span class=\'x-fa fa-ambulance\'></span></div>' +
                '<h1>Traslado cancelado con éxito</h1>'
        }
    ]
});