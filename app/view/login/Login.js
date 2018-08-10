Ext.define('a2m.view.login.Login', {
    extend: 'a2m.view.login.AuthBase',
    xtype: 'a2m-login',
    controller: 'login',
    requires: ['Ext.form.Panel', 'Ext.field.Text', 'Ext.field.Password', 'Ext.layout.HBox'],

    items: [{
        xtype: 'formpanel',
        reference: 'frmLogin',
        padding: 20,
        width: 300,
        defaults: { margin: '0 0 10 0' },
        items: [{
            name: 'usuario', placeholder: 'Usuario',
            xtype: 'textfield', allowBlank: false
        }, {
            name: 'password', placeholder: 'Contraseña',
            xtype: 'passwordfield',
            allowBlank: false
        }, {
            xtype: 'component', html: '<a href="#passwordreset">Recuperar Contraseña</a>',
        }, {
            text: 'Ingresar', xtype: 'button', handler: 'onLoginClick',
            width: '100%', iconAlign: 'right', iconCls: 'x-fa fa-angle-right', ui: 'confirm'
        }]
    }]
});
