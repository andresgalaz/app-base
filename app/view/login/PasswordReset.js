Ext.define('a2m.view.login.PasswordReset', {
    extend: 'a2m.view.login.AuthBase',
    xtype: 'view.login.PasswordReset',
    requires: ['Ext.field.Email'],

    items: [
        {
            xtype: 'formpanel',
            reference: 'frmRecupera',
            bodyPadding: 10,
            defaults: {
                margin: '0 0 20 0'
            },
            items: [
                {
                    xtype: 'component',
                    html: 'Recuperar Contraseña'
                }, 
                {
                    xtype: 'emailfield',
                    label: 'Email con el cual se registró',
                    minWidth: 300
                }, 
                {
                    xtype: 'button',
                    text: 'Reset Password',
                    iconAlign: 'right',
                    iconCls: 'x-fa fa-angle-right',
                    ui: 'action',
                    width: '100%',
                    handler: 'onRecuperarClave'
                }, 
                {
                    xtype: 'component',
                    margin: 0,
                    html: '<a href="#view.login.Login">Volver al login</a>'
                }
            ]
        }
    ]
});
