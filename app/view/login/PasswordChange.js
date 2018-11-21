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
            title: 'Contraseña Caducada',
            defaults: { 
                margin: '0 0 20 0',
                xtype: 'passwordfield',
                inputType: 'password',
                allowBlank: false,
            },

            items: [
                {
                    name: 'password_nueva', 
                    reference: 'password_nueva', 
                    itemId: 'password_nueva',
                    label: 'Nueva Contraseña',
                },
                {
                    name: 'password_confirma', 
                    reference: 'password_confirma',
                    label: 'Confirmar Contraseña'
                },
                {
                    xtype: 'button', 
                    text: 'Modificar', 
                    handler: 'onModificarClaveClick',
                    width: '100%', 
                    iconAlign: 'right', 
                    ui: 'bright-blue'
                }
            ]
        }
    ]
});
