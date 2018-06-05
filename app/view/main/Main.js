/**
 * This class is the main view for the application. It is specified in app.js as the
 * "mainView" property. That setting causes an instance of this class to be created and
 * added to the Viewport container.
 */
Ext.define('a2m.view.main.Main', {
    extend: 'Ext.tab.Panel',
    xtype: 'app-main',

    requires: [
        'Ext.MessageBox',
        'Ext.layout.Fit'
    ],

    controller: 'main',
    viewModel: 'main',

    defaults: {
        tab: {
            iconAlign: 'top'
        }
    },

    tabBarPosition: 'top',

    items: [
        {
            title: 'Principal',
            iconCls: 'x-fa fa-home',
            layout: 'fit',
            items: [{
                xtype: 'mainlist'
            }]
        }, {
            title: 'Panel Dinámico',
            url: 'agv/panelDinamico.js',
            iconCls: 'x-fa fa-cloud-download',
            bind: {
                html: '{cargandoForm}'
            }
        }, {
            title: 'Groups',
            iconCls: 'x-fa fa-users',
            bind: {
                html: '{cargandoForm}'
            }
        }, {
            title: 'Settings',
            iconCls: 'x-fa fa-cog',
            bind: {
                html: '{cargandoForm}'
            }
        }
    ],
    listeners : {
        activeItemchange:'onTabChange'

    }
});