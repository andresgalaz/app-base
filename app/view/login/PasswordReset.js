Ext.define('a2m.view.login.PasswordReset', {
    extend: 'a2m.view.login.AuthBase',
    xtype: 'view.login.PasswordReset',
    // requires: ['Ext.field.Email'],

    // fullscreen : true,
    scrollable: 'y',

    layout: {
        pack: 'bottom'
    },

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
                    xtype: 'numberfield',
                    name: 'usuario',
                    label: 'Usuario',
                    allowBlank: false,
                    minWidth: 300
                }, 
                {
                    xtype: 'button',
                    text: 'Recuperar Contraseña',
                    iconAlign: 'right',
                    iconCls: 'x-fa fa-angle-right',
                    ui: 'action',
                    width: '100%',
                    handler: 'onRecuperarClaveClick'
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
