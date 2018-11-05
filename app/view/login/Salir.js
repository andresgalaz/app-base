Ext.define('a2m.view.login.Salir', {
    extend: 'Ext.Panel',
    xtype: 'view.login.Salir',
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    controller: 'login',
    items: [{
        xtype: 'button',
        text: 'Ingresar nuevamente',
        handler: function () {
            location.href = '#view.login.Login';
        }
    }],
    listeners: { beforeshow: 'salir' }
});
