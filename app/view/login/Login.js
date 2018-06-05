
Ext.define('a2m.view.login.Login', {
    extend: 'Ext.Dialog',
    xtype: 'login',

    requires: [
        'a2m.view.login.LoginController',
        'Ext.form.Panel'
    ],

    controller: 'login',
    bodyPadding: 10,
    title: 'Login Window',
    closable: false,
    autoShow: true,

    items: {
        xtype: 'formpanel',
        reference: 'form',
        items: [{
            xtype: 'textfield',
            name: 'fldUsuario',
            label: 'Usuario',
            allowBlank: false
        }, {
            xtype: 'textfield',
            name: 'fldPassword',
            inputType: 'password',
            label: 'Contraseña',
            allowBlank: false
        }],
        buttons: [{
            text: 'Login',
            formBind: true,
            handler: 'onLoginClick'
            
        }]
    }
});