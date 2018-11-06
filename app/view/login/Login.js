Ext.define('a2m.view.login.Login', {
    extend: 'a2m.view.login.AuthBase',
    xtype: 'view.login.Login',

    requires: [ 
        'a2m.view.login.PasswordReset',
        'a2m.view.login.PasswordChange'
    ],

    fullscreen : true,

    layout: {
        pack: 'bottom'
    },

    items: [
        {
            xtype: 'formpanel',
            reference: 'frmLogin',
            padding: 10,
            width: 300,
            defaults: { 
                margin: '0 0 20 0' 
            },
            items: [
                {
                    name: 'usuario', 
                    placeholder: 'Usuario',
                    xtype: 'textfield', 
                    allowBlank: false
                }, 
                {
                    name: 'password', 
                    placeholder: 'Contraseña',
                    xtype: 'passwordfield',
                    allowBlank: false
                }, 
                {
                    text: 'Ingresar', 
                    xtype: 'button', 
                    handler: 'onLoginClick',
                    width: '100%', 
                    iconAlign: 'right', 
                    iconCls: 'x-fa fa-angle-right', 
                    ui: 'bright-blue'
                },
                {
                    xtype: 'component', 
                    html: '<a href="#view.login.PasswordReset">Recuperar Contraseña</a>',
                }, 
            ]
        }
    ]
});
