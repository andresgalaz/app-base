Ext.define('a2m.view.login.Login', {
    extend: 'a2m.view.login.AuthBase',
    xtype: 'login',

    requires: [
        'Ext.form.Panel',
        'Ext.field.Text',
        'Ext.field.Password',
        'Ext.layout.HBox'
    ],
    
    items: [
        {
            xtype: 'formpanel',
            reference: 'frmLogin',
            padding: 20,
            width: 300,
            defaults: {
                margin: '0 0 10 0'
            },
            items: [
                {
                    xtype: 'textfield',
                    name: 'usuario',
                    placeholder: 'Usuario',
                    allowBlank: false
                }, 
                {
                    xtype: 'passwordfield',
                    name: 'password',
                    placeholder: 'Contraseña',
                    allowBlank: false
                }, 
                {
                    xtype: 'component',
                    html: '<a href="#passwordreset">Recuperar Contraseña</a>',
                    // margin: '7 0 0 45'
                },
                {
                    xtype: 'button',
                    width: '100%',
                    text: 'Ingresar',
                    iconAlign: 'right',
                    iconCls: 'x-fa fa-angle-right',
                    ui: 'confirm',
                    handler: 'onLoginClick'
                }
            ]
        }
    ]
});
