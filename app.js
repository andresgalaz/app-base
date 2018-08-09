/*
 * PE Aplicación para Móviles
 */
Ext.application({
    extend: 'a2m.Application',
    name: 'a2m',
    requires: [
        'a2m.*', 'Ext.grid.Grid', 'Ext.data.JsonStore', 'Ext.scroll.Scroller', 'Ext.field.*', 'Ext.util.Base64'
    ],
    mainView: 'a2m.view.main.Main'

});
