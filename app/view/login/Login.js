Ext.define('a2m.view.login.Login', {
    extend: 'a2m.view.login.AuthBase',
    xtype: 'a2m-login',

    requires: [ 
        'Ext.form.Panel', 
        'Ext.field.Text', 
        'Ext.field.Password', 
        'Ext.layout.HBox', 
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
                    xtype: 'component', 
                    html: '<a href="#passwordreset">Recuperar Contraseña</a>',
                }, 
                {
                    text: 'Ingresar', 
                    xtype: 'button', 
                    handler: 'onLoginClick',
                    width: '100%', 
                    iconAlign: 'right', 
                    iconCls: 'x-fa fa-angle-right', 
                    ui: 'bright-blue'
                }
            ]
        }
    ]
});
