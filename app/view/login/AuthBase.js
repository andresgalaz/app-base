Ext.define('a2m.view.login.AuthBase', {
    extend: 'Ext.Panel',
    
    requires: [
        'Ext.layout.VBox', 
        'a2m.view.login.LoginController',
        'a2m.view.login.PasswordReset'
    ],
    
    controller: 'login',
    baseCls: 'auth-locked',

    layout: {
        type: 'vbox',
        align: 'center',
        pack: 'center'
    }
});
