Ext.define('a2m.view.login.AuthBase', {
    extend: 'Ext.Panel',
    
    requires: [
        'Ext.layout.VBox', 
        'a2m.view.login.LoginController'
    ],
    
    controller: 'login',
    baseCls: 'auth-locked',

    layout: {
        type: 'vbox',
        align: 'center',
        pack: 'center'
    }
});
