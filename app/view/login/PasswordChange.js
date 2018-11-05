Ext.define('a2m.view.login.PasswordChange', {
    extend: 'a2m.view.login.AuthBase',
    xtype: 'view.login.PasswordChange',

    fullscreen : true,

    layout: {
        pack: 'bottom'
    },

    items: [
        {
            xtype: 'formpanel',
            reference: 'frmPasswordChange',
            padding: 10,
            width: 300,
            defaults: { 
                margin: '0 0 20 0' 
            },
            items: [
                {
                    name: 'password_nueva', 
                    placeholder: 'Nueva Contraseña',
                    xtype: 'passwordfield',
                    allowBlank: false
                },
                {
                    name: 'password_confirma', 
                    placeholder: 'Confirmar Contraseña',
                    xtype: 'passwordfield',
                    allowBlank: false
                },
                {
                    text: 'Modificar', 
                    xtype: 'button', 
                    handler: 'onModificarClaveClick',
                    width: '100%', 
                    iconAlign: 'right', 
                    iconCls: 'x-fa fa-key', 
                    ui: 'bright-blue'
                }
            ]
        }
    ]
});
