
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
            name: 'username',
            label: 'Username',
            allowBlank: false
        }, {
            xtype: 'textfield',
            name: 'password',
            inputType: 'password',
            label: 'Password',
            allowBlank: false
        }, {
            xtype: 'displayfield',
            hideEmptyLabel: false,
            value: 'Enter any non-blank password'
        }],
        buttons: [{
            text: 'Login',
            formBind: true,
            handler: 'onLoginClick'
            
        }]
    }
});